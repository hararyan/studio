
import challengesData from './challenges.json';

export type Challenge = {
  id: number;
  title: string;
  description: string;
  buggyCode: string;
  correctCode: string;
  testCases: {
    input: string;
    output: string;
  };
  language: 'javascript';
};

export const challenges: Challenge[] = challengesData;
