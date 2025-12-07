import DummyD from "@/components/dummyD";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - TradeGrid",
  description: "Your field service dashboard",
};

export default function DashboardPage() {
  // This will be expanded in the next vertical slice
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome to TradeGrid
        </h1>
        <p className="text-muted-foreground mt-2">
          Your professional field service management dashboard is being built...
        </p>
      </div>

      <DummyD />
    </div>
  );
}
