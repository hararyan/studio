"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

// This is a placeholder for real data fetching
const getParticipantData = () => {
    if (typeof window === "undefined") return [];
    
    const data = [];
    const emails = new Set<string>();

    // First, find all unique participant emails
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.endsWith("_solved") || key.endsWith("_startTime"))) {
            emails.add(key.split('_')[0]);
        }
    }

    // Then, construct data for each participant
    for (const email of emails) {
        const solvedKey = `${email}_solved`;
        const startKey = `${email}_startTime`;
        const finishKey = `${email}_finishTime`;
        const name = localStorage.getItem(email) || email; // Fallback to email if name not found
        
        const solved = JSON.parse(localStorage.getItem(solvedKey) || "[]");
        const startTime = localStorage.getItem(startKey);
        const finishTime = localStorage.getItem(finishKey);
        
        // This is a check to ensure we are only tracking participants, not admins or other data
        if (!localStorage.getItem(solvedKey) && !localStorage.getItem(startKey)) continue;


        let timeTaken = "In Progress";
        if (startTime && finishTime) {
            const duration = parseInt(finishTime, 10) - parseInt(startTime, 10);
            const totalSeconds = Math.floor(duration / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            timeTaken = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        data.push({
            name: name,
            email: email,
            score: solved.length,
            time: timeTaken,
            solvedQuestions: solved,
        });
    }

    return data.sort((a, b) => b.score - a.score || a.time.localeCompare(b.time));
};


export default function AdminPage() {
    const router = useRouter();
    const [participantData, setParticipantData] = useState<any[]>([]);
    
    useEffect(() => {
        const role = localStorage.getItem("userRole");
        if (role !== "admin") {
            router.push("/login");
        } else {
             // Initial load
            setParticipantData(getParticipantData());

            // Set up interval to refresh data
            const interval = setInterval(() => {
                setParticipantData(getParticipantData());
            }, 2000); // Refresh every 2 seconds

            return () => clearInterval(interval);
        }
    }, [router]);


    const totalParticipants = participantData.length;
    const avgScore = totalParticipants > 0 ? participantData.reduce((acc, p) => acc + p.score, 0) / totalParticipants : 0;
    const completionRate = totalParticipants > 0 ? (participantData.filter(p => p.score === 4).length / totalParticipants) * 100 : 0;

    const exportToCSV = () => {
        const headers = "Rank,Name,Email,Score,Time\n";
        const csvContent = participantData
            .map((p, index) => `${index + 1},${p.name},${p.email},${p.score},${p.time}`)
            .join("\n");
        const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "leaderboard.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <div className="flex flex-col gap-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground">
                        Live results from the debugging competition.
                    </p>
                </div>
                <Button onClick={exportToCSV}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                </Button>
            </header>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Participants</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{totalParticipants}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Average Score</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{avgScore.toFixed(2)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Completion Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{completionRate.toFixed(1)}%</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Live Leaderboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Rank</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Score</TableHead>
                                <TableHead>Completion Time</TableHead>
                                <TableHead>Q1</TableHead>
                                <TableHead>Q2</TableHead>
                                <TableHead>Q3</TableHead>
                                <TableHead>Q4</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {participantData.map((p, index) => (
                                <TableRow key={p.email}>
                                    <TableCell className="font-bold text-lg">{index + 1}</TableCell>
                                    <TableCell>{p.name}</TableCell>
                                    <TableCell>{p.email}</TableCell>
                                    <TableCell>{p.score}/4</TableCell>
                                    <TableCell>{p.time}</TableCell>
                                    {[1, 2, 3, 4].map(qId => (
                                        <TableCell key={qId}>
                                            <span className={`w-4 h-4 rounded-full inline-block ${p.solvedQuestions.includes(qId) ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
