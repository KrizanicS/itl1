const API_BASE_URL = 'http://localhost:8081';

export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'driver' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
  error?: string;
}

const TOKEN_KEY = 'auth_token';

export const ApiService = {
  // Get stored token
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Store token
  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Remove token
  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Check if user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken();
  },

  // Health check
  async checkHealth(): Promise<{ status: string; database: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  // Register
  async register(name: string, email: string, password: string, phone?: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, phone }),
    });
    const data = await response.json();
    if (data.success && data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  // Login
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success && data.token) {
      this.setToken(data.token);
    }
    return data;
  },

  // Logout
  logout(): void {
    this.removeToken();
  },

  // Get Profile (Protected)
  async getProfile(): Promise<AuthResponse> {
    const token = this.getToken();
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: {
        'Authorization': token,
      },
    });
    return response.json();
  },

  // Update Profile (Protected)
  async updateProfile(name: string, phone?: string): Promise<AuthResponse> {
    const token = this.getToken();
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify({ name, phone }),
    });
    return response.json();
  },
};
