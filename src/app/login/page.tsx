"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Bug } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [accessCode, setAccessCode] = useState("");

  const handleLogin = () => {
    if (!name.trim()) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Please enter your name.",
      });
      return;
    }

    if (accessCode === "ADMIN2024") {
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userName", name);
      router.push("/admin");
    } else if (accessCode === "DEBUG2024") {
      localStorage.setItem("userRole", "participant");
      localStorage.setItem("userName", name);
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid access code. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
             <Bug className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Welcome to DebugArena</CardTitle>
          <CardDescription className="text-center">
            Enter your name and the access code to begin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="access-code">Access Code</Label>
              <Input
                id="access-code"
                type="password"
                required
                placeholder="e.g., DEBUG2024"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
              />
            </div>
            <Button onClick={handleLogin} className="w-full">
              Start Debugging
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
