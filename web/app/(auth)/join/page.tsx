import type { Metadata } from "next";
import { JoinInviteForm } from "@/lib/features/auth/components/JoinInviteForm";
import { Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Join Team - TradeGrid",
  description: "Accept your TradeGrid team invitation",
};

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-primary rounded-lg">
              <Zap size={24} className="text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">TradeGrid</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            You've been invited to join a team
          </p>
        </div>

        {/* Join Form */}
        <JoinInviteForm />
      </div>
    </div>
  );
}
