"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, CheckCircle, Terminal } from "lucide-react";

interface TestResultsProps {
  results: {
    type: "output" | "error";
    message: string;
  } | null;
}

export function TestResults({ results }: TestResultsProps) {
  return (
    <Card className="h-[200px] flex flex-col">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Terminal className="h-5 w-5" />
          Console
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 pt-0 overflow-auto">
        {!results && (
          <p className="text-sm text-muted-foreground">
            Click "Run Code" to see the output here.
          </p>
        )}
        {results && (
          <pre
            className={`whitespace-pre-wrap font-code text-sm ${
              results.type === "error"
                ? "text-red-500"
                : "text-foreground"
            }`}
          >
            {results.type === 'error' && <XCircle className="inline-block mr-2 h-4 w-4" />}
            {results.message}
          </pre>
        )}
      </CardContent>
    </Card>
  );
}
