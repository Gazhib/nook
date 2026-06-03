import toast from "react-hot-toast";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type RequestOptions = Omit<RequestInit, "method" | "body">;

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const config: RequestInit = {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!res.ok) {
    if (res.status === 401) {
      const errorBody = await res.json().catch(() => ({}));
      const message =
        (errorBody as { message?: string }).message ??
        `Request failed: ${res.status}`;
      console.log(message);
      window.location.href = "/auth";
    } else if (res.status === 400) {
      const errorBody = await res.json().catch(() => ({}));
      const message = errorBody.error ?? `Bad request: ${res.status}`;
      throw new ApiError(message, res.status, errorBody);
    } else if (res.status === 500) {
      toast.error("Server error. Please try again later.");
      const errorBody = await res.json().catch(() => ({}));
      const message =
        (errorBody as { message?: string }).message ??
        `Server error: ${res.status}`;
      throw new ApiError(message, res.status, errorBody);
    }
    const errorBody = await res.json().catch(() => ({}));
    const message =
      (errorBody as { message?: string }).message ??
      `Request failed: ${res.status}`;
    throw new ApiError(message, res.status, errorBody);
  }

  if (res.status === 204) return null as T;
  return res.json() as Promise<T>;
}

export const client = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "GET" }),

  post: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    }),

  patch: <T>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    request<T>(endpoint, { ...options, method: "DELETE" }),
};
