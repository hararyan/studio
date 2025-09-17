"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProblems, type Problem } from "@/lib/data";

const difficultyVariant: Record<Problem['difficulty'], string> = {
    Easy: 'bg-chart-2 text-white',
    Medium: 'bg-chart-4 text-primary-foreground',
    Hard: 'bg-destructive text-destructive-foreground',
}

const statusVariant: Record<Problem['status'], string> = {
    'Solved': 'bg-green-500/20 text-green-400 border-green-500/50',
    'Attempted': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    'Not Started': 'bg-gray-500/20 text-gray-400 border-gray-500/50',
}


export default function DashboardPage() {
  const problems = getProblems();

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Problems</h1>
        <p className="text-muted-foreground">
          Here are the debugging challenges. Good luck!
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Problem Set</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Status</TableHead>
                <TableHead>Title</TableHead>
                <TableHead className="w-[120px]">Difficulty</TableHead>
                <TableHead className="w-[120px] text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {problems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell>
                    <Badge variant="outline" className={statusVariant[problem.status]}>
                        {problem.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{problem.title}</TableCell>
                  <TableCell>
                    <Badge className={difficultyVariant[problem.difficulty]}>
                      {problem.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="secondary" size="sm">
                      <Link href={`/problems/${problem.id}`}>Solve</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
