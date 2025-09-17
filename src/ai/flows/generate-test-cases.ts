'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating test cases from sample input and output.
 *
 * The flow takes sample input, sample output, and a difficulty level as input, and generates test cases using an LLM.
 * It exports:
 *   - generateTestCases: The function to call to generate test cases.
 *   - GenerateTestCasesInput: The input type for the generateTestCases function.
 *   - GenerateTestCasesOutput: The output type for the generateTestCases function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTestCasesInputSchema = z.object({
  sampleInput: z
    .string()
    .describe('The sample input for the problem.'),
  sampleOutput: z
    .string()
    .describe('The sample output for the problem.'),
  difficulty: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the problem.'),
});
export type GenerateTestCasesInput = z.infer<typeof GenerateTestCasesInputSchema>;

const GenerateTestCasesOutputSchema = z.object({
  testCases: z.array(z.object({
    input: z.string(),
    output: z.string(),
  })).describe('The generated test cases.'),
});
export type GenerateTestCasesOutput = z.infer<typeof GenerateTestCasesOutputSchema>;

export async function generateTestCases(input: GenerateTestCasesInput): Promise<GenerateTestCasesOutput> {
  return generateTestCasesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTestCasesPrompt',
  input: {schema: GenerateTestCasesInputSchema},
  output: {schema: GenerateTestCasesOutputSchema},
  prompt: `You are an expert test case generator for debugging competition problems.

  Given a sample input, a sample output, and a difficulty level, generate a set of diverse test cases that cover various edge cases and scenarios.

  Sample Input: {{{sampleInput}}}
  Sample Output: {{{sampleOutput}}}
  Difficulty: {{{difficulty}}}

  Test Cases:`,
});

const generateTestCasesFlow = ai.defineFlow(
  {
    name: 'generateTestCasesFlow',
    inputSchema: GenerateTestCasesInputSchema,
    outputSchema: GenerateTestCasesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
