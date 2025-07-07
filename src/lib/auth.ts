// Servicio para manejar autenticación y tokens
import { AuthResponse, UserDto } from './api'

export class AuthService {
  private static readonly ACCESS_TOKEN_KEY = 'votechain_access_token'
  private static readonly REFRESH_TOKEN_KEY = 'votechain_refresh_token'
  private static readonly USER_DATA_KEY = 'votechain_user_data'

  // Guardar tokens y datos del usuario
  static saveAuthData(authData: AuthResponse) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.ACCESS_TOKEN_KEY, authData.accessToken)
      localStorage.setItem(this.REFRESH_TOKEN_KEY, authData.refreshToken)
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify({
        userId: authData.userId,
        email: authData.email,
        tokenType: authData.tokenType
      }))
      
      // Disparar evento personalizado para notificar cambios de autenticación
      console.log('🔐 AuthService: Tokens guardados, disparando evento de autenticación')
      window.dispatchEvent(new CustomEvent('votechain-auth-changed'))
    }
  }

  // Actualizar datos del usuario (después de obtener perfil completo)
  static updateUserData(userData: UserDto) {
    if (typeof window !== 'undefined') {
      const currentData = this.getUserData()
      const updatedData = {
        ...currentData,
        userId: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        dni: userData.dni,
        active: userData.active,
        createdAt: userData.createdAt,
        lastLogin: userData.lastLogin
      }
      localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(updatedData))
      
      // NO disparar evento aquí para evitar bucles infinitos
      console.log('🔐 AuthService: Datos de usuario actualizados (sin evento)')
    }
  }

  // Obtener token de acceso
  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.ACCESS_TOKEN_KEY)
      console.log('🔐 AuthService.getAccessToken():', {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? `${token.substring(0, 10)}...` : 'No token',
        isWindows: true
      })
      return token
    }
    console.log('🔐 AuthService.getAccessToken(): No está en window (SSR)')
    return null
  }

  // Obtener token de refresh
  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY)
    }
    return null
  }

  // Obtener datos del usuario
  static getUserData() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(this.USER_DATA_KEY)
      return userData ? JSON.parse(userData) : null
    }
    return null
  }

  // Verificar si el usuario está autenticado
  static isAuthenticated(): boolean {
    const token = this.getAccessToken()
    const isAuth = !!token
    console.log('🔐 AuthService.isAuthenticated():', {
      isAuthenticated: isAuth,
      hasToken: !!token,
      tokenLength: token ? token.length : 0
    })
    return isAuth
  }

  // Limpiar todos los datos de autenticación
  static logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY)
      localStorage.removeItem(this.REFRESH_TOKEN_KEY)
      localStorage.removeItem(this.USER_DATA_KEY)
      
      // Disparar evento personalizado para notificar logout
      console.log('🔐 AuthService: Logout realizado, disparando evento de autenticación')
      window.dispatchEvent(new CustomEvent('votechain-auth-changed'))
    }
  }

  // Obtener el header de autorización completo
  static getAuthHeader(): string {
    const token = this.getAccessToken()
    return token ? `Bearer ${token}` : ''
  }
}

export default AuthService
