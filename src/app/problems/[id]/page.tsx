"use client";

import { notFound } from "next/navigation";
import { getProblems } from "@/lib/data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function ProblemPage({ params }: { params: { id: string } }) {
  const problems = getProblems();
  const problem = problems.find((p) => p.id === params.id);

  if (!problem) {
    // Wait for problems to load
    if (problems.length === 0) {
        return <div>Loading...</div>
    }
    notFound();
  }

  return (
    <div className="grid h-full flex-1 grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <header>
            <h1 className="text-3xl font-bold tracking-tight">{problem.title}</h1>
            <p className="text-muted-foreground">Difficulty: {problem.difficulty}</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Problem Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{problem.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sample</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <h3 className="font-semibold">Sample Input</h3>
              <pre className="mt-1 rounded-md bg-muted p-3 font-code text-sm text-muted-foreground">
                {problem.sampleInput}
              </pre>
            </div>
            <div>
              <h3 className="font-semibold">Sample Output</h3>
              <pre className="mt-1 rounded-md bg-muted p-3 font-code text-sm text-muted-foreground">
                {problem.sampleOutput}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4">
        <Card className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Solution</CardTitle>
              <Select defaultValue="javascript">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript">JavaScript</SelectItem>
                  <SelectItem value="python">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="h-[calc(100%-100px)]">
            <Textarea
              placeholder="Enter your code here..."
              className="h-full resize-none font-code"
              defaultValue={problem.buggyCode}
            />
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
            <Button variant="outline">Run Tests</Button>
            <Button variant="secondary">Submit Solution</Button>
        </div>
      </div>
    </div>
  );
}
