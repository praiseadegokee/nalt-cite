import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Session management
let sessionId: string | null = null;

function getSessionId(): string {
  if (!sessionId) {
    sessionId = localStorage.getItem('chat-session-id');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      localStorage.setItem('chat-session-id', sessionId);
    }
  }
  return sessionId;
}

function getSessionHeaders(): Record<string, string> {
  return {
    'x-session-id': getSessionId()
  };
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = res.statusText;
    try {
      const text = await res.text();
      if (text) {
        const parsed = JSON.parse(text);
        errorMessage = parsed.message || text;
      }
    } catch {
      // If we can't parse the response, use the status text
    }
    throw new Error(`${res.status}: ${errorMessage}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const headers = {
    ...getSessionHeaders(),
    ...(data ? { "Content-Type": "application/json" } : {}),
  };
  
  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  // Store session ID from response headers if provided
  const responseSessionId = res.headers.get('x-session-id');
  if (responseSessionId && responseSessionId !== sessionId) {
    sessionId = responseSessionId;
    localStorage.setItem('chat-session-id', responseSessionId);
  }

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      headers: getSessionHeaders(),
      credentials: "include",
    });

    // Store session ID from response headers if provided
    const responseSessionId = res.headers.get('x-session-id');
    if (responseSessionId && responseSessionId !== sessionId) {
      sessionId = responseSessionId;
      localStorage.setItem('chat-session-id', responseSessionId);
    }

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
