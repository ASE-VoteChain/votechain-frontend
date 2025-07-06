// Hook personalizado para manejar datos del usuario
'use client'

import { useState, useEffect } from 'react'
import { UserDto } from '@/lib/api'
import ApiService from '@/lib/api'
import AuthService from '@/lib/auth'

export interface UseUserReturn {
  user: UserDto | null
  loading: boolean
  error: string | null
  refreshUser: () => Promise<void>
  updateLocalUser: (userData: UserDto) => void
}

function useUser(): UseUserReturn {
  const [user, setUser] = useState<UserDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUser = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = AuthService.getAccessToken()
      if (!token) {
        setUser(null)
        return
      }

      // Intentar obtener datos desde localStorage primero
      const localUserData = AuthService.getUserData()
      if (localUserData?.firstName && localUserData?.lastName) {
        setUser(localUserData as UserDto)
      }

      // Luego obtener datos actualizados del servidor
      const userData = await ApiService.getCurrentUserProfile(token)
      setUser(userData)
      
      // Actualizar localStorage con datos completos
      AuthService.updateUserData(userData)
      
    } catch (err: unknown) {
      console.error('Error obteniendo datos del usuario:', err)
      setError((err as Error).message || 'Error obteniendo datos del usuario')
      
      // Si el token expiró o es inválido, limpiar localStorage
      if ((err as any).status === 401) {
        AuthService.logout()
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    await loadUser()
  }

  const updateLocalUser = (userData: UserDto) => {
    setUser(userData)
    AuthService.updateUserData(userData)
  }

  useEffect(() => {
    loadUser()
  }, [])

  return {
    user,
    loading,
    error,
    refreshUser,
    updateLocalUser
  }
}

export default useUser
