import RequireAuth from "@/lib/features/auth/components/RequireAuth";
import React from "react";

const RequireAuthLayout = ({ children }: { children: React.ReactNode }) => {
  return <RequireAuth>{children}</RequireAuth>;
};

export default RequireAuthLayout;
