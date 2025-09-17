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

type Language = "javascript" | "python" | "c";

export default function ProblemPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState("");
  const [isSolved, setIsSolved] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [testOutput, setTestOutput] = useState<{type: 'output' | 'error', message: string} | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("javascript");

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");
    if (role !== "participant" || !name) {
      router.push("/login");
      return;
    }
    setUserName(name);

    const foundChallenge = challenges.find((c) => c.id.toString() === params.id);
    if (foundChallenge) {
      setChallenge(foundChallenge);
      
      const storedSolved = localStorage.getItem(`${name}_solved`);
      const solvedIds = storedSolved ? JSON.parse(storedSolved) : [];
      const solved = solvedIds.includes(foundChallenge.id);
      setIsSolved(solved);

      const savedCode = localStorage.getItem(`${name}_challenge_${params.id}_code`);
      const savedLang = localStorage.getItem(`${name}_challenge_${params.id}_lang`) as Language | null;
      
      const lang = savedLang || "javascript";
      setSelectedLanguage(lang);

      if(solved) {
        // For solved problems, we might want to show the correct JS solution
        // or the user's saved solution for that language. For now, let's show their saved code.
         setCode(savedCode || foundChallenge.buggyCode[lang]);
      } else {
        setCode(savedCode || foundChallenge.buggyCode[lang]);
      }
    } else {
        setTimeout(() => setChallenge(undefined), 100);
    }
  }, [params.id, router]);
  
  const handleLanguageChange = (lang: Language) => {
    if (isSolved || !challenge) return;
    setSelectedLanguage(lang);
    setCode(challenge.buggyCode[lang]);
    if (userName) {
      localStorage.setItem(`${userName}_challenge_${params.id}_lang`, lang);
      localStorage.setItem(`${userName}_challenge_${params.id}_code`, challenge.buggyCode[lang]);
    }
  };

  const handleCodeChange = (newCode: string) => {
    if (isSolved) return;
    setCode(newCode);
    if (userName) {
      localStorage.setItem(`${userName}_challenge_${params.id}_code`, newCode);
    }
  };
  
  const runCode = (submissionCode: string): { success: boolean; output: any; error?: string } => {
    if (!challenge || selectedLanguage !== 'javascript') {
      // Placeholder for other languages
      return { success: false, output: null, error: `Execution for ${selectedLanguage} is not implemented yet.` };
    }

    try {
      const userFunction = new Function(`return ${submissionCode}`)();
      
      const args = challenge.testCases.input
        .split(',')
        .map(arg => arg.split('=')[1].trim())
        .map(val => JSON.parse(val.replace(/(\w+)\s*:/g, '"$1":')));
        
      const result = userFunction(...args);
      
      return { success: true, output: JSON.stringify(result) };
    } catch (e: any) {
      return { success: false, output: null, error: e.message };
    }
  };

  const handleRun = () => {
    setTestOutput(null);
    const result = runCode(code);
    if (result.error) {
      setTestOutput({ type: 'error', message: result.error });
    } else {
      setTestOutput({ type: 'output', message: result.output });
    }
  };

  const handleSubmit = () => {
    if (!challenge || !userName) return;

    if (selectedLanguage !== 'javascript') {
      toast({
        variant: "destructive",
        title: "Submission not implemented",
        description: `Submission for ${selectedLanguage} is not set up yet.`,
      });
      // In the future, this is where you'd call the external execution API
      return;
    }

    setTestOutput(null);
    const result = runCode(code);

    if (result.error) {
        setTestOutput({ type: 'error', message: result.error });
        toast({
            variant: "destructive",
            title: "Code has errors!",
            description: "Fix the errors before submitting.",
        });
        return;
    }

    const normalizedOutput = result.output?.replace(/\s/g, "");
    const normalizedExpectedOutput = challenge.testCases.output.replace(/\s/g, "");

    if (normalizedOutput === normalizedExpectedOutput) {
      setIsSolved(true);

      const storedSolved = localStorage.getItem(`${userName}_solved`);
      const solvedIds = storedSolved ? JSON.parse(storedSolved) : [];
      if (!solvedIds.includes(challenge.id)) {
        const newSolvedIds = [...solvedIds, challenge.id];
        localStorage.setItem(`${userName}_solved`, JSON.stringify(newSolvedIds));
        
        if (newSolvedIds.length === challenges.length) {
          localStorage.setItem(`${userName}_finishTime`, Date.now().toString());
        }

        window.dispatchEvent(new Event('storage'));
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
                  <SelectItem value="c">C</SelectItem>
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
            <Button variant="outline" onClick={handleRun} disabled={isSolved}>
              Run Code
            </Button>
            <Button onClick={handleSubmit} disabled={isSolved}>
              {isSolved ? 'Solved!' : 'Submit & Check'}
            </Button>
        </div>
      </div>
    </div>
  );
}
