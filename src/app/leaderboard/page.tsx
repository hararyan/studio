import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
  import { leaderboard } from "@/lib/data";
  import { PlaceHolderImages } from "@/lib/placeholder-images";
  
  export default function LeaderboardPage() {
    return (
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-muted-foreground">
            See who is leading the competition.
          </p>
        </header>
  
        <Card>
          <CardHeader>
            <CardTitle>Top Debuggers</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Problems Solved</TableHead>
                  <TableHead>Total Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboard.map((entry) => {
                  const avatar = PlaceHolderImages.find(p => p.id === entry.avatarUrl);
                  return (
                    <TableRow key={entry.rank}>
                      <TableCell className="font-bold text-lg text-muted-foreground">
                        {entry.rank}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={avatar?.imageUrl} data-ai-hint={avatar?.imageHint} />
                            <AvatarFallback>{entry.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{entry.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{entry.problemsSolved}</TableCell>
                      <TableCell>{entry.time}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }
  