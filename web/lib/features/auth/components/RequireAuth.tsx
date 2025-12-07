"use client";

import React from "react";
import { useRequireAuth } from "../hooks";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { status, isAuthenticated } = useRequireAuth();

  if (status === "loading") {
    return <div>IsLoading</div>;
  }

  if (isAuthenticated) return <div>{children}</div>;
};

export default RequireAuth;
