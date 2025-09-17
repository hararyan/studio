
"use client";

import { useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { challenges, Challenge } from "@/lib/challenges";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeEditor } from "@/components/code-editor";
import { useToast } from "@/hooks/use-toast";
import { TestResults } from "@/components/test-results";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PyodideInterface } from "pyodide";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

type Language = "javascript" | "python" | "c";

declare global {
  interface Window {
    loadPyodide: () => Promise<PyodideInterface>;
  }
}

export default function ProblemPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState("");
  const [isSolved, setIsSolved] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [testOutput, setTestOutput] = useState<{type: 'output' | 'error', message: string} | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("javascript");
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);

  async function loadPyodideInstance() {
    if (window.loadPyodide) {
      setIsPyodideLoading(true);
      const pyodideInstance = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
      });
      setPyodide(pyodideInstance);
      setIsPyodideLoading(false);
    }
  }

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const email = localStorage.getItem("userEmail");
    if (role !== "participant" || !email) {
      router.push("/login");
      return;
    }
    setUserEmail(email);

    const foundChallenge = challenges.find((c) => c.id.toString() === params.id);
    if (foundChallenge) {
        setChallenge(foundChallenge);

        const userDocRef = doc(db, "participants", email);
        getDoc(userDocRef).then(docSnap => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const solvedIds = data.solved || [];
                const solved = solvedIds.includes(foundChallenge.id);
                setIsSolved(solved);

                const problemData = data.problems?.[`problem_${params.id}`] || {};
                const savedCode = problemData.code;
                const savedLang = problemData.lang as Language | null;
                
                const lang = savedLang || "javascript";
                
                if(solved) {
                    setCode(savedCode || foundChallenge.correctCode);
                } else {
                    setCode(savedCode || foundChallenge.buggyCode[lang]);
                }
                handleLanguageChange(lang, savedCode || foundChallenge.buggyCode[lang], true);
            }
        });

    } else {
        setTimeout(() => setChallenge(undefined), 100);
    }
    
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
    script.onload = () => loadPyodideInstance();
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, [params.id, router]);
  
  const handleLanguageChange = (lang: Language, newCode?: string, initialLoad = false) => {
    if (isSolved || !challenge) return;

    const codeToSet = newCode ?? challenge.buggyCode[lang];
    setSelectedLanguage(lang);
    setCode(codeToSet);
    if (userEmail && !initialLoad) {
      const userDocRef = doc(db, "participants", userEmail);
      setDoc(userDocRef, {
        problems: {
          [`problem_${params.id}`]: {
            lang: lang,
            code: codeToSet,
          }
        }
      }, { merge: true });
    }
  };

  const handleCodeChange = (newCode: string) => {
    if (isSolved) return;
    setCode(newCode);
    if (userEmail) {
       const userDocRef = doc(db, "participants", userEmail);
       setDoc(userDocRef, {
        problems: {
          [`problem_${params.id}`]: {
            code: newCode,
          }
        }
      }, { merge: true });
    }
  };
  
  const runCode = async (submissionCode: string): Promise<{ success: boolean; output: any; error?: string }> => {
    if (!challenge) {
      return { success: false, output: null, error: `Challenge not loaded.` };
    }

    if (selectedLanguage === 'javascript') {
      try {
        const argsString = challenge.testCases.input.replace(/^[a-zA-Z0-9_]+\s*=\s*/, '');
        const func = new Function(`return (${submissionCode})(${argsString})`);
        const result = func();
        return { success: true, output: JSON.stringify(result) };
      } catch (e: any) {
        return { success: false, output: null, error: e.message };
      }
    }

    if (selectedLanguage === 'python') {
        if (!pyodide) {
            return { success: false, output: null, error: "Pyodide is not loaded yet. Please wait." };
        }
        try {
            const funcNameMatch = challenge.buggyCode.python.match(/def (\w+)/);
            if (!funcNameMatch) return { success: false, error: 'Could not find function name in Python code.', output: null };
            const funcName = funcNameMatch[1];
            
            const args = challenge.testCases.input.replace(/\s/g, '');

            const pythonCode = `
import json
${submissionCode}
result = ${funcName}(${args})
print(json.dumps(result))
`;
            const result = await pyodide.runPythonAsync(pythonCode);
            return { success: true, output: result.trim() };
        } catch (e: any) {
            return { success: false, output: null, error: e.message };
        }
    }

    return { success: false, output: null, error: `Execution for ${selectedLanguage} is not implemented yet.` };
  };

  const handleRun = async () => {
    setTestOutput(null);
    if ((selectedLanguage === 'python' && isPyodideLoading) || (selectedLanguage === 'python' && !pyodide)) {
      setTestOutput({ type: 'error', message: 'Python environment is loading. Please wait a moment...' });
      return;
    }
    const result = await runCode(code);
    if (result.error) {
      setTestOutput({ type: 'error', message: result.error });
    } else {
      setTestOutput({ type: 'output', message: result.output });
    }
  };

  const handleSubmit = async () => {
    if (!challenge || !userEmail) return;

    if (selectedLanguage === 'c') {
      toast({
        variant: "destructive",
        title: "Submission not implemented",
        description: `Submission for C is not set up yet.`,
      });
      return;
    }
    
    if ((selectedLanguage === 'python' && isPyodideLoading) || (selectedLanguage === 'python' && !pyodide)) {
      setTestOutput({ type: 'error', message: 'Python environment is loading. Please wait a moment...' });
      return;
    }

    setTestOutput(null);
    const result = await runCode(code);

    if (result.error) {
        setTestOutput({ type: 'error', message: result.error });
        toast({
            variant: "destructive",
            title: "Code has errors!",
            description: "Fix the errors before submitting.",
        });
        return;
    }

    const normalizedOutput = result.output?.toString().replace(/\s/g, "");
    const normalizedExpectedOutput = challenge.testCases.output.replace(/\s/g, "");

    if (normalizedOutput === normalizedExpectedOutput) {
      setIsSolved(true);
      
      const userDocRef = doc(db, "participants", userEmail);
      await updateDoc(userDocRef, {
        solved: arrayUnion(challenge.id)
      });

      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if(data.solved.length === challenges.length) {
            await updateDoc(userDocRef, {
                finishTime: Date.now()
            });
        }
      }

      toast({
        title: "Success!",
        description: "You've fixed the bug correctly. Great job!",
        className: "bg-green-600 border-green-600 text-white"
      });
      router.push("/dashboard");

    } else {
       setTestOutput({ type: 'output', message: `Your output: ${result.output}\nExpected: ${challenge.testCases.output}` });
      toast({
        variant: "destructive",
        title: "Not quite...",
        description: "Your code ran, but the output is incorrect. Check the console for details.",
      });
    }
  };

  if (challenge === undefined) {
    notFound();
  }
  
  if (!challenge) {
    return <div>Loading...</div>;
  }
  
  const isExecutionDisabled = isSolved || (selectedLanguage === 'python' && isPyodideLoading);

  return (
    <div className="grid h-full flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <header>
            <h1 className="text-3xl font-bold tracking-tight">Challenge #{challenge.id}: {challenge.title}</h1>
            <p className="text-muted-foreground mt-2">{challenge.description}</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Test Cases</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <h3 className="font-semibold">Input</h3>
              <pre className="mt-1 rounded-md bg-muted p-3 font-code text-sm text-muted-foreground">
                {challenge.testCases.input}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold">Expected Output</h3>
              <pre className="mt-1 rounded-md bg-muted p-3 font-code text-sm text-muted-foreground">
                {challenge.testCases.output}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4">
        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Code Editor</CardTitle>
              <Select value={selectedLanguage} onValueChange={(value) => handleLanguageChange(value as Language)} disabled={isSolved}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                  <SelectItem value="c">C (Not Supported)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4">
             <CodeEditor 
                value={code} 
                language={selectedLanguage} 
                onChange={handleCodeChange}
                readOnly={isSolved}
             />
             <TestResults results={testOutput} />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleRun} disabled={isExecutionDisabled}>
              { (selectedLanguage === 'python' && isPyodideLoading) ? 'Loading Python...' : 'Run Code'}
            </Button>
            <Button onClick={handleSubmit} disabled={isExecutionDisabled}>
              {isSolved ? 'Solved!' : 'Submit & Check'}
            </Button>
        </div>
      </div>
    </div>
  );
}
