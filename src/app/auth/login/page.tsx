'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ApiService from '@/lib/api'
import AuthService from '@/lib/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [attemptCount, setAttemptCount] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0)
  const router = useRouter()

  // Configuración de bloqueo por intentos fallidos
  const MAX_ATTEMPTS = 3
  const BLOCK_DURATION = 300 // 5 minutos en segundos
  // Efecto para manejar el timer de bloqueo
  useEffect(() => {
    if (isBlocked && blockTimeRemaining > 0) {
      const timer = setInterval(() => {
        setBlockTimeRemaining(prev => {
          if (prev <= 1) {
            setIsBlocked(false)
            setAttemptCount(0)
            setErrorMessage('')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isBlocked, blockTimeRemaining])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isBlocked) {
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    
    try {
      // Llamar a la API de login
      const authResponse = await ApiService.login({
        email,
        password
      })
      
      // Login exitoso - guardar tokens y datos del usuario
      AuthService.saveAuthData(authResponse)
      console.log('Login exitoso para:', authResponse.email)
      
      // Obtener datos completos del usuario
      try {
        const userProfile = await ApiService.getCurrentUserProfile(authResponse.accessToken)
        AuthService.updateUserData(userProfile)
      } catch (profileError) {
        console.warn('No se pudieron obtener los datos del perfil:', profileError)
        // Continuar sin los datos del perfil, se obtendrán después
      }
      
      // Resetear contadores
      setAttemptCount(0)
      setErrorMessage('')
      
      // Redirigir al dashboard
      router.push('/user/public-stats')
      
    } catch (error: any) {
      console.error('Error en login:', error)
      
      // Incrementar contador de intentos
      const newAttemptCount = attemptCount + 1
      setAttemptCount(newAttemptCount)
      
      if (newAttemptCount >= MAX_ATTEMPTS) {
        // Bloquear después de 3 intentos
        setIsBlocked(true)
        setBlockTimeRemaining(BLOCK_DURATION)
        setErrorMessage(`Demasiados intentos fallidos. Cuenta bloqueada por ${BLOCK_DURATION / 60} minutos.`)
      } else {
        // Mostrar error específico de la API o genérico
        const remainingAttempts = MAX_ATTEMPTS - newAttemptCount
        let errorMsg = 'Credenciales incorrectas.'
        
        // Personalizar mensaje según el error de la API
        if (error.status === 401) {
          errorMsg = 'Email o contraseña incorrectos.'
        } else if (error.status === 404) {
          errorMsg = 'Usuario no encontrado.'
        } else if (error.status >= 500) {
          errorMsg = 'Error del servidor. Intenta más tarde.'
        } else if (error.message) {
          errorMsg = error.message
        }
        
        setErrorMessage(`${errorMsg} Te quedan ${remainingAttempts} intento${remainingAttempts !== 1 ? 's' : ''}.`)
      }
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
            {/* Mensaje de error o bloqueo */}
            {errorMessage && (
              <div className={`p-4 rounded-lg border ${
                isBlocked 
                  ? 'bg-red-50 border-red-200 text-red-800' 
                  : 'bg-yellow-50 border-yellow-200 text-yellow-800'
              }`}>
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    {isBlocked ? '🔒 ' : '⚠️ '}
                    {errorMessage}
                  </span>
                </div>
                {isBlocked && blockTimeRemaining > 0 && (
                  <div className="mt-2 text-sm">
                    Tiempo restante: <span className="font-mono font-semibold">{formatTime(blockTimeRemaining)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Indicador de intentos */}
            {attemptCount > 0 && !isBlocked && (
              <div className="text-center">
                <div className="inline-flex space-x-1">
                  {[...Array(MAX_ATTEMPTS)].map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full ${
                        index < attemptCount 
                          ? 'bg-red-500' 
                          : 'bg-gray-300'
                      }`}
                      title={`Intento ${index + 1}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Intentos fallidos: {attemptCount} de {MAX_ATTEMPTS}
                </p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>              <input 
                type="email" 
                id="email" 
                className={`w-full px-4 py-3 border rounded-lg transition-colors text-black ${
                  isBlocked 
                    ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="usuario@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || isBlocked}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>              <input 
                type="password" 
                id="password" 
                className={`w-full px-4 py-3 border rounded-lg transition-colors text-black ${
                  isBlocked 
                    ? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || isBlocked}
              />
              <div className="text-right mt-2">
                <Link 
                  href="/auth/forgot-password" 
                  className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>            <button 
              type="submit" 
              className={`w-full py-3 px-4 font-semibold rounded-lg transition-all duration-200 ${
                isBlocked || isLoading
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:transform hover:-translate-y-0.5 hover:shadow-lg'
              }`}
              style={{
                backgroundColor: isBlocked || isLoading ? undefined : 'var(--color-primary)',
                fontFamily: 'Montserrat'
              }}
              disabled={isLoading || isBlocked}
            >
              {isBlocked 
                ? `Bloqueado (${formatTime(blockTimeRemaining)})` 
                : isLoading 
                ? 'Iniciando sesión...' 
                : 'Iniciar sesión'
              }
            </button>
          </form>          {/* Enlaces adicionales */}
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
