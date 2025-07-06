// Configuración de la API
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'

export interface UserStats {
  estadisticasBasicas: {
    votacionesCreadas: number
    votosRealizados: number
    votacionesActivasCreadas: number
    fechaRegistro: string
  }
  ultimasVotaciones: Array<{
    id: number
    titulo: string
    estado: string
    categoria: string
    fechaCreacion: string
    creador: string
    totalVotos: number
    fechaInicio: string
    fechaFin: string
    descripcion: string
  }>
  ultimosVotos: Array<{
    id: number
    fechaVoto: string
    votacionTitulo: string
    votacionId: number
    opcionSeleccionada: string
    blockchainVerified: boolean
  }>
  votacionesPorCategoria: Record<string, number>
  votacionMasExitosa: {
    id: number
    titulo: string
    estado: string
    categoria: string
    fechaCreacion: string
    creador: string
    totalVotos: number
    fechaInicio: string
    fechaFin: string
    descripcion: string
  }
  participacionEnMisVotaciones: {
    promedioParticipacion: number
    totalVotacionesCreadas: number
    totalVotosRecibidos: number
  }
  actividadReciente: {
    votacionesEsteAño: number
    votosEsteAño: number
    ultimaActividad: {
      ultimaVotacionCreada?: {
        titulo: string
        fecha: string
      }
      ultimoVotoRealizado?: {
        votacionTitulo: string
        fecha: string
      }
    }
  }
  generadoEn: string
}

export interface PublicStats {
  totalVotaciones: number
  votacionesActivas: number
  totalVotos: number
  totalUsuarios: number
  topVotaciones: Array<{
    id: number
    titulo: string
    estado: string
    categoria: string
    fechaCreacion: string
    creador: string
    totalVotos: number
  }>
  generadoEn: string
  _source?: 'backend' | 'fallback'
}

class StatisticsService {
  
  /**
   * Obtiene datos de prueba cuando el backend no está disponible
   */
  private getFallbackPublicStats(): PublicStats {
    return {
      totalVotaciones: 25,
      votacionesActivas: 8,
      totalVotos: 142,
      totalUsuarios: 67,
      topVotaciones: [
        {
          id: 1,
          titulo: "Elección de Representante Estudiantil",
          estado: "ABIERTA",
          categoria: "POLITICA",
          fechaCreacion: "2024-01-15T10:30:00",
          creador: "Juan Pérez González",
          totalVotos: 45
        },
        {
          id: 2,
          titulo: "Preferencia de Horarios de Clases",
          estado: "ABIERTA",
          categoria: "ACADEMICA",
          fechaCreacion: "2024-01-14T09:15:00",
          creador: "María López Castro",
          totalVotos: 32
        },
        {
          id: 3,
          titulo: "Mejoras en el Campus",
          estado: "CERRADA",
          categoria: "GENERAL",
          fechaCreacion: "2024-01-10T14:20:00",
          creador: "Carlos Rodríguez",
          totalVotos: 28
        }
      ],
      generadoEn: new Date().toISOString()
    }
  }
  
  /**
   * Obtiene las estadísticas del usuario actual
   */
  async getUserStats(token: string): Promise<UserStats> {
    try {
      const response = await fetch(`${BASE_URL}/dashboard/mis-stats`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`
        
        // Intentar obtener el mensaje de error del JSON, si está disponible
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          // Si no se puede parsear JSON, usar el mensaje por defecto
          if (response.status === 401) {
            errorMessage = 'Tu sesión ha expirado. Inicia sesión nuevamente.'
          } else if (response.status === 403) {
            errorMessage = 'No tienes permisos para ver estas estadísticas.'
          } else if (response.status === 404) {
            errorMessage = 'El endpoint de estadísticas no está disponible.'
          } else if (response.status >= 500) {
            errorMessage = 'Error interno del servidor. Intenta más tarde.'
          }
        }
        
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error('Error obteniendo estadísticas del usuario:', error)
      throw error
    }
  }

  /**
   * Obtiene las estadísticas públicas del sistema (sin autenticación)
   * Siempre retorna datos, usando fallback si el backend no está disponible
   */
  async getPublicStats(): Promise<PublicStats> {
    try {
      const url = `${BASE_URL}/api/dashboard/public-stats`
      console.log('🔍 Obteniendo estadísticas públicas desde:', url)
      console.log('🌐 BASE_URL configurada:', BASE_URL)
      
      // Añadir timeout para evitar esperas indefinidas
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 segundos timeout
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      console.log('📡 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      })

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`
        
        // Intentar obtener el mensaje de error del JSON, si está disponible
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch {
          // Si no se puede parsear JSON, usar el mensaje por defecto
          if (response.status === 403) {
            errorMessage = 'Acceso denegado. Verifica la configuración CORS del servidor.'
          } else if (response.status === 404) {
            errorMessage = 'El endpoint de estadísticas públicas no está disponible.'
          } else if (response.status >= 500) {
            errorMessage = 'Error interno del servidor. Intenta más tarde.'
          }
        }
        
        console.log('⚠️ Error del servidor, usando datos de fallback para mejor UX')
        return this.getFallbackPublicStats()
      }

      const data = await response.json()
      console.log('✅ Estadísticas públicas obtenidas del backend:', data)
      
      // Validar que la respuesta tenga la estructura esperada
      if (typeof data.totalVotaciones !== 'number' || 
          typeof data.totalVotos !== 'number' || 
          typeof data.totalUsuarios !== 'number' ||
          typeof data.votacionesActivas !== 'number') {
        console.warn('⚠️ Estructura de datos incorrecta, usando fallback')
        return this.getFallbackPublicStats()
      }
      
      // Asegurar que topVotaciones sea un array
      if (!Array.isArray(data.topVotaciones)) {
        data.topVotaciones = []
      }
      
      // Añadir marca de que los datos vienen del backend
      data._source = 'backend'
      
      return data
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas públicas:', error)
      
      // Manejar todos los tipos de errores y siempre usar fallback
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.log('⚠️ Error de conectividad: El backend no está disponible o hay problemas de CORS')
        console.log('🔧 Verifica que el backend esté corriendo en:', BASE_URL)
      } else if (error instanceof Error && error.name === 'AbortError') {
        console.log('⚠️ Timeout: El servidor tardó demasiado en responder')
      } else {
        console.log('⚠️ Error desconocido:', error)
      }
      
      console.log('💡 Usando datos de demostración para mejor experiencia de usuario')
      const fallbackData = this.getFallbackPublicStats()
      fallbackData._source = 'fallback'
      return fallbackData
    }
  }

  /**
   * Formatea una fecha para mostrar
   */
  formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Fecha no disponible'
    }
  }

  /**
   * Formatea solo la fecha sin hora
   */
  formatDateOnly(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Fecha no disponible'
    }
  }

  /**
   * Obtiene el color del estado de una votación
   */
  getEstadoColor(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'ABIERTA':
        return 'bg-green-100 text-green-800'
      case 'CERRADA':
        return 'bg-red-100 text-red-800'
      case 'CREADA':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  /**
   * Obtiene el color de la categoría
   */
  getCategoriaColor(categoria: string): string {
    switch (categoria?.toUpperCase()) {
      case 'POLITICA':
        return 'bg-blue-100 text-blue-800'
      case 'ACADEMICA':
        return 'bg-purple-100 text-purple-800'
      case 'GENERAL':
        return 'bg-gray-100 text-gray-800'
      case 'SOCIAL':
        return 'bg-pink-100 text-pink-800'
      case 'DEPORTIVA':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  /**
   * Traduce el nombre de la categoría
   */
  translateCategoria(categoria: string): string {
    switch (categoria?.toUpperCase()) {
      case 'POLITICA':
        return 'Política'
      case 'ACADEMICA':
        return 'Académica'
      case 'GENERAL':
        return 'General'
      case 'SOCIAL':
        return 'Social'
      case 'DEPORTIVA':
        return 'Deportiva'
      default:
        return categoria
    }
  }

  /**
   * Traduce el estado de la votación
   */
  translateEstado(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'ABIERTA':
        return 'Abierta'
      case 'CERRADA':
        return 'Cerrada'
      case 'CREADA':
        return 'Creada'
      default:
        return estado
    }
  }
}

const statisticsService = new StatisticsService()
export default statisticsService
