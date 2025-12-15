export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export interface UseLoginFormReturn {
  formData: LoginFormData;
  errors: LoginFormErrors;
  isLoading: boolean;
  loginSuccess: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  clearError: (field: keyof LoginFormErrors) => void;
}


export interface LoginRequest {
  email: string;
  password: string;
}


export interface LoginResponse {
  token: string;
  company: Company;
}


export interface Company {
  id: number;
  name: string;
  email: string;
  status: number;
  phone?: string;
  address?: string;
}


export interface CompanyRegisterRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}


export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  title?: string;
}