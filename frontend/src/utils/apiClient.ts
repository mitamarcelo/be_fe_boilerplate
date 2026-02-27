const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "";

const buildJsonError = async (response: Response): Promise<Error> => {
  const fallbackMessage = `Request failed with status ${response.status}`;

  try {
    const payload = (await response.json()) as { message?: string };
    return new Error(payload.message ?? fallbackMessage);
  } catch {
    return new Error(fallbackMessage);
  }
};

const resolveUrl = (input: RequestInfo | URL): RequestInfo | URL => {
  if (typeof input !== "string") {
    return input;
  }

  if (!API_BASE_URL) {
    return input;
  }

  const normalizedBase = API_BASE_URL.replace(/\/+$/, "");
  const normalizedPath = input.startsWith("/") ? input : `/${input}`;

  return `${normalizedBase}${normalizedPath}`;
};

export const requestJson = async <T>(
  input: RequestInfo | URL,
  init: RequestInit,
): Promise<T> => {
  const response = await fetch(resolveUrl(input), init);

  if (!response.ok) {
    throw await buildJsonError(response);
  }

  return (await response.json()) as T;
};

export const requestEmpty = async (
  input: RequestInfo | URL,
  init: RequestInit,
): Promise<void> => {
  const response = await fetch(resolveUrl(input), init);

  if (!response.ok) {
    throw await buildJsonError(response);
  }
};
