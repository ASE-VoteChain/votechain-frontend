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
  const [lastTokenCheck, setLastTokenCheck] = useState<string | null>(null)

  const loadUser = async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)
      
      const token = AuthService.getAccessToken()
      if (!token) {
        console.log('👤 useUser: No token found, clearing user state')
        setUser(null)
        setLastTokenCheck(null)
        return
      }

      // Evitar múltiples llamadas con el mismo token
      if (!forceRefresh && lastTokenCheck === token) {
        console.log('👤 useUser: Token unchanged, skipping server call')
        setLoading(false)
        return
      }

      // Intentar obtener datos desde localStorage primero
      const localUserData = AuthService.getUserData()
      if (localUserData?.firstName && localUserData?.lastName) {
        console.log('👤 useUser: Setting user from localStorage:', {
          email: localUserData.email,
          firstName: localUserData.firstName,
          lastName: localUserData.lastName
        })
        setUser(localUserData as UserDto)
      }

      // Solo hacer llamada al servidor si el token cambió o es un refresh forzado
      if (forceRefresh || lastTokenCheck !== token) {
        console.log('👤 useUser: Fetching user data from server...')
        const userData = await ApiService.getCurrentUserProfile(token)
        console.log('👤 useUser: User data received from server:', {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName
        })
        setUser(userData)
        setLastTokenCheck(token)
        
        // Actualizar localStorage con datos completos (sin disparar evento)
        AuthService.updateUserData(userData)
      }
      
    } catch (err: unknown) {
      console.error('❌ useUser: Error obteniendo datos del usuario:', err)
      setError((err as Error).message || 'Error obteniendo datos del usuario')
      
      // Si el token expiró o es inválido, limpiar localStorage
      if ((err as any).status === 401) {
        console.log('👤 useUser: Token expired/invalid, logging out')
        AuthService.logout()
        setUser(null)
        setLastTokenCheck(null)
      }
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    console.log('👤 useUser: Refreshing user data...')
    await loadUser(true) // Forzar refresh
  }

  const updateLocalUser = (userData: UserDto) => {
    console.log('👤 useUser: Updating local user:', {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName
    })
    setUser(userData)
    AuthService.updateUserData(userData)
  }

  useEffect(() => {
    console.log('👤 useUser: Initial load on mount')
    loadUser(true) // Forzar carga inicial

    // Listener para cambios en localStorage (cuando el usuario se loguea en otra pestaña)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'votechain_access_token') {
        console.log('👤 useUser: Token changed in storage, reloading user data', {
          newValue: e.newValue ? 'present' : 'null'
        })
        loadUser(true) // Forzar recarga cuando el token cambie
      }
    }

    // Listener personalizado para cambios en el mismo tab (solo para login/logout)
    const handleCustomStorageChange = () => {
      console.log('👤 useUser: Custom storage event triggered, reloading user data')
      loadUser(true) // Forzar recarga
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('votechain-auth-changed', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('votechain-auth-changed', handleCustomStorageChange)
    }
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
