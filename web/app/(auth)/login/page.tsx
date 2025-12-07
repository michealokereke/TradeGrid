import type { Metadata } from "next";
import { LoginForm } from "@/lib/features/auth/components/LoginForm";
import { Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign In - TradeGrid",
  description: "Sign in to your TradeGrid account",
};

export default function LoginPage() {
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
            Sign in to your field service dashboard
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Having trouble signing in?{" "}
          <a href="#" className="text-primary hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
