import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useGetMeQuery } from "./authApi";
import { clearAuth, setUser, setStatus } from "./authSlice";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuthHydrator = () => {
  const { data, isLoading, isSuccess } = useGetMeQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    isLoading && dispatch(setStatus("loading"));

    if (isSuccess && !data) {
      dispatch(clearAuth());
      return;
    }

    if (isSuccess && data.data) dispatch(setUser(data.data));
  }, [isLoading, isSuccess, data]);

  return { isLoading };
};

export const useRequireAuth = () => {
  const router = useRouter();
  const { isAuthenticated, user, status } = useAppSelector(
    (store) => store.auth
  );

  useEffect(() => {
    if ((!user || !isAuthenticated) && status !== "loading")
      return router.push("/login");
  }, [isAuthenticated, user, status]);

  return { status, isAuthenticated };
};
