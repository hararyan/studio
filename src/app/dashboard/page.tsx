"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { challenges } from "@/lib/challenges";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [solvedChallenges, setSolvedChallenges] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");

    if (role !== "participant" || !name || !email) {
      router.push("/login");
      return;
    }
    
    setUserName(name);
    setUserEmail(email);

    const storedSolved = localStorage.getItem(`${email}_solved`);
    if (storedSolved) {
      setSolvedChallenges(JSON.parse(storedSolved));
    }

    const storedStartTime = localStorage.getItem(`${email}_startTime`);
    if (storedStartTime) {
      setStartTime(parseInt(storedStartTime, 10));
    } else {
      const now = Date.now();
      localStorage.setItem(`${email}_startTime`, now.toString());
      setStartTime(now);
    }
  }, [router]);

  useEffect(() => {
    if (startTime) {
      const timer = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = (solvedChallenges.length / challenges.length) * 100;

  if (!userName || !userEmail) {
    return null; // or a loading spinner
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {userName}!</h1>
          <p className="text-muted-foreground">
            Here are your debugging challenges. Good luck!
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-lg border bg-card text-card-foreground p-3">
          <Timer className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold tabular-nums">{formatTime(elapsedTime)}</span>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">{solvedChallenges.length} of {challenges.length} challenges solved.</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {challenges.map((challenge) => {
          const isSolved = solvedChallenges.includes(challenge.id);
          return (
            <Card key={challenge.id} className={`flex flex-col justify-between ${isSolved ? 'border-green-500/50' : ''}`}>
              <CardHeader>
                <CardTitle>Challenge #{challenge.id}</CardTitle>
                <CardDescription>{challenge.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/problems/${challenge.id}`}>
                    {isSolved ? 'View Solved' : 'Start Challenge'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
