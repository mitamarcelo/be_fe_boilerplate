import { useSelector } from "react-redux";

import { type RootState } from "@src/store";
import { requestEmpty, requestJson } from "@src/utils/apiClient";
import { getStoredAccessToken } from "@src/utils/authStorage";

type AuthRequestInit = RequestInit & {
  token?: string | null;
};

const withAuthHeaders = (
  init: AuthRequestInit = {},
  fallbackToken: string | null,
): RequestInit => {
  const { token, headers, ...rest } = init;
  const resolvedToken = token ?? fallbackToken;
  const mergedHeaders = new Headers(headers);

  if (resolvedToken) {
    mergedHeaders.set("Authorization", `Bearer ${resolvedToken}`);
  }

  return { ...rest, headers: mergedHeaders };
};

export const useApiClient = () => {
  const stateToken = useSelector((state: RootState) => state.auth.token);
  const storedToken = getStoredAccessToken();
  const token = stateToken ?? storedToken;

  return {
    token,
    requestJson,
    requestEmpty,
    requestAuthJson: <T>(input: RequestInfo | URL, init?: AuthRequestInit) =>
      requestJson<T>(input, withAuthHeaders(init, token)),
    requestAuthEmpty: (input: RequestInfo | URL, init?: AuthRequestInit) =>
      requestEmpty(input, withAuthHeaders(init, token)),
  };
};
