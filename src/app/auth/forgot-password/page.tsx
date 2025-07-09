'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState<'email' | 'code' | 'password'>('email')
  const [errorMessage, setErrorMessage] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const router = useRouter()

  // Email válido para recuperación (mismo del login)
  const VALID_EMAIL = 'sebastian1987102@gmail.com'
  // Código de verificación fijo para desarrollo
  const generateVerificationCode = () => {
    // Código fijo: 652915
    return '652915'
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    
    try {
      // Simulación de tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Validar si el email existe en el sistema
      if (email === VALID_EMAIL) {        // Email válido - generar y "enviar" código
        const code = generateVerificationCode()
        setGeneratedCode(code)
        setCurrentStep('code')
        // Código fijo para desarrollo: 652915
        console.log('Código de verificación generado:', code) // Solo para desarrollo
        console.log('Correo de verificación enviado a:', email)
      } else {
        // Email no encontrado
        setErrorMessage('No encontramos una cuenta asociada a este correo electrónico.')
      }
      
    } catch (error) {
      console.error('Error en recuperación:', error)
      setErrorMessage('Error interno del servidor. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    
    try {
      // Simulación de tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Validar código
      if (verificationCode === generatedCode) {
        // Código correcto - ir al paso de nueva contraseña
        setCurrentStep('password')
        console.log('Código verificado correctamente')
      } else {
        // Código incorrecto
        setErrorMessage('El código de verificación es incorrecto. Verifica e intenta nuevamente.')
      }
      
    } catch (error) {
      console.error('Error en verificación:', error)
      setErrorMessage('Error interno del servidor. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')
    
    try {
      // Validar que las contraseñas coincidan
      if (newPassword !== confirmPassword) {
        setErrorMessage('Las contraseñas no coinciden.')
        setIsLoading(false)
        return
      }

      // Validar fortaleza de contraseña
      if (newPassword.length < 8) {
        setErrorMessage('La contraseña debe tener al menos 8 caracteres.')
        setIsLoading(false)
        return
      }

      // Simulación de tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simular actualización de contraseña
      console.log('Contraseña actualizada para:', email)
      console.log('Nueva contraseña:', newPassword)
      
      // Redirigir al login con mensaje de éxito
      router.push('/auth/login?message=password-updated')
      
    } catch (error) {
      console.error('Error al actualizar contraseña:', error)
      setErrorMessage('Error interno del servidor. Intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }
  const handleResendCode = async () => {
    setIsLoading(true)
    setErrorMessage('')
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      const newCode = generateVerificationCode()
      setGeneratedCode(newCode)
      setVerificationCode('')
      // Código fijo reenviado: 652915
      console.log('Nuevo código de verificación generado:', newCode)
    } catch (error) {
      console.error('Error al reenviar código:', error)
      setErrorMessage('Error al reenviar código.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToEmail = () => {
    setCurrentStep('email')
    setVerificationCode('')
    setErrorMessage('')
  }

  const handleBackToVerification = () => {
    setCurrentStep('code')
    setNewPassword('')
    setConfirmPassword('')
    setErrorMessage('')
  }
  // Paso 1: Solicitar email
  if (currentStep === 'email') {
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
                Recuperar contraseña
              </h2>
              <p className="text-gray-600">
                Ingresa tu correo electrónico y te enviaremos un código de verificación
              </p>
            </div>
            
            {/* Formulario */}
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {/* Mensaje de error */}
              {errorMessage && (
                <div className="p-4 rounded-lg border bg-red-50 border-red-200 text-red-800">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">
                      ⚠️ {errorMessage}
                    </span>
                  </div>
                </div>
              )}

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
                <p className="text-xs text-gray-500 mt-2">
                  Debe ser el correo asociado a tu cuenta de VoteChain
                </p>
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
                {isLoading ? 'Enviando código...' : 'Enviar código de verificación'}
              </button>
            </form>
            
            {/* Enlaces adicionales */}
            <div className="text-center mt-6 space-y-4">
              <p className="text-gray-600">
                ¿Recordaste tu contraseña?{' '}
                <Link 
                  href="/auth/login"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Iniciar sesión
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

  // Paso 2: Verificar código
  if (currentStep === 'code') {
    return (
      <div className="min-h-screen flex items-center justify-center" 
           style={{ backgroundColor: 'var(--color-primary-light)' }}>
        <div className="w-full max-w-md mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Header del formulario */}            <div className="text-center mb-6">
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
                Verificar código
              </h2>
              <p className="text-gray-600">
                Hemos enviado un código de 6 dígitos a <strong>{email}</strong>
              </p>
            </div>
            
            {/* Formulario */}
            <form onSubmit={handleVerificationSubmit} className="space-y-4">
              {/* Mensaje de error */}
              {errorMessage && (
                <div className="p-4 rounded-lg border bg-red-50 border-red-200 text-red-800">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">
                      ⚠️ {errorMessage}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                  Código de verificación
                </label>
                <input 
                  type="text" 
                  id="verificationCode" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-center text-xl font-mono tracking-widest"
                  placeholder="000000"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Ingresa el código de 6 dígitos que recibiste
                </p>
              </div>

              <button 
                type="submit" 
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  fontFamily: 'Montserrat'
                }}
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? 'Verificando código...' : 'Verificar código'}
              </button>
            </form>
            
            {/* Enlaces adicionales */}
            <div className="text-center mt-6 space-y-4">
              <button
                onClick={handleResendCode}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors text-sm"
                disabled={isLoading}
              >
                Reenviar código
              </button>
              <br />
              <button
                onClick={handleBackToEmail}
                className="text-gray-600 hover:text-gray-700 transition-colors text-sm"
              >
                ← Cambiar correo electrónico
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Paso 3: Nueva contraseña
  if (currentStep === 'password') {
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
                Nueva contraseña
              </h2>
              <p className="text-gray-600">
                Crea una nueva contraseña segura para tu cuenta
              </p>
            </div>
            
            {/* Formulario */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {/* Mensaje de error */}
              {errorMessage && (
                <div className="p-4 rounded-lg border bg-red-50 border-red-200 text-red-800">
                  <div className="flex items-center">
                    <span className="text-sm font-medium">
                      ⚠️ {errorMessage}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva contraseña
                </label>
                <input 
                  type="password" 
                  id="newPassword" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 8 caracteres
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar nueva contraseña
                </label>
                <input 
                  type="password" 
                  id="confirmPassword" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Repite la misma contraseña
                </p>
              </div>

              {/* Indicador de coincidencia de contraseñas */}
              {newPassword && confirmPassword && (
                <div className={`text-xs p-2 rounded ${
                  newPassword === confirmPassword 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {newPassword === confirmPassword 
                    ? '✅ Las contraseñas coinciden' 
                    : '❌ Las contraseñas no coinciden'
                  }
                </div>
              )}

              <button 
                type="submit" 
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  fontFamily: 'Montserrat'
                }}
                disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              >
                {isLoading ? 'Actualizando contraseña...' : 'Actualizar contraseña'}
              </button>
            </form>
            
            {/* Enlaces adicionales */}
            <div className="text-center mt-6">
              <button
                onClick={handleBackToVerification}
                className="text-gray-600 hover:text-gray-700 transition-colors text-sm"
              >
                ← Volver a verificación
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
