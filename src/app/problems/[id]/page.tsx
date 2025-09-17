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

export default function ProblemPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState("");
  const [isSolved, setIsSolved] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

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

      if(solved) {
        setCode(foundChallenge.correctCode);
      } else {
        const savedCode = localStorage.getItem(`${name}_challenge_${params.id}_code`);
        setCode(savedCode || foundChallenge.buggyCode);
      }
    } else {
        // Delay notFound to allow useEffect to run
        setTimeout(() => setChallenge(undefined), 100);
    }
  }, [params.id, router]);

  const handleCodeChange = (newCode: string) => {
    if (isSolved) return;
    setCode(newCode);
    if (userName) {
      localStorage.setItem(`${userName}_challenge_${params.id}_code`, newCode);
    }
  };

  const handleSubmit = () => {
    if (!challenge || !userName) return;

    // Normalize code by removing whitespace and newlines for comparison
    const normalize = (str: string) => str.replace(/\s/g, "");

    if (normalize(code) === normalize(challenge.correctCode)) {
      setIsSolved(true);

      const storedSolved = localStorage.getItem(`${userName}_solved`);
      const solvedIds = storedSolved ? JSON.parse(storedSolved) : [];
      if (!solvedIds.includes(challenge.id)) {
        const newSolvedIds = [...solvedIds, challenge.id];
        localStorage.setItem(`${userName}_solved`, JSON.stringify(newSolvedIds));
        
        // Check if all challenges are solved
        if (newSolvedIds.length === challenges.length) {
          localStorage.setItem(`${userName}_finishTime`, Date.now().toString());
        }

        window.dispatchEvent(new Event('storage')); // Notify other tabs/components
      }

      toast({
        title: "Success!",
        description: "You've fixed the bug correctly. Great job!",
        className: "bg-green-600 border-green-600 text-white"
      });
      router.push("/dashboard");

    } else {
      toast({
        variant: "destructive",
        title: "Not quite...",
        description: "The bug is still there. Keep trying!",
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
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Code Editor</CardTitle>
              <span className="text-sm font-medium bg-secondary text-secondary-foreground px-3 py-1 rounded-md">
                JavaScript
              </span>
            </div>
          </CardHeader>
          <CardContent className="h-[calc(100%-100px)]">
             <CodeEditor 
                value={code} 
                language={challenge.language} 
                onChange={handleCodeChange}
             />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={handleSubmit} disabled={isSolved}>
              {isSolved ? 'Solved!' : 'Submit & Check'}
            </Button>
        </div>
      </div>
    </div>
  );
}
