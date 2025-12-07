import baseApi from "@/lib/config/baseApi";
import { ApiResponse } from "@/lib/config/types";
import {
  AcceptInviteInput,
  LoginInput,
  RegisterTenantInput,
} from "./authschema";
import { User } from "./types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<User>, RegisterTenantInput>({
      query: (body) => ({
        url: "/auth/register-tenant",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation<ApiResponse<User>, LoginInput>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<ApiResponse<unknown>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["user"],
    }),

    acceptInvite: builder.mutation<ApiResponse<unknown>, AcceptInviteInput>({
      query: (body) => ({
        url: "/auth/accept-invite",
        method: "POST",
        body,
      }),
    }),

    verifyInvite: builder.query<ApiResponse<unknown>, string>({
      query: (tkn) => ({
        url: `/auth/verify-invite/${tkn}`,
        method: "GET",
      }),
    }),

    getMe: builder.query<ApiResponse<User>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),

      providesTags: ["user"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useVerifyInviteQuery,
  useAcceptInviteMutation,
  useGetMeQuery,
} = authApi;
