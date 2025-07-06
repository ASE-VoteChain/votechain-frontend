// Configuración de la API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Tipos para las respuestas de la API
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  dni: string
  firstName: string
  lastName: string
  password: string
  confirmPassword: string
  verificationCode?: string
}

export interface AuthResponse {
  userId: number
  email: string
  accessToken: string
  refreshToken: string
  tokenType: string
}

export interface UserDto {
  id: number
  email: string
  firstName: string
  lastName: string
  dni: string
  active: boolean
  createdAt: string
  lastLogin?: string
}

export interface UserUpdateRequest {
  firstName: string
  lastName: string
  email: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export interface UserStatistics {
  totalVotesParticipated: number
  totalVotationsCreated: number
  totalVotationsWon: number
  participationRate: number
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface ApiError {
  message: string
  status: number
  timestamp: string
}

// Función helper para manejar respuestas de la API
async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Error de conexión con el servidor',
      status: response.status,
      timestamp: new Date().toISOString()
    }))
    
    throw {
      message: errorData.message || `Error ${response.status}`,
      status: response.status,
      timestamp: errorData.timestamp || new Date().toISOString()
    } as ApiError
  }
  
  return response.json()
}

// Clase principal para manejar la API
export class ApiService {
  private static baseUrl = BASE_URL

  // Método para hacer login
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify(credentials)
    })

    return handleApiResponse<AuthResponse>(response)
  }

  // Método para hacer registro
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      },
      body: JSON.stringify(userData)
    })

    return handleApiResponse<AuthResponse>(response)
  }

  // === ENDPOINTS DE USUARIO ===

  // Obtener perfil del usuario actual
  static async getCurrentUserProfile(token: string): Promise<UserDto> {
    const response = await fetch(`${this.baseUrl}/api/users/profile`, {
      method: 'GET',
      headers: this.getAuthHeaders(token)
    })

    return handleApiResponse<UserDto>(response)
  }

  // Actualizar perfil del usuario actual
  static async updateUserProfile(token: string, userData: UserUpdateRequest): Promise<UserDto> {
    const response = await fetch(`${this.baseUrl}/api/users/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(userData)
    })

    return handleApiResponse<UserDto>(response)
  }

  // Obtener información pública de un usuario
  static async getUserById(id: number): Promise<UserDto> {
    const response = await fetch(`${this.baseUrl}/api/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    })

    return handleApiResponse<UserDto>(response)
  }

  // Obtener todos los usuarios (solo admin)
  static async getAllUsers(
    token: string, 
    page: number = 0, 
    size: number = 10, 
    search?: string
  ): Promise<PageResponse<UserDto>> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    })
    
    if (search) {
      params.append('search', search)
    }

    const response = await fetch(`${this.baseUrl}/api/users?${params}`, {
      method: 'GET',
      headers: this.getAuthHeaders(token)
    })

    return handleApiResponse<PageResponse<UserDto>>(response)
  }

  // Cambiar contraseña
  static async changePassword(token: string, passwordData: ChangePasswordRequest): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/api/users/change-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(passwordData)
    })

    return handleApiResponse<{ message: string }>(response)
  }

  // Obtener estadísticas del usuario
  static async getUserStatistics(token: string): Promise<UserStatistics> {
    const response = await fetch(`${this.baseUrl}/api/users/profile/statistics`, {
      method: 'GET',
      headers: this.getAuthHeaders(token)
    })

    return handleApiResponse<UserStatistics>(response)
  }

  // Desactivar cuenta
  static async deactivateAccount(token: string): Promise<{ message: string }> {
    const response = await fetch(`${this.baseUrl}/api/users/profile/deactivate`, {
      method: 'POST',
      headers: this.getAuthHeaders(token)
    })

    return handleApiResponse<{ message: string }>(response)
  }

  // Método para obtener headers con autorización
  static getAuthHeaders(token: string) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': '*/*'
    }
  }
}

export default ApiService
