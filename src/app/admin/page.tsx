import { TestCaseGenerator } from "./test-case-generator";

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
        <p className="text-muted-foreground">
          Manage problems, students, and competitions.
        </p>
      </header>
      <TestCaseGenerator />
    </div>
  );
}
