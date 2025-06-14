'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: '',
    rol: 'votante',
    claveVerificacion: '',
    aceptaTerminos: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {}

    if (!formData.dni || formData.dni.length !== 8) {
      newErrors.dni = 'El DNI debe tener 8 dígitos'
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido'
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    }

    if (formData.password !== formData.confirmarPassword) {
      newErrors.confirmarPassword = 'Las contraseñas no coinciden'
    }

    if (!formData.aceptaTerminos) {
      newErrors.aceptaTerminos = 'Debes aceptar los términos y condiciones'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    try {
      console.log('Registro attempt:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push('/auth/login?message=registered')
      
    } catch (error) {
      console.error('Error en registro:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12" 
         style={{ backgroundColor: 'var(--color-primary-light)' }}>
      <div className="w-full max-w-2xl mx-auto p-6">
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
              Registro de usuario
            </h2>
            <p className="text-gray-600">
              Crea tu cuenta para participar en la democracia digital
            </p>
          </div>
          
          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dni" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de DNI
                </label>
                <input 
                  type="text" 
                  id="dni" 
                  name="dni"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Ej. 12345678"
                  maxLength={8}
                  value={formData.dni}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                {errors.dni && <p className="mt-1 text-sm text-red-500">{errors.dni}</p>}
              </div>

              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo
                </label>
                <input 
                  type="text" 
                  id="nombre" 
                  name="nombre"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Ej. Juan Pérez"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                {errors.nombre && <p className="mt-1 text-sm text-red-500">{errors.nombre}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <input 
                type="email" 
                id="email" 
                name="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="usuario@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña segura
                </label>
                <input 
                  type="password" 
                  id="password" 
                  name="password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Mínimo 8 caracteres"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmarPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña
                </label>
                <input 
                  type="password" 
                  id="confirmarPassword" 
                  name="confirmarPassword"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Repite tu contraseña"
                  value={formData.confirmarPassword}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                {errors.confirmarPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmarPassword}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-2">
                  Rol en la plataforma
                </label>
                <select 
                  id="rol" 
                  name="rol"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  value={formData.rol}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                >
                  <option value="votante">Votante</option>
                  <option value="organizador">Organizador</option>
                </select>
              </div>

              <div>
                <label htmlFor="claveVerificacion" className="block text-sm font-medium text-gray-700 mb-2">
                  Código de verificación
                </label>
                <input 
                  type="text" 
                  id="claveVerificacion" 
                  name="claveVerificacion"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Si aplica"
                  value={formData.claveVerificacion}
                  onChange={handleInputChange}
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Requerido solo para roles especiales
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 mt-6">
              <input 
                type="checkbox" 
                name="aceptaTerminos"
                id="aceptaTerminos"
                checked={formData.aceptaTerminos}
                onChange={handleInputChange}
                required 
                disabled={isLoading}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="aceptaTerminos" className="text-sm text-gray-700">
                Acepto los{' '}
                <Link href="/terminos" className="text-blue-600 hover:text-blue-700 underline">
                  términos y condiciones
                </Link>
                {' '}y la{' '}
                <Link href="/privacidad" className="text-blue-600 hover:text-blue-700 underline">
                  política de privacidad
                </Link>
              </label>
            </div>
            {errors.aceptaTerminos && <p className="text-sm text-red-500">{errors.aceptaTerminos}</p>}

            <button 
              type="submit" 
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              style={{
                backgroundColor: 'var(--color-primary)',
                fontFamily: 'Montserrat'
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
          
          {/* Enlaces adicionales */}
          <div className="text-center mt-6 space-y-4">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link 
                href="/auth/login"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Inicia sesión
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
