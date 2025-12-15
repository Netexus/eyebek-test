'use client';
import { Building2, Mail, Phone, MapPin, Lock } from 'lucide-react';
import React, { useState } from 'react';
import GenericButton from '@/components/GenericButton/GenericButton';

type AuthMode = 'login' | 'register';

interface AuthFormProps {
  initialMode?: AuthMode;
}

export default function AuthForm({ initialMode = 'login' }: AuthFormProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const isLogin = mode === 'login';

  return (
    <div className='py-32 bg-white'>
      <div className='max-w-[1400px] mx-auto px-8 lg:px-12'>
        <div className='max-w-[650px] mx-auto'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl lg:text-5xl font-black text-black mb-5'>
              {isLogin ? 'Bienvenidos de vuelta' : 'Comienza hoy mismo'}
            </h2>
            <p className='text-lg lg:text-x1 text-gray-600 leading-relaxed'>
              {isLogin 
                ? 'Ingresa a tu cuenta para gestionar las asistencias de tu empresa'
                : 'Regístrate y comienza a usar EyeBek en minutos. Sin tarjeta de crédito.'}
            </p>
          </div>
          <div className='bg-gradient-to-b from-gray-50 to-white rounded-3xl p8 lg:p-12 shadow-2xl border-2 border-gray-200'>
            <div className='flex gap-2 mb-10 bg-gray-200 rounded-2xl p-1.5'>
              <button
                type="button"
                onClick={() => setMode('register')}
                className={`flex-1 py-4 rounded-xl transition-all font-semibold ${
                  !isLogin
                    ? 'bg-black text-white shadow-lg'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Crear cuenta
              </button>
              <button
                type="button"
                onClick={() => setMode('login')}
                className={`flex-1 py-4 rounded-xl transition-all font-semibold ${
                  isLogin
                    ? 'bg-black text-white shadow-lg'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                Iniciar sesión
              </button>
            </div>

            <form className='space-y-6'>
              {!isLogin && (
                <label className="block text-gray-700 mb-3 font-semibold">
                  Nombre de la empresa
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Mi empresa S.A."
                      className="w-full pl-12 pr-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all text-base lg:text-lg text-black"
                    />
                  </div>
                </label>
              )}

              <label className="block text-gray-700 mb-3 font-semibold">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  placeholder="contacto@empresa.com"
                  className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all text-base lg:text-lg text-black"
                />
              </div>

              {!isLogin && (
                <>
                  <label className="block text-gray-700 mb-3 font-semibold">
                    Telefono
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="+57 300 123 4567"
                      className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all text-base lg:text-lg text-black"
                    />
                  </div>

                  <label className="block text-gray-700 mb-3 font-semibold">
                    direccion
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="calle 93 # 34sur-45"
                      className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all text-base lg:text-lg text-black"
                    />
                  </div>

                  <label className="block text-gray-700 mb-3 font-semibold">
                    Selecion del plan
                  </label>
                  <select className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all text-base lg:text-lg cursor-pointer text-black">
                    <option>Básico - $49/mes</option>
                    <option>Profesional - $99/mes (Más popular)</option>
                    <option>Empresarial - Contactar</option>
                  </select>
                </>
              )}

              <label className="block text-gray-700 mb-3 font-semibold">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="password"
                  placeholder="**********"
                  className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-black transition-all text-base lg:text-lg text-black"
                />
              </div>

              {isLogin && (
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-5 h-5 cursor-pointer" />
                    <span className="text-gray-600">Recordarme</span>
                  </label>
                  <button
                    type="button"
                    className="text-black font-semibold hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
              )}

              {isLogin ? (
                <GenericButton textButton='Iniciar sesión' type='submit' variant='black' size='full' />
              ) : (
                <button
                  type="submit"
                  className="px-8 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl bg-black text-white hover:bg-gray-900 hover:scale-105 w-full text-lg py-5 mt-8"
                >
                  Crear cuenta gratis
                </button>
              )}

              <p className="text-center text-gray-600 flex justify-center gap-2">
                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                <button
                  type="button"
                  onClick={() => setMode(isLogin ? 'register' : 'login')}
                  className="text-black font-semibold hover:underline"
                >
                  {isLogin ? 'Regístrate gratis' : 'Inicia sesion aquí'}
                </button>
              </p>
            </form>
          </div>
        </div>
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