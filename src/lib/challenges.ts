
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

export const challenges: Challenge[] = [
  {
    id: 1,
    title: 'Two Sum Problem',
    description: 'The function should find two numbers that sum up to the target. The current implementation has a logical error.',
    buggyCode: `function twoSum(nums, target) {
  const numMap = {};
  for (let i = 0; i <= nums.length; i++) { // Hint: Check the loop condition
    const complement = target - nums[i];
    if (numMap[complement] !== undefined) {
      return [numMap[complement], i];
    }
    numMap[nums[i]] = i;
  }
  return [];
}`,
    correctCode: `function twoSum(nums, target) {
  const numMap = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (numMap[complement] !== undefined) {
      return [numMap[complement], i];
    }
    numMap[nums[i]] = i;
  }
  return [];
}`,
    testCases: {
      input: 'nums = [2, 7, 11, 15], target = 9',
      output: '[0, 1]',
    },
    language: 'javascript',
  },
  {
    id: 2,
    title: 'Palindrome Checker',
    description: 'This function fails to correctly identify palindromes for strings with mixed casing. Modify it to be case-insensitive.',
    buggyCode: `function isPalindrome(s) {
  const cleanString = s.replace(/[^a-zA-Z0-9]/g, '');
  const reversedString = cleanString.split('').reverse().join('');
  // The comparison is case-sensitive!
  return cleanString === reversedString;
}`,
    correctCode: `function isPalindrome(s) {
  const cleanString = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  const reversedString = cleanString.split('').reverse().join('');
  return cleanString === reversedString;
}`,
    testCases: {
      input: '"A man, a plan, a canal: Panama"',
      output: 'true',
    },
    language: 'javascript',
  },
  {
    id: 3,
    title: 'Binary Search Off-by-One',
    description: 'A classic off-by-one error in the binary search algorithm is causing it to fail. Find and fix the boundary condition.',
    buggyCode: `function search(nums, target) {
  let left = 0;
  let right = nums.length; // Hint: What should the initial right boundary be?
  while (left <= right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
    correctCode: `function search(nums, target) {
  let left = 0;
  let right = nums.length - 1;
  while (left <= right) {
    let mid = Math.floor(left + (right - left) / 2);
    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}`,
    testCases: {
      input: 'nums = [-1,0,3,5,9,12], target = 9',
      output: '4',
    },
    language: 'javascript',
  },
  {
    id: 4,
    title: 'Fibonacci Sequence Bug',
    description: 'The recursive function for the Fibonacci sequence is incorrect. It is not returning the right values for the sequence.',
    buggyCode: `function fib(n) {
  if (n <= 0) { // Hint: What is the base case for fib(1)?
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  return fib(n - 2) + fib(n - 3); // There's a bug in the recursion
}`,
    correctCode: `function fib(n) {
  if (n <= 1) {
    return n;
  }
  return fib(n - 1) + fib(n - 2);
}`,
    testCases: {
      input: 'n = 6',
      output: '8',
    },
    language: 'javascript',
  },
];
