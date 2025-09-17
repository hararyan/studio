
import challengesData from './challenges.json';

type Language = "javascript" | "python" | "c";

export type Challenge = {
  id: number;
  title: string;
  description: string;
  buggyCode: Record<Language, string>;
  correctCode: string;
  testCases: {
    input: string;
    output: string;
  };
  language: 'javascript'; // Primary language for execution logic
};

export const challenges: Challenge[] = challengesData as Challenge[];
