import baseApi from "@/lib/config/baseApi";
import { ApiResponse } from "@/lib/config/types";
import {
  AcceptInviteInput,
  LoginInput,
  RegisterTenantInput,
} from "./authschema";
import { User } from "./types";
import { clearAuth, setStatus, setUser } from "./authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<ApiResponse<User>, RegisterTenantInput>({
      query: (body) => ({
        url: "/auth/register-tenant",
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
    }),

    login: builder.mutation<ApiResponse<User>, LoginInput>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["user"],
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
      providesTags: ["user"],
    }),

    getMe: builder.query<ApiResponse<User>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      async onQueryStarted(queryArgument, { dispatch, queryFulfilled }) {
        dispatch(setStatus("loading"));
        try {
          const { data } = await queryFulfilled;
          if (data.data) {
            dispatch(setUser(data.data));
          }
        } catch (err) {
          dispatch(clearAuth());
        }
      },
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
