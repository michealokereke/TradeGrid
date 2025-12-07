import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import type { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Mutex } from "./simpleMutex";

const rawBase = fetchBaseQuery({
  baseUrl: `/api`,
  credentials: "include",
});

const mutex = new Mutex();

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBase(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshResult = await rawBase(
          { url: "/auth/refresh", method: "POST" },
          api,
          extraOptions
        );
        if (refreshResult.error) {
          return result;
        }

        result = await rawBase(args, api, extraOptions);
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await rawBase(args, api, extraOptions);
    }
  }

  return result;
};
