'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useUser from '@/hooks/useUser'
import ApiService from '@/lib/api'
import AuthService from '@/lib/auth'


export default function ProfilePage() {
  const { user, loading, refreshUser } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  })

  // Actualizar form data cuando se cargue el usuario
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || ''
      })
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    if (!user) return

    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const token = AuthService.getAccessToken()
      if (!token) {
        router.push('/auth/login')
        return
      }

      const updatedUser = await ApiService.updateUserProfile(token, formData)
      
      // Actualizar datos locales
      await refreshUser()
      
      setSuccessMessage('Perfil actualizado exitosamente')
      setIsEditing(false)
      
    } catch (error: any) {
      console.error('Error actualizando perfil:', error)
      setErrorMessage(error.message || 'Error actualizando perfil')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    })
    setIsEditing(false)
    setErrorMessage('')
    setSuccessMessage('')
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">No se pudieron cargar los datos del usuario</h2>
          <button
            onClick={() => router.push('/auth/login')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className="flex items-center">
              <div 
                className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                {user.firstName?.charAt(0) || ''}
                {user.lastName?.charAt(0) || ''}
              </div>
              <div className="ml-6">
                <h1 className="text-3xl font-bold text-white">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-blue-100 mt-1">{user.email}</p>
                <p className="text-blue-100 text-sm mt-1">
                  Miembro desde: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Messages */}
            {successMessage && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                ✅ {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                ❌ {errorMessage}
              </div>
            )}

            {/* Profile Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Información Personal
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                      />
                    ) : (
                      <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">
                        {user.firstName || 'No especificado'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellidos
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                      />
                    ) : (
                      <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">
                        {user.lastName || 'No especificado'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isLoading}
                      />
                    ) : (
                      <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">
                        {user.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      DNI
                    </label>
                    <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">
                      {user.dni}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      El DNI no se puede modificar
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isLoading ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Editar Perfil
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Información de Cuenta
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado de la Cuenta
                    </label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      user.active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Último Acceso
                    </label>
                    <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleString() 
                        : 'Nunca'
                      }
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuenta Creada
                    </label>
                    <p className="text-gray-900 py-2 px-3 bg-gray-50 rounded-lg">
                      {new Date(user.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Security Actions */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => router.push('/user/change-password')}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    Cambiar Contraseña
                  </button>
                  <button
                    onClick={() => router.push('/user/statistics')}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Ver Estadísticas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
