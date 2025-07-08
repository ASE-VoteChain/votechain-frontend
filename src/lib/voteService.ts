// Servicio para manejar votos individuales
import AuthService from './auth'

export interface VotacionDetalle {
  id: number
  titulo: string
  descripcion: string
  fechaInicio: string
  fechaFin: string
  estado: string
  participantes?: number
  totalElegibles?: number
  hasParticipated: boolean
  categoria: string
  ubicacion?: string
  organizador?: string
  requisitos?: string
  createdAt: string
  updatedAt: string
  opciones: VotacionOpcion[]
  userVote?: UserVote | null
}

export interface VotacionOpcion {
  id: number
  titulo: string
  descripcion?: string
  orden: number
  totalVotos?: number
}

export interface UserVote {
  id: number
  opcionId: number
  opcionTitulo: string
  fechaVoto: string
  hashTransaccion?: string
}

export interface CreateVoteRequest {
  votacionId: number
  opcionId: number
}

export interface VoteResponse {
  id: number
  votacionId: number
  opcionId: number
  fechaVoto: string
  hashTransaccion?: string
  message: string
}

class VoteService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  // Obtener detalle de una votación específica
  async getVotacionDetail(votacionId: number): Promise<VotacionDetalle> {
    const token = AuthService.getAccessToken()
    if (!token) {
      throw new Error('Token de autenticación requerido')
    }

    console.log('🗳️ VoteService: Obteniendo detalle de votación:', votacionId)

    const response = await fetch(`${this.baseUrl}/api/votaciones/user/votaciones/${votacionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ VoteService: Error obteniendo detalle de votación:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      
      if (response.status === 401) {
        throw new Error('No autorizado. Por favor inicia sesión nuevamente.')
      }
      if (response.status === 404) {
        throw new Error('Votación no encontrada')
      }
      throw new Error(`Error del servidor: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ VoteService: Detalle de votación obtenido:', {
      id: data.id,
      titulo: data.titulo,
      estado: data.estado,
      hasParticipated: data.hasParticipated,
      opciones: data.opciones?.length || 0
    })

    return data
  }

  // Emitir un voto
  async createVote(voteData: CreateVoteRequest): Promise<VoteResponse> {
    const token = AuthService.getAccessToken()
    if (!token) {
      throw new Error('Token de autenticación requerido')
    }

    console.log('🗳️ VoteService: Creando voto:', voteData)

    const response = await fetch(`${this.baseUrl}/api/votes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(voteData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ VoteService: Error creando voto:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      
      if (response.status === 401) {
        throw new Error('No autorizado. Por favor inicia sesión nuevamente.')
      }
      if (response.status === 400) {
        throw new Error('Datos de voto inválidos o votación no disponible')
      }
      if (response.status === 409) {
        throw new Error('Ya has votado en esta votación')
      }
      throw new Error(`Error del servidor: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ VoteService: Voto creado exitosamente:', {
      id: data.id,
      votacionId: data.votacionId,
      opcionId: data.opcionId,
      hashTransaccion: data.hashTransaccion
    })

    return data
  }

  // Mapear estado desde backend
  mapEstado(estado: string): string {
    const estadoMap: Record<string, string> = {
      'ABIERTA': 'abierta',
      'CREADA': 'creada',
      'PROXIMA': 'proxima',
      'CERRADA': 'cerrada',
      'SUSPENDIDA': 'suspendida',
      'CANCELADA': 'cancelada'
    }
    return estadoMap[estado] || estado.toLowerCase()
  }

  // Mapear categoría desde backend
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

  // Formatear fecha
  formatDate(dateString: string): string {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      console.error('Error formateando fecha:', error)
      return dateString
    }
  }

  // Formatear solo fecha (sin hora)
  formatDateOnly(dateString: string): string {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch (error) {
      console.error('Error formateando fecha:', error)
      return dateString
    }
  }

  // Verificar si una votación está disponible para votar
  isVotingAvailable(votacion: VotacionDetalle): boolean {
    if (votacion.hasParticipated) return false
    if (votacion.estado !== 'ABIERTA') return false
    
    const now = new Date()
    const fechaInicio = new Date(votacion.fechaInicio)
    const fechaFin = new Date(votacion.fechaFin)
    
    return now >= fechaInicio && now <= fechaFin
  }

  // Obtener mensaje de estado de la votación
  getEstadoMessage(votacion: VotacionDetalle): string {
    if (votacion.hasParticipated) {
      return 'Ya has participado en esta votación'
    }
    
    if (votacion.estado === 'CERRADA') {
      return 'Esta votación ha finalizado'
    }
    
    if (votacion.estado === 'PROXIMA') {
      return `La votación comenzará el ${this.formatDate(votacion.fechaInicio)}`
    }
    
    if (votacion.estado === 'CREADA') {
      return 'Esta votación aún no ha sido abierta'
    }
    
    if (votacion.estado === 'SUSPENDIDA') {
      return 'Esta votación ha sido suspendida temporalmente'
    }
    
    if (votacion.estado === 'CANCELADA') {
      return 'Esta votación ha sido cancelada'
    }
    
    const now = new Date()
    const fechaInicio = new Date(votacion.fechaInicio)
    const fechaFin = new Date(votacion.fechaFin)
    
    if (now < fechaInicio) {
      return `La votación comenzará el ${this.formatDate(votacion.fechaInicio)}`
    }
    
    if (now > fechaFin) {
      return 'El período de votación ha finalizado'
    }
    
    return `Votación abierta hasta el ${this.formatDate(votacion.fechaFin)}`
  }
}

const voteService = new VoteService()
export default voteService
