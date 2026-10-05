/**
 * Thin fetch wrapper around the Addispay Go API.
 *
 * The API answers with a `{ success, data }` / `{ success, error }` envelope, so
 * every call unwraps `data` and turns failures into an `ApiError` carrying the
 * server's user-facing message (NFR-REL-002).
 */

const DEFAULT_BASE_URL = "http://localhost:8080/api/v1";

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL
).replace(/\/$/, "");

/** Origin serving uploaded media, derived from the API base URL. */
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1$/, "");

const TOKEN_STORAGE_KEY = "addispay_admin_token";

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }

  get isUnauthorized() {
    return this.status === 401;
  }

  get isForbidden() {
    return this.status === 403;
  }

  get isNotFound() {
    return this.status === 404;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function setStoredToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

/**
 * Resolves media paths returned by the API. Uploads are stored as
 * root-relative paths so the deployment domain can change without a migration.
 */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  /** Attach the stored bearer token. */
  auth?: boolean;
  query?: Record<string, string | number | boolean | undefined | null>;
  /** Next.js fetch caching, used by server components. */
  cache?: RequestCache;
  revalidate?: number;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(
    `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
  );
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

async function unwrap<T>(res: Response): Promise<T> {
  const text = await res.text();
  let payload: unknown = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      throw new ApiError(
        "The server returned an unreadable response.",
        res.status,
      );
    }
  }

  const envelope = payload as {
    success?: boolean;
    data?: T;
    error?: string;
  } | null;

  if (!res.ok || envelope?.success === false) {
    throw new ApiError(
      envelope?.error || "Something went wrong. Please try again later.",
      res.status,
    );
  }

  return (envelope?.data ?? null) as T;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    auth,
    query,
    cache,
    revalidate,
    signal,
  } = options;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = getStoredToken();
    if (!token)
      throw new ApiError("Your session has expired. Please log in again.", 401);
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      cache,
      signal,
      ...(revalidate === undefined ? {} : { next: { revalidate } }),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      throw error;
    throw new ApiError(
      "Unable to reach the Addispay service. Please check your connection and try again.",
      0,
    );
  }

  return unwrap<T>(res);
}

/** Multipart upload helper; `Content-Type` is set by the browser. */
export async function apiUpload<T>(
  path: string,
  file: File,
  options: { auth?: boolean } = {},
): Promise<T> {
  const form = new FormData();
  form.append("file", file);

  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.auth) {
    const token = getStoredToken();
    if (!token)
      throw new ApiError("Your session has expired. Please log in again.", 401);
    headers.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(path), { method: "POST", headers, body: form });
  } catch {
    throw new ApiError(
      "Upload failed. Please check your connection and try again.",
      0,
    );
  }

  return unwrap<T>(res);
}

/** Normalises any thrown value into a message safe to show the user. */
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return "Something went wrong. Please try again later.";
}
