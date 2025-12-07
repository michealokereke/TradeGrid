"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  registerTenantSchema,
  generateSlug,
  type RegisterTenantInput,
} from "../authschema";
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
import { useRegisterMutation } from "../authApi";
import { useAppDispatch } from "@/lib/hooks";
import { setStatus } from "../authSlice";
import { ApiErrorResponse } from "@/lib/config/types";
import { toast } from "sonner";

export function RegisterForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [register, { isLoading }] = useRegisterMutation();
  const [slugError, setSlugError] = useState<string | null>(null);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RegisterTenantInput>({
    resolver: zodResolver(registerTenantSchema),
    defaultValues: {
      companyName: "",
      slug: "",
      adminName: "",
      email: "",
      password: "",
    },
  });

  const companyName = watch("companyName");
  const slug = watch("slug");

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const generated = generateSlug(value);
    setValue("slug", generated);
  };

  const onSubmit = async (data: RegisterTenantInput) => {
    try {
      setSlugError(null);
      const result = await register(data).unwrap();
      dispatch(setStatus("refresh"));
      router.push("/dashboard");
    } catch (error) {
      const err = error as ApiErrorResponse;

      // if (error?.data?.slug) {
      //   setSlugError("This URL slug is already taken");
      // }
      toast.error(err.message || "An error occured ");
      console.log(err);
    }
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">
          Create Your Account
        </CardTitle>
        <CardDescription>
          Set up your business and get started managing jobs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Company Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Company Name
            </label>
            <Input
              placeholder="Apex Plumbing"
              {...formRegister("companyName")}
              onChange={(e) => {
                formRegister("companyName").onChange(e);
                handleCompanyNameChange(e);
              }}
              disabled={isLoading}
              className="bg-card border-border h-10"
            />
            {errors.companyName && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.companyName.message}
              </p>
            )}
          </div>

          {/* URL Slug */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Business URL
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                tradegrid.io/
              </span>
              <Input
                placeholder="apex-plumbing"
                {...formRegister("slug")}
                disabled={isLoading}
                className="bg-card border-border h-10"
              />
            </div>
            {(errors.slug || slugError) && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle size={14} />
                {slugError || errors.slug?.message}
              </p>
            )}
          </div>

          {/* Admin Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Your Name
            </label>
            <Input
              placeholder="John Smith"
              {...formRegister("adminName")}
              disabled={isLoading}
              className="bg-card border-border h-10"
            />
            {errors.adminName && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.adminName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="john@apexplumbing.com"
              {...formRegister("email")}
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
            <label className="text-sm font-medium text-foreground">
              Password
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              {...formRegister("password")}
              disabled={isLoading}
              className="bg-card border-border h-10"
            />
            {errors.password && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.password.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Min 8 chars, 1 uppercase letter, 1 special character
            </p>
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
                Creating account...
              </>
            ) : (
              <>
                <CheckCircle2 size={16} className="mr-2" />
                Create Account
              </>
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
