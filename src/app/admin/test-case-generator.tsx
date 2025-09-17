"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import {
  generateTestCases,
  type GenerateTestCasesOutput,
} from "@/ai/flows/generate-test-cases";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  sampleInput: z.string().min(1, "Sample input is required."),
  sampleOutput: z.string().min(1, "Sample output is required."),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

type FormValues = z.infer<typeof formSchema>;

export function TestCaseGenerator() {
  const [generatedCases, setGeneratedCases] =
    useState<GenerateTestCasesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sampleInput: "",
      sampleOutput: "",
      difficulty: "medium",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedCases(null);
    try {
      const result = await generateTestCases(values);
      setGeneratedCases(result);
    } catch (error) {
      console.error("Error generating test cases:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Test Case Generator</CardTitle>
        <CardDescription>
          Generate effective test cases from sample inputs and outputs using AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <FormField
                control={form.control}
                name="sampleInput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sample Input</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., nums = [2, 7, 11, 15], target = 9"
                        className="h-32 resize-none font-code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sampleOutput"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sample Output</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., [0, 1]"
                        className="h-32 resize-none font-code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="difficulty"
              render={({ field }) => (
                <FormItem className="w-full md:w-1/3">
                  <FormLabel>Difficulty / Degree of Freedom</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select difficulty" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="secondary" disabled={isLoading}>
              {isLoading && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Generate Test Cases
            </Button>
          </form>
        </Form>

        {isLoading && (
            <div className="mt-8 text-center text-muted-foreground">
                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                <p className="mt-2">Generating test cases...</p>
            </div>
        )}

        {generatedCases && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold">Generated Cases</h3>
            <div className="mt-4 space-y-4">
              {generatedCases.testCases.map((testCase, index) => (
                <Card key={index} className="bg-background/50">
                  <CardHeader>
                    <CardTitle>Test Case {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold">Input</h4>
                      <pre className="mt-1 rounded-md bg-muted p-3 font-code text-sm">
                        {testCase.input}
                      </pre>
                    </div>
                    <div>
                      <h4 className="font-semibold">Output</h4>
                      <pre className="mt-1 rounded-md bg-muted p-3 font-code text-sm">
                        {testCase.output}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
