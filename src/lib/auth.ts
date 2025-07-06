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
    }
  }

  // Obtener token de acceso
  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.ACCESS_TOKEN_KEY)
    }
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
    return !!this.getAccessToken()
  }

  // Limpiar todos los datos de autenticación
  static logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.ACCESS_TOKEN_KEY)
      localStorage.removeItem(this.REFRESH_TOKEN_KEY)
      localStorage.removeItem(this.USER_DATA_KEY)
    }
  }

  // Obtener el header de autorización completo
  static getAuthHeader(): string {
    const token = this.getAccessToken()
    return token ? `Bearer ${token}` : ''
  }
}

export default AuthService
