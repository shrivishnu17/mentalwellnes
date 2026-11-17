const API_BASE = "/api";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

function getToken(): string | null {
  return localStorage.getItem("mindwell_token");
}

async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Auth API
export const authAPI = {
  register: (name: string, email: string, password: string) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email: string, password: string) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => apiRequest("/auth/me"),
};

// Therapists API
export const therapistsAPI = {
  getAll: (search?: string) =>
    apiRequest(`/therapists${search ? `?search=${encodeURIComponent(search)}` : ""}`),

  getById: (id: string) => apiRequest(`/therapists/${id}`),
};

// Appointments API
export const appointmentsAPI = {
  create: (data: {
    therapistId: string;
    date: string;
    time: string;
    type?: string;
    notes?: string;
  }) =>
    apiRequest("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAll: () => apiRequest("/appointments"),

  update: (id: string, data: { status?: string; notes?: string }) =>
    apiRequest(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

// Chat API
export const chatAPI = {
  send: (content: string) =>
    apiRequest("/chat", {
      method: "POST",
      body: JSON.stringify({ content }),
    }),

  getHistory: () => apiRequest("/chat"),
};

export const adminAPI = {
  getStats: () => apiRequest<{ patients: number; therapists: number; admins: number; appointments: number }>("/admin/stats"),
};

export { getToken };

