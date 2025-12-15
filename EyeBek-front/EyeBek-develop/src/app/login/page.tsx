'use client';

import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import React from 'react';
import { useRouter } from 'next/navigation';
import GenericButton from '@/components/GenericButton/GenericButton';
// @ts-ignore
import { Alert } from '@/components/alertcomponent/alert.tsx';
import { useLoginForm } from '@/hooks/useLoginForm';

export default function LoginPage() {
  const router = useRouter();
  const {
    formData,
    errors,
    isLoading,
    loginSuccess,
    handleChange,
    handleSubmit,
    clearError,
  } = useLoginForm();

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className='bg-white min-h-screen py-12'>
      <div className='max-w-[1400px] mx-auto px-8 lg:px-12'>
        <div className='max-w-[500px] mx-auto'>
          {/* Header */}
          <div className='text-center mb-6'>
            <h2 className='text-xl lg:text-2xl font-black text-black mb-2'>
              Bienvenidos de vuelta
            </h2>
            <p className='text-sm lg:text-base text-gray-600 leading-relaxed'>
              Ingresa a tu cuenta para gestionar las asistencias de tu empresa
            </p>
          </div>

          {/* Card Principal */}
          <div className='bg-gradient-to-b from-gray-50 to-white rounded-xl p-5 lg:p-6 shadow-md border-2 border-gray-200'>
            
            {/* Tabs de navegación */}
            <div className='flex gap-2 mb-6 bg-gray-200 rounded-xl p-1'>
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="flex-1 py-3 rounded-lg transition-all font-semibold text-sm lg:text-base text-gray-600 hover:text-black"
              >
                Crear cuenta
              </button>
              <button
                type="button"
                className="flex-1 py-3 rounded-lg transition-all font-semibold text-sm lg:text-base bg-black text-white shadow-lg"
              >
                Iniciar sesión
              </button>
            </div>

            {/* Alerta de éxito */}
            {loginSuccess && (
              <div className="mb-6">
                <Alert
                  type="success"
                  title="¡Autentificación exitosa!"
                  message="Redirigiendo al panel de control..."
                />
              </div>
            )}

            {/* Alerta de error general */}
            {errors.general && (
              <div className="mb-6">
                <Alert
                  type="error"
                  title="Error de autenticación"
                  message={errors.general}
                  onClose={() => clearError('general')}
                />
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className='space-y-4'>
              
              {/* Campo Email */}
              <div>
                <label className="block text-gray-700 mb-2 font-semibold text-sm">
                  Correo electrónico
                </label>
                <div className="relative mb-2">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="contacto@empresa.com"
                    className={`w-full pl-12 pr-4 py-3 border-2 rounded-lg focus:outline-none transition-all text-sm lg:text-base text-black ${
                      errors.email
                        ? 'border-red-500 focus:border-red-600 bg-red-50'
                        : 'border-gray-200 focus:border-black'
                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mb-2">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Campo Password */}
              <div>
                <label className="block text-gray-700 mb-2 font-semibold text-sm">
                  Contraseña
                </label>
                <div className="relative mb-2">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    placeholder="**********"
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-lg focus:outline-none transition-all text-sm lg:text-base text-black ${
                      errors.password
                        ? 'border-red-500 focus:border-red-600 bg-red-50'
                        : 'border-gray-200 focus:border-black'
                    } disabled:bg-gray-100 disabled:cursor-not-allowed`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors disabled:cursor-not-allowed"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mb-2">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Recordarme y Olvidaste contraseña */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 cursor-pointer"
                    disabled={isLoading}
                  />
                  <span className="text-gray-600 text-sm lg:text-base">Recordarme</span>
                </label>
                <button
                  type="button"
                  className="text-black font-semibold hover:underline text-sm lg:text-base"
                  disabled={isLoading}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {/* Botón Submit */}
              <div className="mt-8">
                <GenericButton 
                  textButton={isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'} 
                  type='submit' 
                  variant='black' 
                  size='full'
                  className={isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                />
              </div>

              {/* Link a Registro */}
              <p className="text-center text-gray-600 flex justify-center gap-2 text-sm lg:text-base">
                ¿No tienes cuenta?
                <button
                  type="button"
                  onClick={() => router.push('/register')}
                  className="text-black font-semibold hover:underline"
                  disabled={isLoading}
                >
                  Regístrate gratis
                </button>
              </p>
            </form>
          </div>
        </div>

        {/* Features Footer */}
        <div className="flex items-center justify-center gap-4 lg:gap-8 mt-10 text-gray-600 flex-wrap text-sm lg:text-base">
          <div className="flex items-center gap-2">
            <div className='w-5 h-5 bg-black rounded-full flex items-center justify-center'>
              <span className="text-white text-xs">✓</span>
            </div>
            <span>14 días de prueba</span>
          </div>
          <div className="flex items-center gap-2">
            <div className='w-5 h-5 bg-black rounded-full flex items-center justify-center'>
              <span className="text-white text-xs">✓</span>
            </div>
            <span>Sin tarjeta requerida</span>
          </div>
          <div className="flex items-center gap-2">
            <div className='w-5 h-5 bg-black rounded-full flex items-center justify-center'>
              <span className="text-white text-xs">✓</span>
            </div>
            <span>Cancela cuando quieras</span>
          </div>
        </div>
      </div>
    </div>
  );
}