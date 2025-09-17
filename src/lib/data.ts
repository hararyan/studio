export type Problem = {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Solved' | 'Attempted' | 'Not Started';
  sampleInput: string;
  sampleOutput: string;
};

export const problems: Problem[] = [
  {
    id: '1',
    title: 'Two Sum Variant',
    description: 'The provided code attempts to solve the Two Sum problem, but it has a bug. Given an array of integers `nums` and an integer `target`, the function should return indices of the two numbers such that they add up to `target`. The current implementation fails on certain edge cases. Find and fix the bug.',
    difficulty: 'Easy',
    status: 'Not Started',
    sampleInput: 'nums = [2, 7, 11, 15], target = 9',
    sampleOutput: '[0, 1]',
  },
  {
    id: '2',
    title: 'Palindrome Checker Bug',
    description: 'This function is supposed to check if a string is a palindrome, but it is not working correctly for strings with mixed case and non-alphanumeric characters. Your task is to debug the function to make it correctly identify palindromes while ignoring case and non-alphanumeric characters.',
    difficulty: 'Easy',
    status: 'Solved',
    sampleInput: 'A man, a plan, a canal: Panama',
    sampleOutput: 'true',
  },
  {
    id: '3',
    title: 'Binary Search Off-by-One',
    description: 'The binary search implementation has a subtle off-by-one error that causes it to fail for certain inputs, either by not finding an element that exists or by entering an infinite loop. Identify the incorrect loop condition or pointer update and correct it.',
    difficulty: 'Medium',
    status: 'Attempted',
    sampleInput: 'nums = [-1,0,3,5,9,12], target = 9',
    sampleOutput: '4',
  },
    {
    id: '4',
    title: 'Merge K Sorted Lists - Performance Issue',
    description: 'The current solution for merging k sorted linked lists is functional but highly inefficient, leading to a "Time Limit Exceeded" error on large inputs. Your task is to refactor the code to improve its time complexity. The bug is not in correctness, but in performance.',
    difficulty: 'Hard',
    status: 'Not Started',
    sampleInput: 'lists = [[1,4,5],[1,3,4],[2,6]]',
    sampleOutput: '[1,1,2,3,4,4,5,6]',
  },
  {
    id: '5',
    title: 'Word Break DP Error',
    description: 'A dynamic programming solution for the Word Break problem fails to correctly build the DP table. The logic for checking substrings against the word dictionary is flawed. Debug the nested loops and state transitions to fix the algorithm.',
    difficulty: 'Hard',
    status: 'Not Started',
    sampleInput: 's = "leetcode", wordDict = ["leet", "code"]',
    sampleOutput: 'true',
  },
];

export type LeaderboardEntry = {
  rank: number;
  name: string;
  avatarUrl: string;
  problemsSolved: number;
  time: string;
};

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'Alice', avatarUrl: '1', problemsSolved: 5, time: '02:30:15' },
  { rank: 2, name: 'Bob', avatarUrl: '2', problemsSolved: 4, time: '03:15:45' },
  { rank: 3, name: 'Charlie', avatarUrl: '3', problemsSolved: 4, time: '03:45:20' },
  { rank: 4, name: 'Diana', avatarUrl: '4', problemsSolved: 3, time: '01:50:30' },
  { rank: 5, name: 'Eve', avatarUrl: '5', problemsSolved: 3, time: '02:10:00' },
  { rank: 6, name: 'Frank', avatarUrl: '6', problemsSolved: 2, time: '01:10:55' },
  { rank: 7, name: 'Grace', avatarUrl: '7', problemsSolved: 2, time: '01:25:10' },
  { rank: 8, name: 'Heidi', avatarUrl: '8', problemsSolved: 1, time: '00:30:05' },
];
