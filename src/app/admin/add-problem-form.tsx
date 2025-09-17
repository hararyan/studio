"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { addProblem } from "@/lib/data";

const formSchema = z.object({
  title: z.string().min(1, "Title is required."),
  description: z.string().min(1, "Description is required."),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  sampleInput: z.string().min(1, "Sample input is required."),
  sampleOutput: z.string().min(1, "Sample output is required."),
  buggyCode: z.string().min(1, "Buggy code is required."),
});

type FormValues = z.infer<typeof formSchema>;

export function AddProblemForm() {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      difficulty: "Medium",
      sampleInput: "",
      sampleOutput: "",
      buggyCode: "",
    },
  });

  function onSubmit(values: FormValues) {
    try {
      addProblem({
          ...values,
          id: (Math.random() * 10000).toString(), // Not a robust way to generate IDs
          status: 'Not Started'
      });
      toast({
        title: "Problem Added",
        description: "The new problem has been successfully added.",
      });
      form.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add the problem.",
      });
    }
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>Add New Problem</CardTitle>
            <CardDescription>Fill out the form to add a new debugging challenge.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Problem Title</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Two Sum Variant" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Problem Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Describe the problem and the bug." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="buggyCode"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Buggy Code</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Paste the initial buggy code here." className="font-code" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="sampleInput"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Sample Input</FormLabel>
                        <FormControl>
                            <Textarea placeholder="e.g., nums = [2, 7, 11, 15], target = 9" {...field} />
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
                            <Textarea placeholder="e.g., [0, 1]" {...field} />
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
                    <FormLabel>Difficulty</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <Button type="submit">Add Problem</Button>
            </form>
            </Form>
        </CardContent>
    </Card>
  );
}
