import apiClient from './apiClient';
import { LoginRequest, LoginResponse, CompanyRegisterRequest } from '@/types/auth.types';

const TOKEN_KEY = 'eyebek_token';
const COMPANY_KEY = 'eyebek_company';

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        '/companies/login',
        credentials
      );
      
      if (response.token) {
        this.setToken(response.token);
        this.setCompany(response.company);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(data: CompanyRegisterRequest): Promise<any> {
    try {
      const response = await apiClient.post('/companies/register', data);
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(COMPANY_KEY);
    }
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  setCompany(company: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(COMPANY_KEY, JSON.stringify(company));
    }
  }

  getCompany(): any | null {
    if (typeof window !== 'undefined') {
      const company = localStorage.getItem(COMPANY_KEY);
      return company ? JSON.parse(company) : null;
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
export default authService;