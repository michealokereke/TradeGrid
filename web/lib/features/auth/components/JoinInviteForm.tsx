"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { acceptInviteSchema, type AcceptInviteInput } from "../authschema";
import { useVerifyInviteQuery, useAcceptInviteMutation } from "../authApi";
import { useAppDispatch } from "@/lib/hooks";
import { setUser } from "../authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export function JoinInviteForm() {
  const router = useRouter();
  //const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  //const token = searchParams.get("token") || "";
  const token = "sample-invite-token";

  const { data: inviteData, isLoading: isVerifying } =
    useVerifyInviteQuery(token);
  const [acceptInvite, { isLoading: isAccepting }] = useAcceptInviteMutation();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInviteInput>({
    resolver: zodResolver(acceptInviteSchema),
  });

  const onSubmit = async (data: AcceptInviteInput) => {
    try {
      setError(null);
      const result = await acceptInvite({
        token,
        name: data.name,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      // dispatch(setUser(result.user));
      // localStorage.setItem("authToken", result.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.data?.message || "Failed to accept invitation");
    }
  };

  if (isVerifying) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <Loader2 size={32} className="animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">
              Verifying your invitation...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!inviteData) {
    return (
      <Card className="border-0 shadow-xl">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <AlertCircle size={32} className="mx-auto text-destructive" />
            <p className="font-medium">Invalid or Expired Invitation</p>
            <p className="text-sm text-muted-foreground">
              This invitation link is no longer valid. Please contact your
              administrator.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">Join ACME Corp</CardTitle>
        <CardDescription>
          Set up your account to start receiving jobs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Role Badge */}
          <div className="flex items-center gap-2 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
            <span className="text-sm font-medium text-foreground">Role:</span>
            <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded">
              role
            </span>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Full Name
            </label>
            <Input
              placeholder="Your name"
              {...register("name")}
              disabled={isAccepting}
              className="bg-card border-border h-10"
            />
            {errors.name && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("password")}
              disabled={isAccepting}
              className="bg-card border-border h-10"
            />
            {errors.password && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.password.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Min 8 chars, 1 uppercase, 1 special char
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              {...register("confirmPassword")}
              disabled={isAccepting}
              className="bg-card border-border h-10"
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-xs text-destructive flex items-center gap-2">
                <AlertCircle size={14} />
                {error}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isAccepting}
            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {isAccepting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Accepting invitation...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} className="mr-2" />
                Accept Invitation
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
