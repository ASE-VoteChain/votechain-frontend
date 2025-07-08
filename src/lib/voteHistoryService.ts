// Servicio para manejar el historial de votos del usuario
import AuthService from './auth'

export interface VoteHistoryResponse {
  id: number
  userId: number
  userEmail: string
  userName: string
  votacionId: number
  votacionTitulo: string
  opcionId: number
  opcionTitulo: string
  createdAt: string
  voteHash: string
  blockchainTransactionHash?: string
  blockchainStatus: 'PENDING' | 'VERIFIED' | 'FAILED'
  blockchainVerifiedAt?: string
  status: 'CONFIRMED' | 'PENDING' | 'REJECTED'
}

export interface VoteHistoryPageResponse {
  content: VoteHistoryResponse[]
  pageable: {
    pageNumber: number
    pageSize: number
    sort: {
      empty: boolean
      sorted: boolean
      unsorted: boolean
    }
    offset: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  numberOfElements: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  empty: boolean
}

export interface HistorialFilters {
  page?: number
  size?: number
  search?: string
  status?: string
  blockchainStatus?: string
}

class VoteHistoryService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

  // Obtener historial de votos del usuario
  async getUserVoteHistory(filters: HistorialFilters = {}): Promise<VoteHistoryPageResponse> {
    const token = AuthService.getAccessToken()
    if (!token) {
      throw new Error('Token de autenticación requerido')
    }

    console.log('📚 VoteHistoryService: Obteniendo historial de votos:', filters)

    const queryParams = new URLSearchParams()
    queryParams.append('page', (filters.page || 0).toString())
    queryParams.append('size', (filters.size || 10).toString())

    if (filters.search) {
      queryParams.append('search', filters.search)
    }
    if (filters.status) {
      queryParams.append('status', filters.status)
    }
    if (filters.blockchainStatus) {
      queryParams.append('blockchainStatus', filters.blockchainStatus)
    }

    const response = await fetch(`${this.baseUrl}/api/votes/user/history?${queryParams}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ VoteHistoryService: Error obteniendo historial:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      })
      
      if (response.status === 401) {
        throw new Error('No autorizado. Por favor inicia sesión nuevamente.')
      }
      throw new Error(`Error del servidor: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ VoteHistoryService: Historial obtenido:', {
      totalElements: data.totalElements,
      page: data.number + 1,
      totalPages: data.totalPages,
      votes: data.content?.length || 0
    })

    return data
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

  // Obtener color del estado blockchain
  getBlockchainStatusColor(status: string): string {
    switch (status) {
      case 'VERIFIED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Obtener color del estado del voto
  getVoteStatusColor(status: string): string {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Traducir estado blockchain
  translateBlockchainStatus(status: string): string {
    switch (status) {
      case 'VERIFIED':
        return 'Verificado'
      case 'PENDING':
        return 'Pendiente'
      case 'FAILED':
        return 'Falló'
      default:
        return status
    }
  }

  // Traducir estado del voto
  translateVoteStatus(status: string): string {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmado'
      case 'PENDING':
        return 'Pendiente'
      case 'REJECTED':
        return 'Rechazado'
      default:
        return status
    }
  }

  // Truncar hash para mostrar
  truncateHash(hash: string, length: number = 8): string {
    if (!hash || hash.length <= length * 2) return hash
    return `${hash.substring(0, length)}...${hash.substring(hash.length - length)}`
  }

  // Verificar si un voto está completamente verificado
  isVoteFullyVerified(vote: VoteHistoryResponse): boolean {
    return vote.status === 'CONFIRMED' && 
           vote.blockchainStatus === 'VERIFIED' && 
           !!vote.blockchainTransactionHash
  }

  // Obtener URL del explorador de blockchain (si existe)
  getBlockchainExplorerUrl(txHash: string): string | null {
    if (!txHash) return null
    // Esto depende de la blockchain que estés usando
    // Ejemplo para Ethereum mainnet:
    // return `https://etherscan.io/tx/${txHash}`
    
    // Para desarrollo/testnet podrías usar:
    return `https://sepolia.etherscan.io/tx/${txHash}`
    
    // Por ahora retornamos null hasta que sepamos qué blockchain usar
    //return null
  }
}

const voteHistoryService = new VoteHistoryService()
export default voteHistoryService
