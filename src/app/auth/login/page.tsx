'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Aquí iría la lógica de autenticación
      console.log('Login attempt:', { email, password })
      
      // Simulación de login exitoso - redirigir al dashboard
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      router.push('/user/dashboard')
      
    } catch (error) {
      console.error('Error en login:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" 
         style={{ backgroundColor: 'var(--color-primary-light)' }}>
      <div className="w-full max-w-md mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header del formulario */}
          <div className="text-center mb-6">
            <div className="flex justify-center items-center mb-4">
              <h1 className="text-2xl font-bold" 
                  style={{ 
                    fontFamily: 'Montserrat', 
                    color: 'var(--color-primary)' 
                  }}>
                VoteChain
              </h1>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Iniciar sesión
            </h2>
            <p className="text-gray-600">
              Accede a tu cuenta para participar en votaciones
            </p>
          </div>
          
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input 
                type="email" 
                id="email" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="usuario@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input 
                type="password" 
                id="password" 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <div className="text-right mt-2">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: 'var(--color-primary)',
                fontFamily: 'Montserrat'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </form>
          
          {/* Enlaces adicionales */}
          <div className="text-center mt-6 space-y-4">
            <p className="text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link 
                href="/auth/register"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
            <Link 
              href="/" 
              className="inline-block text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Volver a inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
