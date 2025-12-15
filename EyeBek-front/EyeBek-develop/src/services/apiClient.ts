const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://eyebek-1.onrender.com';

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        await this.handleErrorResponse(response);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let errorMessage = `Error: ${response.status}`;
    
    try {
      const errorData = await response.json();
      
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.errors) {
        const errors = Object.values(errorData.errors).flat();
        errorMessage = errors.join(', ');
      } else if (errorData.title) {
        errorMessage = errorData.title;
      }
    } catch (e) {
      errorMessage = response.statusText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  getAuthHeaders(token: string): HeadersInit {
    return {
      'Authorization': `Bearer ${token}`,
    };
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;