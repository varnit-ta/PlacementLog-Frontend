const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export interface User {
  userId: string;
  username: string;
  token: string;
  role?: string;
}

export interface PostBody {
  companyName?: string;
  company?: string;
  role?: string;
  ctc?: string;
  cgpa?: string;
  rounds?: any;
  experience?: string;
  user?: string;
  [key: string]: any;
}

export interface Post {
  id: string;
  user_id: string;
  post_body: PostBody;
  reviewed?: boolean;
}

export interface AuthResponse {
  userid: string;
  username: string;
  regno: string;
  token: string;
}

export interface ApiResponse<T> {
  err: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private decodeToken(token: string): { userId: string; role: string } | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      return {
        userId: payload.user_id,
        role: payload.role
      };
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  private getAuthHeaders(): HeadersInit {
    const user = localStorage.getItem('user');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.token) {
          headers['Authorization'] = `Bearer ${userData.token}`;
        }
        if (userData.userId) {
          headers['X-User-ID'] = userData.userId;
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }

    return headers;
  }

  private getAdminAuthHeaders(): HeadersInit {
    const user = localStorage.getItem('user');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.token) {
          headers['Authorization'] = `Bearer ${userData.token}`;
        }
        // Don't send X-User-ID for admin routes - backend sets X-Admin-ID internally
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    return response.json();
  }

  private async handleWrappedResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }
    const result = await response.json();
    if (result.err) {
      throw new Error(result.message || 'API error');
    }
    return result.data;
  }

  // User Authentication
  async login({ regno, username, password }: { regno?: string; username?: string; password: string }): Promise<AuthResponse> {
    // Only send the field that is provided (regno or username)
    const body: any = { password };
    if (regno) body.regno = regno;
    if (username) body.username = username;
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return this.handleWrappedResponse<AuthResponse>(response);
  }

  async register({ regno, username, password }: { regno: string; username: string; password: string }): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ regno, username, password }),
    });
    return this.handleWrappedResponse<AuthResponse>(response);
  }

  async logout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    await this.handleResponse(response);
  }

  // Admin Authentication
  async adminLogin(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return this.handleWrappedResponse<AuthResponse>(response);
  }

  async adminRegister(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/admin/register`, {
      method: 'POST',
      headers: this.getAdminAuthHeaders(),
      body: JSON.stringify({ username, password }),
    });
    return this.handleWrappedResponse<AuthResponse>(response);
  }

  async adminLogout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/logout`, {
      method: 'POST',
      headers: this.getAdminAuthHeaders(),
    });
    await this.handleResponse(response);
  }

  // Posts
  async getAllPosts(): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return this.handleWrappedResponse<Post[]>(response);
  }

  async getUserPosts(): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/posts/user`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });
    return this.handleWrappedResponse<Post[]>(response);
  }

  async createPost(postBody: PostBody): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ post_body: postBody }),
    });
    return this.handleWrappedResponse<Post>(response);
  }

  async updatePost(postId: string, postBody: PostBody): Promise<Post> {
    const response = await fetch(`${API_BASE_URL}/posts?id=${postId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ post_body: postBody }),
    });
    return this.handleWrappedResponse<Post>(response);
  }

  async deletePost(postId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/posts?id=${postId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    await this.handleResponse(response);
  }

  // Admin Posts Management
  async getAllPostsForAdmin(): Promise<Post[]> {
    const response = await fetch(`${API_BASE_URL}/admin/posts`, {
      method: 'GET',
      headers: this.getAdminAuthHeaders(),
    });
    return this.handleWrappedResponse<Post[]>(response);
  }

  async reviewPost(postId: string, action: 'approve' | 'reject'): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/posts/review?id=${postId}&action=${action}`, {
      method: 'PUT',
      headers: this.getAdminAuthHeaders(),
    });
    await this.handleResponse(response);
  }

  async deletePostAsAdmin(postId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/admin/posts?id=${postId}`, {
      method: 'DELETE',
      headers: this.getAdminAuthHeaders(),
    });
    await this.handleResponse(response);
  }

  // Helper method to check if user is admin
  isUserAdmin(): boolean {
    const user = localStorage.getItem('user');
    if (!user) return false;
    
    try {
      const userData = JSON.parse(user);
      if (!userData.token) return false;
      
      const decoded = this.decodeToken(userData.token);
      return decoded?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }
}

export const apiService = new ApiService(); 