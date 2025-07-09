'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import useUser from '@/hooks/useUser';
import voteHistoryService, { VoteHistoryResponse, HistorialFilters } from '@/lib/voteHistoryService';
import { 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Info,
  Loader2,
  Shield,
  AlertTriangle,
  Eye,
  RefreshCw,
  Copy,
  ArrowLeft
} from 'lucide-react';

export default function HistorialPage() {
  const { user, loading: userLoading } = useUser();
  
  // Estado para datos del backend
  const [voteHistory, setVoteHistory] = useState<VoteHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Estado para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroBlockchain, setFiltroBlockchain] = useState('todos');
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Cargar historial de votos
  useEffect(() => {
    if (!userLoading && user) {
      loadVoteHistory(true); // Siempre resetear cuando cambien los filtros
    }
  }, [user, userLoading, filtroEstado, filtroBlockchain]);

  // Buscar cuando el usuario termine de escribir
  useEffect(() => {
    if (!userLoading && user) {
      const timeoutId = setTimeout(() => {
        setPagination(prev => ({ ...prev, page: 0 }));
        loadVoteHistory(true);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, user, userLoading]);

  const loadVoteHistory = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setVoteHistory([]);
        setPagination(prev => ({ ...prev, page: 0 })); // Resetear página
      } else {
        setLoadingMore(true);
      }
      setError('');

      const currentPage = reset ? 0 : pagination.page;
      const filters: HistorialFilters = {
        page: currentPage,
        size: pagination.size,
        search: searchTerm || undefined,
        status: filtroEstado !== 'todos' ? filtroEstado.toUpperCase() : undefined,
        blockchainStatus: filtroBlockchain !== 'todos' ? filtroBlockchain.toUpperCase() : undefined
      };

      console.log('📚 Cargando historial de votos con filtros:', filters, reset ? '(RESET)' : '(APPEND)');
      const response = await voteHistoryService.getUserVoteHistory(filters);

      if (reset) {
        setVoteHistory(response.content);
        console.log('✅ Historial reseteado con:', response.content.length, 'elementos');
      } else {
        setVoteHistory(prev => {
          // Evitar duplicados verificando IDs existentes
          const existingIds = new Set(prev.map(v => v.id));
          const newItems = response.content.filter(item => !existingIds.has(item.id));
          console.log('✅ Agregando', newItems.length, 'nuevos elementos (filtrados de', response.content.length, ')');
          return [...prev, ...newItems];
        });
      }

      setPagination({
        page: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      });

      console.log('✅ Historial de votos cargado:', {
        total: response.totalElements,
        pagina: response.number + 1,
        totalPaginas: response.totalPages,
        enPantalla: reset ? response.content.length : voteHistory.length + response.content.length
      });

    } catch (err) {
      console.error('❌ Error cargando historial de votos:', err);
      setError(err instanceof Error ? err.message : 'Error cargando historial');
      if (reset) {
        setVoteHistory([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreResults = () => {
    if (pagination.page + 1 < pagination.totalPages && !loadingMore) {
      const nextPage = pagination.page + 1;
      setPagination(prev => ({ ...prev, page: nextPage }));
      
      // Cargar la siguiente página directamente
      loadMoreData(nextPage);
    }
  };

  const loadMoreData = async (page: number) => {
    try {
      setLoadingMore(true);
      setError('');

      const filters: HistorialFilters = {
        page,
        size: pagination.size,
        search: searchTerm || undefined,
        status: filtroEstado !== 'todos' ? filtroEstado.toUpperCase() : undefined,
        blockchainStatus: filtroBlockchain !== 'todos' ? filtroBlockchain.toUpperCase() : undefined
      };

      console.log('📚 Cargando más resultados, página:', page + 1);
      const response = await voteHistoryService.getUserVoteHistory(filters);

      // Agregar solo los nuevos resultados
      setVoteHistory(prev => [...prev, ...response.content]);
      
      setPagination({
        page: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      });

      console.log('✅ Más resultados cargados:', {
        nuevos: response.content.length,
        total: response.totalElements,
        pagina: response.number + 1,
        totalPaginas: response.totalPages
      });

    } catch (err) {
      console.error('❌ Error cargando más resultados:', err);
      setError(err instanceof Error ? err.message : 'Error cargando más resultados');
    } finally {
      setLoadingMore(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(`${type}-${text}`);
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (err) {
      console.error('Error copiando al portapapeles:', err);
    }
  };

  const getEstadoBadge = (vote: VoteHistoryResponse) => {
    if (voteHistoryService.isVoteFullyVerified(vote)) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verificado
        </span>
      );
    }

    if (vote.status === 'PENDING' || vote.blockchainStatus === 'PENDING') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Pendiente
        </span>
      );
    }

    if (vote.status === 'REJECTED' || vote.blockchainStatus === 'FAILED') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Error
        </span>
      );
    }

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <Clock className="w-3 h-3 mr-1" />
        {voteHistoryService.translateVoteStatus(vote.status)}
      </span>
    );
  };

  // Estados de carga
  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600">Verificando autenticación...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-yellow-900 mb-2">Autenticación requerida</h2>
            <p className="text-yellow-700 mb-4">Debes iniciar sesión para ver tu historial de votaciones.</p>
            <div className="flex gap-2 justify-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Historial completo de participación
        </h1>
        <p className="text-gray-600">
          Revisa todas tus participaciones en votaciones y verifica su integridad
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 !text-black">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">Filtrar por:</span>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos los estados</option>
              <option value="confirmed">Confirmados</option>
              <option value="pending">Pendientes</option>
              <option value="rejected">Rechazados</option>
            </select>
            
            <select
              value={filtroBlockchain}
              onChange={(e) => setFiltroBlockchain(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos blockchain</option>
              <option value="verified">Verificados</option>
              <option value="pending">Pendientes</option>
              <option value="failed">Fallidos</option>
            </select>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Info className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-blue-800">
              Has participado en <strong>{pagination.totalElements}</strong> votaciones hasta el momento.
            </span>
          </div>
        </div>
      </div>

      {/* Estado de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-800">{error}</span>
            <button
              onClick={() => loadVoteHistory(true)}
              className="ml-auto inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-800"
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Estado de carga inicial */}
      {loading && voteHistory.length === 0 && (
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Cargando historial de votaciones...</span>
          </div>
        </div>
      )}

      {/* Lista de votaciones */}
      {!loading && voteHistory.length > 0 && (
        <div className="space-y-4">
          {voteHistory.map((vote) => (
            <div key={`vote-${vote.id}-${vote.votacionId}-${vote.createdAt}`} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {vote.votacionTitulo}
                      </h3>
                      {getEstadoBadge(vote)}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-gray-500">Fecha de voto:</span>
                        <p className="font-medium text-gray-900">
                          {voteHistoryService.formatDate(vote.createdAt)}
                        </p>
                      </div>
                      
                      <div>
                        <span className="text-gray-500">Opción seleccionada:</span>
                        <p className="font-medium text-gray-900">{vote.opcionTitulo}</p>
                      </div>

                      <div>
                        <span className="text-gray-500">Estado blockchain:</span>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${voteHistoryService.getBlockchainStatusColor(vote.blockchainStatus)}`}>
                            <Shield className="w-3 h-3 mr-1" />
                            {voteHistoryService.translateBlockchainStatus(vote.blockchainStatus)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Hash de verificación blockchain */}
                    {vote.blockchainTransactionHash && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500 text-sm flex items-center">
                              <Shield className="w-4 h-4 mr-1" />
                              Hash de verificación blockchain:
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => copyToClipboard(vote.blockchainTransactionHash!, 'blockchain')}
                                className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                              >
                                <Copy className="w-3 h-3 mr-1" />
                                {copiedHash === `blockchain-${vote.blockchainTransactionHash}` ? 'Copiado!' : 'Copiar'}
                              </button>
                              {voteHistoryService.getBlockchainExplorerUrl(vote.blockchainTransactionHash) && (
                                <a
                                  href={voteHistoryService.getBlockchainExplorerUrl(vote.blockchainTransactionHash)!}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                                >
                                  <ExternalLink className="w-3 h-3 mr-1" />
                                  Explorador
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <code className="text-xs text-green-700 break-all font-mono">
                              {vote.blockchainTransactionHash}
                            </code>
                          </div>
                          {vote.blockchainVerifiedAt && (
                            <p className="text-xs text-green-600 mt-1">
                              Verificado en blockchain: {voteHistoryService.formatDate(vote.blockchainVerifiedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Botón para ver detalles de la votación */}
                  <div className="lg:ml-4 flex-shrink-0">
                    <Link
                      href={`/user/votaciones/${vote.votacionId}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Ver votación
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Estado vacío */}
      {!loading && voteHistory.length === 0 && !error && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay historial de votaciones
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filtroEstado !== 'todos' || filtroBlockchain !== 'todos'
              ? 'No se encontraron votaciones con los filtros aplicados.'
              : 'Aún no has participado en ninguna votación.'}
          </p>
          {(searchTerm || filtroEstado !== 'todos' || filtroBlockchain !== 'todos') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFiltroEstado('todos');
                setFiltroBlockchain('todos');
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Botón cargar más */}
      {!loading && voteHistory.length > 0 && pagination.page + 1 < pagination.totalPages && (
        <div className="text-center">
          <button
            onClick={loadMoreResults}
            disabled={loadingMore}
            className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cargando...
              </>
            ) : (
              'Cargar más resultados'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
