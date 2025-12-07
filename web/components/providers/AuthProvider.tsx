"use client";

import { useAuthHydrator } from "@/lib/features/auth/hooks";
import React from "react";

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useAuthHydrator();

  return <div>{children}</div>;
};

export default AuthProvider;
