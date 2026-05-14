const BASE_URL = import.meta.env.VITE_API_URL || 'https://verify-s.onrender.com';

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: any;
  params?: Record<string, string | number | boolean | undefined>;
}

export async function apiClient<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...customConfig } = options;
  
  const token = localStorage.getItem('taskverify_token');
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const config: RequestInit = {
    method: options.method || (options.body ? 'POST' : 'GET'),
    ...customConfig,
    headers: {
      ...defaultHeaders,
      ...headers,
    } as HeadersInit,
  };

  if (options.body) {
    if (options.body instanceof FormData) {
      config.body = options.body;
      // Remove Content-Type header to allow browser to set boundary
      if (config.headers && (config.headers as Record<string, string>)['Content-Type']) {
        delete (config.headers as Record<string, string>)['Content-Type'];
      }
    } else if (typeof options.body === 'object') {
      config.body = JSON.stringify(options.body);
    } else {
      config.body = options.body;
    }
  }

  try {
    const response = await fetch(url.toString(), config);
    
    if (response.status === 401) {
      localStorage.removeItem('taskverify_token');
      // Optional: window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Some endpoints might return empty body
    if (response.status === 204) return {} as T;
    
    return await response.json();
  } catch (error) {
    console.error('API Call Error:', error);
    throw error;
  }
}
