"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginInput } from "../authschema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks";
import { useLoginMutation } from "../authApi";
import { setStatus } from "../authSlice";
import { ApiErrorResponse } from "@/lib/config/types";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setStatus("refresh"));
      router.push("/dashboard");
    } catch (error) {
      const err = error as ApiErrorResponse;
      toast.error(err.message || "An error occured ");
      console.error("Login failed:", error);
    }
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>
          Sign in to manage your field service business
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              {...register("email")}
              disabled={isLoading}
              className="bg-card border-border h-10"
            />
            {errors.email && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <a href="#" className="text-xs text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={isLoading}
              className="bg-card border-border h-10"
            />
            {errors.password && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} className="ml-2" />
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
