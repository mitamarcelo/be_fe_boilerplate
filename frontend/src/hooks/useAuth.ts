import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { type AppDispatch, type RootState } from "@src/store";
import { clearAuth, setAuth, setToken } from "@src/store/authSlice";
import { useApiClient } from "@src/hooks/useApiClient";
import {
  clearStoredAccessToken,
  setStoredAccessToken,
} from "@src/utils/authStorage";

const AUTH_BASE_URL = "/api/v1/auth";

type AuthCredentials = {
  email: string;
  password: string;
};

type RegisterResponse = {
  id: string;
  email: string;
  createdAt: string;
};

type LoginResponse = {
  accessToken: string;
};

type MeResponse = {
  id: string;
  email: string;
};

export const useRegisterMutation = () => {
  const { requestJson } = useApiClient();

  return useMutation({
    mutationFn: async (credentials: AuthCredentials) =>
      requestJson<RegisterResponse>(`${AUTH_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }),
  });
};

export const useLoginMutation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const queryClient = useQueryClient();
  const { requestJson } = useApiClient();

  return useMutation({
    mutationFn: async (credentials: AuthCredentials) =>
      requestJson<LoginResponse>(`${AUTH_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      }),
    onSuccess: (data) => {
      setStoredAccessToken(data.accessToken);
      dispatch(setToken(data.accessToken));
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
};

export const useLogoutMutation = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { requestAuthEmpty, token } = useApiClient();

  return useMutation({
    mutationFn: async () => {
      if (!token) {
        return;
      }

      await requestAuthEmpty(`${AUTH_BASE_URL}/logout`, { method: "POST" });
    },
    onSettled: () => {
      clearStoredAccessToken();
      dispatch(clearAuth());
    },
  });
};

export const useValidateSessionQuery = (token: string | null) => {
  const dispatch = useDispatch<AppDispatch>();
  const { requestAuthJson } = useApiClient();

  const result = useQuery({
    queryKey: ["auth", "me", token],
    queryFn: async () =>
      requestAuthJson<MeResponse>(`${AUTH_BASE_URL}/me`, {
        method: "GET",
        token,
      }),
    enabled: Boolean(token),
  });

  useEffect(() => {
    if (result.data) {
      dispatch(setAuth({ token, email: result.data.email }));
    }
  }, [dispatch, result.data, token]);

  useEffect(() => {
    if (result.isError) {
      clearStoredAccessToken();
      dispatch(clearAuth());
    }
  }, [dispatch, result.isError]);

  return result;
};

export const useAuthBootstrap = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return useValidateSessionQuery(token);
};
