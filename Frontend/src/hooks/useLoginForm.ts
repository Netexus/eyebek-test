'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';
import { LoginFormData, LoginFormErrors, UseLoginFormReturn } from '@/types/auth.types';

export const useLoginForm = (): UseLoginFormReturn => {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false); 

  
  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'El email es requerido';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Correo inválido';
    }
    
    return undefined;
  };

  // Validación de password
  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'La contraseña es requerida';
    }
    
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return undefined;
  };

  
  const validateForm = (): boolean => {
    const newErrors: LoginFormErrors = {};
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    
    if (name === 'email') {
      const error = validateEmail(value);
      setErrors(prev => ({
        ...prev,
        email: error,
      }));
    }
    
    if (name === 'password') {
      const error = validatePassword(value);
      setErrors(prev => ({
        ...prev,
        password: error,
      }));
    }
  };

  
  const clearError = (field: keyof LoginFormErrors) => {
    setErrors(prev => ({
      ...prev,
      [field]: undefined,
    }));
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    
    setErrors(prev => ({ ...prev, general: undefined }));
    setLoginSuccess(false); 
    
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      console.log('Login exitoso:', response);
      console.log('Token guardado:', authService.getToken());
      console.log('Empresa:', authService.getCompany());

      
      setLoginSuccess(true);
      
     
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);
      
    } catch (error: any) {
      console.error('Error en login:', error);
      
      setErrors({
        general: error.message || 'Error al iniciar sesión. Verifica tus credenciales.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    loginSuccess, 
    handleChange,
    handleSubmit,
    clearError,
  };
};