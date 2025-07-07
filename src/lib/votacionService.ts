import AuthService from './auth'

// Configuración de la API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

// Interfaces para las votaciones
export interface VotacionOpcion {
  id?: number
  votacionId?: number
  titulo: string
  descripcion: string
  imagen?: string
  orden: number
  porcentaje?: number
  totalVotos?: number
}

export interface CreateVotacionRequest {
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
  opciones: VotacionOpcion[]
}

export interface Votacion {
  id: number
  titulo: string
  descripcion: string
  categoria: string
  estado: string
  prioridad: string
  fechaInicio: string
  fechaFin: string
  ubicacion?: string
  organizador?: string
  requisitos?: string
  opciones: VotacionOpcion[]
  createdAt: string
  updatedAt: string
  creador?: {
    id: number
    firstName: string
    lastName: string
    email: string
  }
}

class VotacionService {
  
  /**
   * Crear nueva votación
   */
  async createVotacion(votacionData: CreateVotacionRequest): Promise<Votacion> {
    try {
      const token = AuthService.getAccessToken()
      if (!token) {
        throw new Error('No estás autenticado. Inicia sesión para crear votaciones.')
      }

      const url = `${BASE_URL}/api/votaciones`
      console.log('🔍 Creando votación en:', url)
      console.log('📋 Datos de votación:', votacionData)
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(votacionData)
      })

      console.log('📡 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      })

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`
        
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
          
          // Manejar errores específicos
          if (errorData.details) {
            errorMessage += ` - ${errorData.details}`
          }
        } catch {
          if (response.status === 401) {
            errorMessage = 'Tu sesión ha expirado. Inicia sesión nuevamente.'
          } else if (response.status === 403) {
            errorMessage = 'No tienes permisos para crear votaciones.'
          } else if (response.status === 400) {
            errorMessage = 'Los datos de la votación son inválidos. Revisa los campos.'
          } else if (response.status >= 500) {
            errorMessage = 'Error interno del servidor. Intenta más tarde.'
          }
        }
        
        throw new Error(errorMessage)
      }

      const newVotacion = await response.json()
      console.log('✅ Votación creada exitosamente:', newVotacion)
      return newVotacion
    } catch (error) {
      console.error('❌ Error creando votación:', error)
      throw error
    }
  }

  /**
   * Obtener todas las votaciones del usuario (las que he creado)
   */
  async getUserVotaciones(page: number = 0, size: number = 10): Promise<any> {
    try {
      const token = AuthService.getAccessToken()
      if (!token) {
        throw new Error('No estás autenticado.')
      }

      const url = `${BASE_URL}/votaciones/mis-votaciones?page=${page}&size=${size}`
      console.log('🔍 Obteniendo mis votaciones:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
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
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          if (response.status === 401) {
            errorMessage = 'Tu sesión ha expirado. Inicia sesión nuevamente.'
          } else if (response.status === 403) {
            errorMessage = 'No tienes permisos para ver las votaciones.'
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
   * Obtener votación por ID
   */
  async getVotacionById(id: number): Promise<Votacion> {
    try {
      const token = AuthService.getAccessToken()
      if (!token) {
        throw new Error('No estás autenticado.')
      }

      const url = `${BASE_URL}/votaciones/user/votaciones/${id}`
      console.log('🔍 Obteniendo votación por ID:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      console.log('📡 Respuesta votación por ID:', {
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
      console.log('✅ Votación obtenida:', data)
      return data
    } catch (error) {
      console.error('❌ Error obteniendo votación:', error)
      throw error
    }
  }

  /**
   * Validar fechas de la votación
   */
  validateFechas(fechaInicio: string, fechaFin: string): string | null {
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)
    const ahora = new Date()

    if (inicio <= ahora) {
      return 'La fecha de inicio debe ser posterior a la fecha actual'
    }

    if (fin <= inicio) {
      return 'La fecha de fin debe ser posterior a la fecha de inicio'
    }

    const diferenciaDias = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24)
    if (diferenciaDias > 365) {
      return 'La votación no puede durar más de un año'
    }

    return null
  }

  /**
   * Validar opciones de votación
   */
  validateOpciones(opciones: VotacionOpcion[]): string | null {
    if (opciones.length < 2) {
      return 'Debe haber al menos 2 opciones de votación'
    }

    if (opciones.length > 10) {
      return 'No pueden haber más de 10 opciones de votación'
    }

    for (const opcion of opciones) {
      if (!opcion.titulo || opcion.titulo.trim().length === 0) {
        return 'Todas las opciones deben tener un título'
      }
      
      if (opcion.titulo.length > 100) {
        return 'Los títulos de las opciones no pueden exceder 100 caracteres'
      }
    }

    // Verificar títulos únicos
    const titulos = opciones.map(o => o.titulo.trim().toLowerCase())
    const titulosUnicos = new Set(titulos)
    if (titulos.length !== titulosUnicos.size) {
      return 'Los títulos de las opciones deben ser únicos'
    }

    return null
  }

  /**
   * Formatear fecha para input datetime-local
   */
  formatDateForInput(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  /**
   * Obtener fecha mínima para inicio (próxima hora)
   */
  getMinStartDate(): string {
    const ahora = new Date()
    ahora.setHours(ahora.getHours() + 1)
    return this.formatDateForInput(ahora)
  }

  /**
   * Obtener fecha mínima para fin (después de inicio)
   */
  getMinEndDate(fechaInicio: string): string {
    const inicio = new Date(fechaInicio)
    inicio.setHours(inicio.getHours() + 1)
    return this.formatDateForInput(inicio)
  }
}

const votacionService = new VotacionService()
export default votacionService
