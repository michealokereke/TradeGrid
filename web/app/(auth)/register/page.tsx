import type { Metadata } from "next";

import { Zap } from "lucide-react";
import { RegisterForm } from "@/lib/features/auth/components/RegisterForm";

export const metadata: Metadata = {
  title: "Create Account - TradeGrid",
  description: "Sign up for TradeGrid field service management",
};

export default function RegisterPage() {
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
            Manage your field service business with confidence
          </p>
        </div>

        {/* Register Form */}
        <RegisterForm />

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
}
