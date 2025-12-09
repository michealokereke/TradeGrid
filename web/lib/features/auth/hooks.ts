import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useGetMeQuery } from "./authApi";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuthHydrator = () => {
  const { data, isLoading, isSuccess, isError } = useGetMeQuery();

  // const dispatch = useAppDispatch();

  // useEffect(() => {
  //   isLoading && dispatch(setStatus("loading"));

  //   if (isError) {
  //     dispatch(clearAuth());
  //     return;
  //   }

  //   if (isSuccess && data.data) dispatch(setUser(data.data));

  // }, [isLoading, isSuccess, data]);

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
