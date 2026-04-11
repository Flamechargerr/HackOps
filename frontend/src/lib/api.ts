const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 8000);

if (!API_BASE_URL) {
  throw new Error('Missing VITE_API_BASE_URL environment variable');
}

export class ApiError extends Error {
  status: number;
  code?: string;
  requestId?: string;

  constructor(message: string, options: { status: number; code?: string; requestId?: string }) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.requestId = options.requestId;
  }
}

type ApiRequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  token?: string;
  body?: unknown;
  retry?: number;
  timeoutMs?: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function parseResponse(response: Response) {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) return null;

  try {
    return await response.json();
  } catch {
    return null;
  }
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const {
    method = 'GET',
    token,
    body,
    retry = method === 'GET' ? 1 : 0,
    timeoutMs = DEFAULT_TIMEOUT_MS,
  } = options;

  let attempt = 0;
  const maxAttempts = retry + 1;

  while (attempt < maxAttempts) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeout);
      const payload = await parseResponse(response);

      if (!response.ok) {
        const errorEnvelope = payload?.error;
        throw new ApiError(
          errorEnvelope?.message || `Request failed with status ${response.status}`,
          {
            status: response.status,
            code: errorEnvelope?.code,
            requestId: errorEnvelope?.requestId,
          },
        );
      }

      return payload as T;
    } catch (error) {
      clearTimeout(timeout);

      const isLastAttempt = attempt + 1 >= maxAttempts;
      const isAbort = error instanceof DOMException && error.name === 'AbortError';
      const isRetryable = isAbort || (error instanceof ApiError && error.status >= 500);

      if (!isLastAttempt && isRetryable) {
        await sleep(250 * (attempt + 1));
        attempt += 1;
        continue;
      }

      if (isAbort) {
        throw new ApiError('Request timeout', { status: 408, code: 'REQUEST_TIMEOUT' });
      }

      if (error instanceof ApiError) throw error;

      throw new ApiError('Network request failed', { status: 0, code: 'NETWORK_ERROR' });
    }
  }

  throw new ApiError('Request failed', { status: 0, code: 'UNKNOWN_ERROR' });
}
