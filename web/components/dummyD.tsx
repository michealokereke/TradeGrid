"use client";

import React from "react";
import { Button } from "./ui/button";
import { useLogoutMutation } from "@/lib/features/auth/authApi";
import { useAppDispatch } from "@/lib/hooks";
import { clearAuth } from "@/lib/features/auth/authSlice";
import { toast } from "sonner";
import { ApiErrorResponse } from "@/lib/config/types";

const DummyD = () => {
  const [logOut, { data }] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogOut = async () => {
    try {
      const result = await logOut().unwrap();
      dispatch(clearAuth());
    } catch (error) {
      const err = error as ApiErrorResponse;
      toast.error(err.message || "An error occured ");
      console.log(error);
    }
  };

  return (
    <div>
      <Button
        className="hover:cursor-pointer"
        variant="destructive"
        onClick={handleLogOut}
      >
        LogOut
      </Button>
    </div>
  );
};

export default DummyD;
