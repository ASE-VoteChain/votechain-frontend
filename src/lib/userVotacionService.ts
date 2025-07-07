import AuthService from './auth'

// Configuración de la API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Interfaces para las respuestas del backend
export interface VotacionOpcionResponse {
  id: number
  titulo: string
  descripcion: string
  orden: number
  votacionId: number
  totalVotos?: number
  porcentaje?: number
}

export interface VotacionResponse {
  id: number
  titulo: string
  descripcion: string
  categoria: 'GENERAL' | 'INSTITUCIONAL' | 'POLITICA' | 'EDUCATIVA' | 'COMUNITARIA' | 'EMPRESARIAL' | 'OTRA'
  estado: 'CREADA' | 'ABIERTA' | 'CERRADA' | 'SUSPENDIDA' | 'CANCELADA' | 'PROXIMA'
  prioridad: 'ALTA' | 'MEDIA' | 'BAJA'
  fechaInicio: string
  fechaFin: string
  ubicacion?: string
  organizador?: string
  requisitos?: string
  opciones: VotacionOpcionResponse[]
  createdAt: string
  updatedAt: string
  creador?: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
  // Información adicional para usuario autenticado
  hasParticipated?: boolean
  userVote?: {
    opcionId: number
    opcionTitulo: string
    fechaVoto: string
    hashTransaccion?: string
  }
  participantes?: number
  totalElegibles?: number
  blockchainVotingId?: number
  blockchainTransactionHash?: string
  blockchainVerified?: boolean
}

export interface PageResponse<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      sorted: boolean
      unsorted: boolean
      empty: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  totalElements: number
  totalPages: number
  last: boolean
  first: boolean
  size: number
  number: number
  numberOfElements: number
  sort: {
    sorted: boolean
    unsorted: boolean
    empty: boolean
  }
  empty: boolean
}

export interface VotacionFilters {
  page?: number
  size?: number
  estado?: string
  categoria?: string
  participated?: boolean
  search?: string
}

class UserVotacionService {
  
  /**
   * 1. Obtener votaciones para usuario autenticado
   * GET /api/votaciones/user/votaciones
   */
  async getUserVotaciones(filters: VotacionFilters = {}): Promise<PageResponse<VotacionResponse>> {
    try {
      const token = AuthService.getAccessToken()
      console.log('🔐 Estado para endpoint autenticado:', {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'Sin token',
        isAuthenticated: AuthService.isAuthenticated(),
        endpoint: 'user/votaciones',
        context: 'Requiere token de autenticación'
      })
      
      if (!token) {
        throw new Error('No estás autenticado. Inicia sesión para ver tus votaciones.')
      }

      const params = new URLSearchParams()
      
      if (filters.page !== undefined) params.append('page', filters.page.toString())
      if (filters.size !== undefined) params.append('size', filters.size.toString())
      if (filters.estado) params.append('estado', filters.estado)
      if (filters.categoria) params.append('categoria', filters.categoria)
      if (filters.participated !== undefined) params.append('participated', filters.participated.toString())

      const url = `${BASE_URL}/api/votaciones/user/votaciones?${params.toString()}`
      console.log('🔍 Obteniendo votaciones de usuario:', url)
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
      
      console.log('📋 Headers para endpoint autenticado:', {
        hasAuthorization: !!headers.Authorization,
        authHeaderPreview: `Bearer ${token.substring(0, 20)}...`,
        contentType: headers['Content-Type']
      })
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      })

      console.log('📡 Respuesta votaciones de usuario:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      })

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`
        
        try {
          const errorData = await response.json()
          console.error('❌ Error response data:', errorData)
          errorMessage = errorData.message || errorData.error || errorMessage
          
          if (errorData.details) {
            errorMessage += ` - ${errorData.details}`
          }
        } catch (parseError) {
          console.error('❌ Error parsing error response:', parseError)
          if (response.status === 401) {
            errorMessage = 'Tu sesión ha expirado. Inicia sesión nuevamente.'
          } else if (response.status === 403) {
            errorMessage = 'No tienes permisos para ver las votaciones.'
          } else if (response.status === 500) {
            errorMessage = 'Error interno del servidor. Intenta más tarde.'
          }
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('✅ Votaciones de usuario obtenidas:', data)
      return data
    } catch (error) {
      console.error('❌ Error obteniendo votaciones de usuario:', error)
      throw error
    }
  }

  /**
   * 3. Obtener mis votaciones (las que he creado)
   * GET /api/votaciones/mis-votaciones
   */
  async getMisVotaciones(filters: VotacionFilters = {}): Promise<PageResponse<VotacionResponse>> {
    try {
      const token = AuthService.getAccessToken()
      console.log('🔐 Estado para endpoint mis votaciones:', {
        hasToken: !!token,
        tokenLength: token ? token.length : 0,
        tokenPreview: token ? `${token.substring(0, 20)}...` : 'Sin token',
        isAuthenticated: AuthService.isAuthenticated(),
        endpoint: 'mis-votaciones',
        context: 'Requiere token de autenticación'
      })
      
      if (!token) {
        throw new Error('No estás autenticado. Inicia sesión para ver tus votaciones creadas.')
      }

      const params = new URLSearchParams()
      
      if (filters.page !== undefined) params.append('page', filters.page.toString())
      if (filters.size !== undefined) params.append('size', filters.size.toString())

      const url = `${BASE_URL}/votaciones/mis-votaciones?${params.toString()}`
      console.log('🔍 Obteniendo mis votaciones creadas:', url)
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      }
      
      console.log('📋 Headers para mis votaciones:', {
        hasAuthorization: !!headers.Authorization,
        authHeaderPreview: `Bearer ${token.substring(0, 20)}...`,
        contentType: headers['Content-Type']
      })
      
      const response = await fetch(url, {
        method: 'GET',
        headers,
      })

      console.log('📡 Respuesta mis votaciones:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      })

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`
        
        try {
          const errorData = await response.json()
          console.error('❌ Error response data:', errorData)
          errorMessage = errorData.message || errorData.error || errorMessage
          
          if (errorData.details) {
            errorMessage += ` - ${errorData.details}`
          }
        } catch (parseError) {
          console.error('❌ Error parsing error response:', parseError)
          if (response.status === 401) {
            errorMessage = 'Tu sesión ha expirado. Inicia sesión nuevamente.'
          } else if (response.status === 403) {
            errorMessage = 'No tienes permisos para ver las votaciones creadas.'
          } else if (response.status === 500) {
            errorMessage = 'Error interno del servidor. Intenta más tarde.'
          }
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('✅ Mis votaciones obtenidas:', data)
      return data
    } catch (error) {
      console.error('❌ Error obteniendo mis votaciones:', error)
      throw error
    }
  }

  /**
   * Obtener detalle de una votación específica para usuario autenticado
   * GET /api/votaciones/user/votaciones/{id}
   */
  async getUserVotacionDetail(id: number): Promise<VotacionResponse> {
    try {
      const token = AuthService.getAccessToken()
      if (!token) {
        throw new Error('No estás autenticado. Inicia sesión para ver los detalles.')
      }

      const url = `${BASE_URL}/api/votaciones/user/votaciones/${id}`
      console.log('🔍 Obteniendo detalle de votación:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      console.log('📡 Respuesta detalle votación:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      })

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          if (response.status === 401) {
            errorMessage = 'Tu sesión ha expirado. Inicia sesión nuevamente.'
          } else if (response.status === 403) {
            errorMessage = 'No tienes permisos para ver esta votación.'
          } else if (response.status === 404) {
            errorMessage = 'Votación no encontrada.'
          }
        }
        
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('✅ Detalle de votación obtenido:', data)
      return data
    } catch (error) {
      console.error('❌ Error obteniendo detalle de votación:', error)
      throw error
    }
  }

  /**
   * Método principal para obtener votaciones según el contexto
   * Solo permite usuarios autenticados
   */
  async getVotaciones(
    context: 'user' | 'my-votaciones',
    filters: VotacionFilters = {}
  ): Promise<PageResponse<VotacionResponse>> {
    const token = AuthService.getAccessToken()
    const isAuthenticated = AuthService.isAuthenticated()
    
    // Verificar autenticación antes de continuar
    if (!isAuthenticated || !token) {
      throw new Error('Debes iniciar sesión para ver las votaciones.')
    }
    
    console.log(`🔍 Obteniendo votaciones para contexto: ${context}`, {
      filters,
      userState: {
        isAuthenticated,
        hasToken: !!token,
        tokenLength: token ? token.length : 0
      },
      endpoint: context === 'user' ? 'user/votaciones' : 'mis-votaciones',
      willSendAuth: true
    })
    
    try {
      switch (context) {
        case 'user':
          console.log('➡️ Usando endpoint de usuario (con autenticación)')
          return await this.getUserVotaciones(filters)
        case 'my-votaciones':
          console.log('➡️ Usando endpoint mis votaciones (con autenticación)')
          return await this.getMisVotaciones(filters)
        default:
          throw new Error(`Contexto no válido: ${context}`)
      }
    } catch (error) {
      console.error(`❌ Error obteniendo votaciones para contexto ${context}:`, error)
      throw error
    }
  }

  /**
   * Determinar el contexto apropiado basado en la autenticación y parámetros
   * Solo para usuarios autenticados
   */
  determineContext(isAuthenticated: boolean, showOnlyMyVotaciones: boolean = false): 'user' | 'my-votaciones' {
    const token = AuthService.getAccessToken()
    
    console.log('🤔 Determinando contexto:', {
      isAuthenticated,
      showOnlyMyVotaciones,
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      authServiceAuthenticated: AuthService.isAuthenticated()
    })
    
    // Verificar que el usuario esté autenticado
    if (!isAuthenticated || !token) {
      throw new Error('Debes iniciar sesión para ver las votaciones.')
    }
    
    let context: 'user' | 'my-votaciones'
    
    if (showOnlyMyVotaciones) {
      context = 'my-votaciones'
    } else {
      context = 'user'
    }
    
    console.log(`✅ Contexto determinado: ${context}`, {
      explanation: 
        context === 'user' ? 'Usuario autenticado, usar endpoint de usuario' :
        'Usuario autenticado y quiere ver sus votaciones, usar endpoint mis-votaciones'
    })
    
    return context
  }

  /**
   * Mapear estado del backend al frontend
   */
  mapEstado(estado: string): string {
    const estadoMap: Record<string, string> = {
      'CREADA': 'creada',
      'ABIERTA': 'abierta',
      'CERRADA': 'cerrada',
      'SUSPENDIDA': 'suspendida',
      'CANCELADA': 'cancelada',
      'PROXIMA': 'proxima'
    }
    return estadoMap[estado] || estado.toLowerCase()
  }

  /**
   * Mapear categoría del backend al frontend
   */
  mapCategoria(categoria: string): string {
    const categoriaMap: Record<string, string> = {
      'GENERAL': 'General',
      'INSTITUCIONAL': 'Institucional',
      'POLITICA': 'Política',
      'EDUCATIVA': 'Educativa',
      'COMUNITARIA': 'Comunitaria',
      'EMPRESARIAL': 'Empresarial',
      'OTRA': 'Otra'
    }
    return categoriaMap[categoria] || categoria
  }

  /**
   * Mapear prioridad del backend al frontend
   */
  mapPrioridad(prioridad: string): string {
    const prioridadMap: Record<string, string> = {
      'ALTA': 'alta',
      'MEDIA': 'media',
      'BAJA': 'baja'
    }
    return prioridadMap[prioridad] || prioridad.toLowerCase()
  }

  /**
   * Convertir formato de fecha del backend al frontend
   */
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString)
      return date.toISOString().split('T')[0] // YYYY-MM-DD
    } catch {
      return dateString
    }
  }

  /**
   * Validar si el usuario puede votar en una votación
   */
  canUserVote(votacion: VotacionResponse): boolean {
    return votacion.estado === 'ABIERTA' && !votacion.hasParticipated
  }

  /**
   * Obtener porcentaje de participación
   */
  getParticipationRate(votacion: VotacionResponse): number {
    if (!votacion.participantes || !votacion.totalElegibles || votacion.totalElegibles === 0) {
      return 0
    }
    return Math.round((votacion.participantes / votacion.totalElegibles) * 100)
  }
}

const userVotacionService = new UserVotacionService()
export default userVotacionService
