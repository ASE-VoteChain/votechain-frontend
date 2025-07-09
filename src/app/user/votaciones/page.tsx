'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { 
  Vote, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Filter,
  Search,
  ArrowRight,
  AlertCircle,
  BarChart3,
  MapPin,
  User,
  RefreshCw,
  Eye,
  Bell,
  History,
  Loader2,
  Play,
  Pause,
  Square,
  Settings
} from 'lucide-react';
import useUser from '@/hooks/useUser';
import userVotacionService from '@/lib/userVotacionService';
import voteHistoryService, { VoteHistoryResponse } from '@/lib/voteHistoryService';

interface VotacionUsuario {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'abierta' | 'proxima' | 'cerrada' | 'creada' | 'suspendida' | 'cancelada';
  participantes: number;
  totalElegibles: number;
  hasParticipated: boolean;
  categoria: string;
  tipo: string;
  ubicacion: string;
  organizador: string;
  prioridad: 'alta' | 'media' | 'baja';
  fechaVoto?: string;
  opcionSeleccionada?: string;
  hashTransaccion?: string;
  voteHash?: string;
  blockchainStatus?: 'PENDING' | 'VERIFIED' | 'FAILED';
  blockchainVerifiedAt?: string;
  voteStatus?: 'CONFIRMED' | 'PENDING' | 'REJECTED';
  notificacionesActivas?: boolean;
  opciones?: {
    id: number;
    titulo: string;
    descripcion: string;
    orden: number;
    totalVotos: number;
    porcentaje: number;
  }[];
  totalVotos: number;
  blockchainTransactionHash?: string;
}

export default function VotacionesUsuarioPage() {
  const { user, loading: userLoading } = useUser();
  
  // Estado para datos del backend
  const [votaciones, setVotaciones] = useState<VotacionUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0
  });

  // Estado para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroParticipacion, setFiltroParticipacion] = useState('todas');
  const [vistaActual, setVistaActual] = useState<'todas' | 'participadas' | 'pendientes' | 'mis-creadas'>('todas');

  // Estado para administración de votaciones
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    show: boolean;
    action: 'finalizar' | 'suspender' | 'reanudar' | 'cancelar';
    votacionId: string;
    votacionTitulo: string;
    motivo?: string;
  }>({
    show: false,
    action: 'finalizar',
    votacionId: '',
    votacionTitulo: ''
  });

  // Estado específico para prevenir pestañeo al cambiar de vista
  const [loadingVistaChange, setLoadingVistaChange] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Cargar votaciones del backend (usando useCallback para evitar recreación)
  const loadVotaciones = useCallback(async () => {
    try {
      // Solo mostrar loading en carga inicial o cuando hay cambios significativos
      if (isInitialLoad || loadingVistaChange) {
        setLoading(true);
      }
      setError('');

      // Verificar autenticación antes de proceder
      if (!user) {
        setError('Debes iniciar sesión para ver las votaciones.');
        setVotaciones([]);
        return;
      }

      const filters = {
        page: pagination.page,
        size: pagination.size,
        search: searchTerm || undefined,
        estado: filtroEstado !== 'todas' ? filtroEstado.toUpperCase() : undefined,
        categoria: filtroCategoria !== 'todas' ? filtroCategoria.toUpperCase() : undefined,
        participated: filtroParticipacion === 'participadas' ? true : 
                     filtroParticipacion === 'pendientes' ? false : undefined
      };

      console.log('🔍 Cargando votaciones con filtros:', filters);

      // Determinar qué endpoint usar (solo para usuarios autenticados)
      const showMyCreatedVotaciones = vistaActual === 'mis-creadas';
      const context = userVotacionService.determineContext(!!user, showMyCreatedVotaciones);
      
      const response = await userVotacionService.getVotaciones(context, filters);

      // Cargar historial de votos del usuario para enriquecer la información
      let userVotes: VoteHistoryResponse[] = [];
      try {
        console.log('📊 Cargando historial de votos del usuario...');
        const voteHistoryResponse = await voteHistoryService.getUserVoteHistory({
          page: 0,
          size: 100 // Cargar bastantes para tener información completa
        });
        userVotes = voteHistoryResponse.content;
        console.log('✅ Historial de votos cargado:', userVotes.length, 'votos');
      } catch (voteHistoryError) {
        console.warn('⚠️ No se pudo cargar el historial de votos:', voteHistoryError);
        // No es crítico, continuamos sin esta información
      }

      // Mapear datos del backend al formato esperado por el frontend
      const votacionesMapeadas: VotacionUsuario[] = response.content.map(votacion => {
        // Buscar información detallada del voto del usuario en el historial
        const userVoteDetail = userVotes.find(vote => vote.votacionId === votacion.id);

        return {
          ...votacion,
          id: votacion.id.toString(),
          estado: userVotacionService.mapEstado(votacion.estado) as 'abierta' | 'proxima' | 'cerrada' | 'creada' | 'suspendida' | 'cancelada',
          categoria: userVotacionService.mapCategoria(votacion.categoria),
          prioridad: userVotacionService.mapPrioridad(votacion.prioridad) as 'alta' | 'media' | 'baja',
          fechaInicio: userVotacionService.formatDate(votacion.fechaInicio),
          fechaFin: userVotacionService.formatDate(votacion.fechaFin),
          participantes: votacion.totalVotos || 0,
          totalElegibles: votacion.totalElegibles || 0,
          hasParticipated: votacion.hasParticipated || false,
          tipo: votacion.categoria || 'Votación',
          ubicacion: votacion.ubicacion || 'No especificada',
          organizador: votacion.organizador || 'Sistema',
          notificacionesActivas: false,
          opcionSeleccionada: votacion.userVote?.opcionTitulo || userVoteDetail?.opcionTitulo,
          hashTransaccion: votacion.userVote?.hashTransaccion || userVoteDetail?.blockchainTransactionHash,
          fechaVoto: votacion.userVote?.fechaVoto || userVoteDetail?.createdAt,
          voteHash: userVoteDetail?.voteHash,
          blockchainStatus: userVoteDetail?.blockchainStatus,
          blockchainVerifiedAt: userVoteDetail?.blockchainVerifiedAt,
          voteStatus: userVoteDetail?.status,
          opciones: votacion.opciones?.map(opcion => ({
            id: opcion.id,
            titulo: opcion.titulo,
            descripcion: opcion.descripcion,
            orden: opcion.orden,
            totalVotos: opcion.totalVotos || 0,
            porcentaje: opcion.porcentaje || 0
          })) || [],
          totalVotos: votacion.totalVotos || 0,
          blockchainTransactionHash: votacion.blockchainTransactionHash
        };
      });

      setVotaciones(votacionesMapeadas);
      setPagination({
        page: response.number,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages
      });

      console.log('✅ Votaciones cargadas exitosamente:', {
        total: response.totalElements,
        pagina: response.number + 1,
        totalPaginas: response.totalPages,
        contexto: context
      });

    } catch (err) {
      console.error('❌ Error detallado cargando votaciones:', err);
      
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido cargando votaciones';
      setError(errorMessage);
      
      setVotaciones([]);
    } finally {
      setLoading(false);
      setLoadingVistaChange(false);
      setIsInitialLoad(false);
    }
  }, [user, pagination.page, pagination.size, searchTerm, filtroEstado, filtroCategoria, filtroParticipacion, vistaActual, isInitialLoad, loadingVistaChange]);

  // Cargar votaciones al montar el componente y cuando cambien los filtros críticos
  useEffect(() => {
    console.log('📊 useEffect principal: Evaluando si cargar votaciones', {
      userLoading,
      user: !!user,
      userId: user?.id,
      page: pagination.page,
      filtros: { filtroEstado, filtroCategoria, filtroParticipacion, vistaActual }
    });

    // Solo cargar si el usuario no está en estado de carga
    if (!userLoading && user) {
      console.log('📊 useEffect principal: Usuario autenticado, cargando votaciones...');
      loadVotaciones();
    } else if (!userLoading && !user) {
      console.log('📊 useEffect principal: Usuario no autenticado, limpiando estado...');
      setVotaciones([]);
      setError('');
      setLoading(false);
    }
  }, [user, userLoading, loadVotaciones, filtroCategoria, filtroEstado, filtroParticipacion, pagination.page, vistaActual]);

  // Buscar cuando el usuario termine de escribir (con debounce)
  useEffect(() => {
    if (!userLoading && user) {
      if (searchTerm !== '') {
        const timeoutId = setTimeout(() => {
          console.log('🔍 useEffect búsqueda: Ejecutando búsqueda con término:', searchTerm);
          setPagination(prev => ({ ...prev, page: 0 }));
        }, 500);

        return () => clearTimeout(timeoutId);
      } else if (pagination.page !== 0) {
        // Solo resetear si la página no es ya 0
        setPagination(prev => ({ ...prev, page: 0 }));
      }
    }
  }, [searchTerm, user, userLoading, pagination.page]);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'abierta':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Abierta
          </span>
        );
      case 'proxima':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Próxima
          </span>
        );
      case 'cerrada':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cerrada
          </span>
        );
      case 'creada':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Creada
          </span>
        );
      case 'suspendida':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <XCircle className="w-3 h-3 mr-1" />
            Suspendida
          </span>
        );
      case 'cancelada':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelada
          </span>
        );
      default:
        return null;
    }
  };

  const getPrioridadBadge = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
            Alta prioridad
          </span>
        );
      case 'media':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            Media prioridad
          </span>
        );
      case 'baja':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
            Baja prioridad
          </span>
        );
      default:
        return null;
    }
  };



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Funciones para administración de votaciones
  const handleFinalizarVotacion = async (votacionId: string, titulo: string) => {
    setShowConfirmDialog({
      show: true,
      action: 'finalizar',
      votacionId,
      votacionTitulo: titulo
    });
  };

  const handleSuspenderVotacion = async (votacionId: string, titulo: string) => {
    setShowConfirmDialog({
      show: true,
      action: 'suspender',
      votacionId,
      votacionTitulo: titulo
    });
  };

  const handleReanudarVotacion = async (votacionId: string, titulo: string) => {
    setShowConfirmDialog({
      show: true,
      action: 'reanudar',
      votacionId,
      votacionTitulo: titulo
    });
  };

  const handleCancelarVotacion = async (votacionId: string, titulo: string) => {
    setShowConfirmDialog({
      show: true,
      action: 'cancelar',
      votacionId,
      votacionTitulo: titulo
    });
  };

  const executeVotacionAction = async () => {
    if (!showConfirmDialog.show) return;

    try {
      setLoadingAction(`${showConfirmDialog.action}-${showConfirmDialog.votacionId}`);
      
      const votacionId = parseInt(showConfirmDialog.votacionId);
      
      switch (showConfirmDialog.action) {
        case 'finalizar':
          const resultadoFinalizar = await userVotacionService.finalizarVotacion(votacionId);
          console.log('✅ Votación finalizada:', resultadoFinalizar);
          break;
          
        case 'suspender':
          const motivo = showConfirmDialog.motivo || 'Suspendida por el administrador';
          await userVotacionService.suspenderVotacion(votacionId, motivo);
          break;
          
        case 'reanudar':
          await userVotacionService.reanudarVotacion(votacionId);
          break;
          
        case 'cancelar':
          const motivoCancelacion = showConfirmDialog.motivo || 'Cancelada por el administrador';
          await userVotacionService.cancelarVotacion(votacionId, motivoCancelacion);
          break;
      }

      // Recargar votaciones para ver los cambios
      await loadVotaciones();
      
      // Cerrar el diálogo
      setShowConfirmDialog({
        show: false,
        action: 'finalizar',
        votacionId: '',
        votacionTitulo: ''
      });

    } catch (error) {
      console.error(`❌ Error ejecutando acción ${showConfirmDialog.action}:`, error);
      setError(`Error al ${showConfirmDialog.action} la votación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoadingAction(null);
    }
  };

  const canManageVotacion = (): boolean => {
    // Solo se puede administrar en la vista "mis-creadas"
    return vistaActual === 'mis-creadas';
  };

  // Funciones calculadas basadas en los datos reales (memoizadas para evitar recálculos)
  const categorias = useMemo(() => {
    return ['todas', ...Array.from(new Set(votaciones.map((v: VotacionUsuario) => v.categoria)))];
  }, [votaciones]);

  const votacionesAbiertas = useMemo(() => {
    return votaciones.filter((v: VotacionUsuario) => v.estado === 'abierta');
  }, [votaciones]);

  const votacionesProximas = useMemo(() => {
    return votaciones.filter((v: VotacionUsuario) => v.estado === 'proxima');
  }, [votaciones]);

  const votacionesParticipadas = useMemo(() => {
    return votaciones.filter((v: VotacionUsuario) => v.hasParticipated);
  }, [votaciones]);

  const votacionesCerradas = useMemo(() => {
    return votaciones.filter((v: VotacionUsuario) => v.estado === 'cerrada');
  }, [votaciones]);

  // Aplicar filtros a las votaciones actuales (memoizado)
  const votacionesFiltradas = useMemo(() => {
    return votaciones.filter((votacion: VotacionUsuario) => {
      // Filtro por vista actual
      if (vistaActual === 'pendientes' && (votacion.estado !== 'abierta' || votacion.hasParticipated)) {
        return false;
      }
      if (vistaActual === 'participadas' && !votacion.hasParticipated) {
        return false;
      }
      if (vistaActual === 'mis-creadas') {
        // Para mis votaciones creadas, no aplicamos filtros adicionales ya que el endpoint ya filtra
        // Pero podríamos agregar lógica adicional aquí si fuera necesario
      }

      // Filtro por búsqueda
      if (searchTerm && !votacion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !votacion.descripcion.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filtro por estado
      if (filtroEstado !== 'todas' && votacion.estado !== filtroEstado) {
        return false;
      }

      // Filtro por categoría
      if (filtroCategoria !== 'todas' && votacion.categoria !== filtroCategoria) {
        return false;
      }

      // Filtro por participación (solo aplicable cuando no estamos viendo mis votaciones creadas)
      if (vistaActual !== 'mis-creadas') {
        if (filtroParticipacion === 'participadas' && !votacion.hasParticipated) {
          return false;
        }
        if (filtroParticipacion === 'pendientes' && votacion.hasParticipated) {
          return false;
        }
      }

      return true;
    });
  }, [votaciones, vistaActual, searchTerm, filtroEstado, filtroCategoria, filtroParticipacion]);

  // Handlers memoizados para evitar re-renders innecesarios
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleEstadoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroEstado(e.target.value);
  }, []);

  const handleCategoriaChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroCategoria(e.target.value);
  }, []);

  const handleParticipacionChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroParticipacion(e.target.value);
  }, []);

  const handleVistaChange = useCallback((vista: 'todas' | 'participadas' | 'pendientes' | 'mis-creadas') => {
    setLoadingVistaChange(true);
    setVistaActual(vista);
    setPagination(prev => ({ ...prev, page: 0 }));
  }, []);

  const handleLimpiarFiltros = useCallback(() => {
    setSearchTerm('');
    setFiltroEstado('todas');
    setFiltroCategoria('todas');
    setFiltroParticipacion('todas');
    handleVistaChange('todas');
  }, [handleVistaChange]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Votaciones</h1>
          <p className="text-gray-600 mt-1">
            Gestiona tu participación en votaciones y consulta tu historial
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Bell className="w-4 h-4 mr-2 text-white" />
            Configurar notificaciones
          </button>
        </div>
      </div>

      {/* Loading state para usuario */}
      {userLoading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Verificando autenticación...</span>
          </div>
        </div>
      )}

      {/* Estado no autenticado */}
      {!userLoading && !user && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-yellow-900 mb-2">Autenticación requerida</h3>
              <p className="text-yellow-700 mb-4">
                Debes iniciar sesión para ver las votaciones disponibles.
              </p>
              <div className="flex gap-2">
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
      )}

      {/* Content - only show if user is authenticated */}
      {!userLoading && user && (
        <>
      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Cargando votaciones...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-lg font-medium text-red-900 mb-2">Error al cargar votaciones</h3>
              <p className="text-red-700 mb-4">{error}</p>
              
              <div className="flex gap-2">
                <button
                  onClick={() => loadVotaciones()}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar
                </button>
                
                <button
                  onClick={() => {
                    setError('');
                    // Reset filters
                    setSearchTerm('');
                    setFiltroEstado('todas');
                    setFiltroCategoria('todas');
                    setFiltroParticipacion('todas');
                    handleVistaChange('todas');
                    setPagination(prev => ({ ...prev, page: 0 }));
                  }}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Limpiar y reiniciar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content - only show if not loading and no error */}
      {!loading && !error && (
        <>
      {/* Dashboard de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Abiertas</p>
              <p className="text-3xl font-bold">{votacionesAbiertas.length}</p>
              <p className="text-green-100 text-xs mt-1">
                {votacionesAbiertas.filter(v => !v.hasParticipated).length} pendientes de votar
              </p>
            </div>
            <div className="p-3 bg-green-400 bg-opacity-30 rounded-lg">
              <Vote className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Próximas</p>
              <p className="text-3xl font-bold">{votacionesProximas.length}</p>
              <p className="text-blue-100 text-xs mt-1">
                programadas para pronto
              </p>
            </div>
            <div className="p-3 bg-blue-400 bg-opacity-30 rounded-lg">
              <Clock className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Participadas</p>
              <p className="text-3xl font-bold">{votacionesParticipadas.length}</p>
              <p className="text-purple-100 text-xs mt-1">
                {votacionesParticipadas.filter(v => v.blockchainStatus === 'VERIFIED').length} verificadas en blockchain
              </p>
            </div>
            <div className="p-3 bg-purple-400 bg-opacity-30 rounded-lg">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-100 text-sm font-medium">Cerradas</p>
              <p className="text-3xl font-bold">{votacionesCerradas.length}</p>
              <p className="text-gray-100 text-xs mt-1">
                {votacionesCerradas.reduce((total, v) => total + (v.totalVotos || 0), 0)} votos totales
              </p>
            </div>
            <div className="p-3 bg-gray-400 bg-opacity-30 rounded-lg">
              <BarChart3 className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => handleVistaChange('todas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              vistaActual === 'todas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Todas las votaciones
            <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
              {votaciones.length}
            </span>
          </button>
          <button
            onClick={() => handleVistaChange('pendientes')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              vistaActual === 'pendientes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pendientes
            <span className="ml-2 bg-red-100 text-red-800 py-0.5 px-2.5 rounded-full text-xs font-medium">
              {votacionesAbiertas.filter(v => !v.hasParticipated).length}
            </span>
          </button>
          <button
            onClick={() => handleVistaChange('participadas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              vistaActual === 'participadas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Historial
            <span className="ml-2 bg-green-100 text-green-800 py-0.5 px-2.5 rounded-full text-xs font-medium">
              {votacionesParticipadas.length}
            </span>
          </button>
          {user && (
            <button
              onClick={() => handleVistaChange('mis-creadas')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                vistaActual === 'mis-creadas'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Mis Votaciones
              <span className="ml-2 bg-purple-100 text-purple-800 py-0.5 px-2.5 rounded-full text-xs font-medium">
                {vistaActual === 'mis-creadas' ? votaciones.length : '?'}
              </span>
            </button>
          )}
        </nav>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 !text-black">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 " />
            <input
              type="text"
              placeholder="Buscar votaciones..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro por estado */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filtroEstado}
              onChange={handleEstadoChange}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todos los estados</option>
              <option value="abierta">Abiertas</option>
              <option value="proxima">Próximas</option>
              <option value="cerrada">Cerradas</option>
            </select>
          </div>

          {/* Filtro por categoría */}
          <select
            value={filtroCategoria}
            onChange={handleCategoriaChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>
                {categoria === 'todas' ? 'Todas las categorías' : categoria}
              </option>
            ))}
          </select>

          {/* Filtro por participación */}
          <select
            value={filtroParticipacion}
            onChange={handleParticipacionChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todas">Todas</option>
            <option value="participadas">Ya participé</option>
            <option value="pendientes">Por participar</option>
          </select>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {votacionesFiltradas.length} votación{votacionesFiltradas.length !== 1 ? 'es' : ''} encontrada{votacionesFiltradas.length !== 1 ? 's' : ''}
          </p>
          <button
            onClick={handleLimpiarFiltros}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Lista de votaciones */}
      <div className="grid grid-cols-1 gap-6">
        {votacionesFiltradas.map((votacion) => (
          <div key={votacion.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border border-gray-200">
            <div className="p-6">
              {/* Header de la tarjeta */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {votacion.categoria}
                    </span>
                    {getEstadoBadge(votacion.estado)}
                    {getPrioridadBadge(votacion.prioridad)}
                    {votacion.hasParticipated && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Participada
                      </span>
                    )}
                    {votacion.notificacionesActivas && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full flex items-center">
                        <Bell className="w-3 h-3 mr-1" />
                        Notificaciones
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {votacion.titulo}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {votacion.descripcion}
                  </p>
                </div>
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Inicio: {formatDate(votacion.fechaInicio)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Fin: {formatDate(votacion.fechaFin)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{votacion.ubicacion}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>Organiza: {votacion.organizador}</span>
                  </div>
                </div>

                {/* Información de participación del usuario */}
                {votacion.hasParticipated && (
                  <div className="bg-green-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-green-900 flex items-center">
                      <History className="w-4 h-4 mr-2" />
                      Tu participación
                    </h4>
                    <div className="text-sm text-green-800 space-y-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <p><strong>Fecha de voto:</strong></p>
                          <p className="text-green-700">
                            {votacion.fechaVoto ? voteHistoryService.formatDate(votacion.fechaVoto) : 'No disponible'}
                          </p>
                        </div>
                        <div>
                          <p><strong>Opción seleccionada:</strong></p>
                          <p className="text-green-700">{votacion.opcionSeleccionada || 'No disponible'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Estadísticas de votos por opción */}
                {votacion.opciones && votacion.opciones.length > 0 && votacion.totalVotos > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <h4 className="font-medium text-gray-900 flex items-center justify-between">
                      <span className="flex items-center">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Resultados actuales
                      </span>
                      <span className="text-sm text-gray-600">
                        {votacion.totalVotos} votos totales
                      </span>
                    </h4>
                    <div className="space-y-2">
                      {votacion.opciones
                        .sort((a, b) => b.totalVotos - a.totalVotos)
                        .map((opcion) => (
                          <div key={opcion.id} className="space-y-1">
                            <div className="flex justify-between items-center text-sm">
                              <span className="font-medium text-gray-700 truncate">
                                {opcion.titulo}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="text-gray-600">
                                  {opcion.totalVotos} votos
                                </span>
                                <span className="font-semibold text-gray-900 min-w-[3rem] text-right">
                                  {opcion.porcentaje.toFixed(1)}%
                                </span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  votacion.opcionSeleccionada === opcion.titulo
                                    ? 'bg-green-500'
                                    : 'bg-blue-500'
                                }`}
                                style={{ width: `${opcion.porcentaje}%` }}
                              ></div>
                            </div>
                            {votacion.opcionSeleccionada === opcion.titulo && (
                              <div className="flex items-center text-xs text-green-600">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Tu voto
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{votacion.totalVotos || 0} participantes</span>
                  <span className="mx-2">•</span>
                  <span>{votacion.tipo}</span>
                </div>

                <div className="flex gap-2">
                  {/* Acciones para usuarios regulares */}
                  {!canManageVotacion() && (
                    <>
                      {votacion.estado === 'abierta' && !votacion.hasParticipated && (
                        <Link 
                          href={`/user/votaciones/${votacion.id}`}
                          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors !text-white"
                        >
                          <Vote className="w-4 h-4 mr-2 text-white" />
                          Votar ahora
                        </Link>
                      )}

                      {votacion.estado === 'abierta' && votacion.hasParticipated && (
                        <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 text-sm font-medium rounded-lg">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Ya participaste
                        </div>
                      )}

                      {votacion.estado === 'proxima' && (
                        <div className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
                          <Clock className="w-4 h-4 mr-2" />
                          Próximamente
                        </div>
                      )}
                    </>
                  )}

                  {/* Acciones para administradores (mis votaciones) */}
                  {canManageVotacion() && (
                    <>
                      {votacion.estado === 'abierta' && (
                        <>
                          <button
                            onClick={() => handleFinalizarVotacion(votacion.id, votacion.titulo)}
                            disabled={loadingAction === `finalizar-${votacion.id}`}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingAction === `finalizar-${votacion.id}` ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Square className="w-4 h-4 mr-2" />
                            )}
                            Finalizar
                          </button>
                          
                          <button
                            onClick={() => handleSuspenderVotacion(votacion.id, votacion.titulo)}
                            disabled={loadingAction === `suspender-${votacion.id}`}
                            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white text-sm font-medium rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingAction === `suspender-${votacion.id}` ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <Pause className="w-4 h-4 mr-2" />
                            )}
                            Suspender
                          </button>
                        </>
                      )}

                      {votacion.estado === 'suspendida' && (
                        <>
                          <button
                            onClick={() => handleReanudarVotacion(votacion.id, votacion.titulo)}
                            disabled={loadingAction === `reanudar-${votacion.id}`}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed !text-white"
                          >
                            {loadingAction === `reanudar-${votacion.id}` ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin text-white" />
                            ) : (
                              <Play className="w-4 h-4 mr-2 text-white" />
                            )}
                            Reanudar
                          </button>
                          
                          <button
                            onClick={() => handleCancelarVotacion(votacion.id, votacion.titulo)}
                            disabled={loadingAction === `cancelar-${votacion.id}`}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingAction === `cancelar-${votacion.id}` ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-2" />
                            )}
                            Cancelar
                          </button>
                        </>
                      )}

                      {(votacion.estado === 'creada' || votacion.estado === 'proxima') && (
                        <>
                          <button
                            onClick={() => handleCancelarVotacion(votacion.id, votacion.titulo)}
                            disabled={loadingAction === `cancelar-${votacion.id}`}
                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingAction === `cancelar-${votacion.id}` ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4 mr-2" />
                            )}
                            Cancelar
                          </button>
                          
                          <Link 
                            href={`/user/votaciones/${votacion.id}/editar`}
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Editar
                          </Link>
                        </>
                      )}
                    </>
                  )}

                  {/* Acciones comunes para ambos */}
                  <Link 
                    href={`/user/votaciones/${votacion.id}`}
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver detalles
                  </Link>

                  {votacion.estado === 'cerrada' && (
                    <Link 
                      href={`/user/votaciones/${votacion.id}/resultados`}
                      className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Ver resultados
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay resultados */}
      {!loading && !error && votacionesFiltradas.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron votaciones
          </h3>
          <p className="text-gray-500 mb-4">
            {vistaActual === 'pendientes' && 'No tienes votaciones pendientes por participar.'}
            {vistaActual === 'participadas' && 'Aún no has participado en ninguna votación.'}
            {vistaActual === 'mis-creadas' && 'No has creado ninguna votación aún.'}
            {vistaActual === 'todas' && votaciones.length === 0 && 'No hay votaciones disponibles en este momento.'}
            {vistaActual === 'todas' && votaciones.length > 0 && 'Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.'}
          </p>
          {vistaActual !== 'todas' && vistaActual !== 'mis-creadas' && (
            <button
              onClick={() => handleVistaChange('todas')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors !text-white"
            >
              Ver todas las votaciones
              <ArrowRight className="w-4 h-4 ml-2 text-white" />
            </button>
          )}
          {vistaActual === 'mis-creadas' && (
            <Link
              href="/user/crear-votacion"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors !text-white"
            >
              Crear mi primera votación
              <ArrowRight className="w-4 h-4 ml-2 text-white" />
            </Link>
          )}
        </div>
      )}

      {/* Call to Action para votaciones abiertas */}
      {!loading && !error && vistaActual === 'todas' && votacionesAbiertas.filter((v: VotacionUsuario) => !v.hasParticipated).length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                ¡Tienes {votacionesAbiertas.filter((v: VotacionUsuario) => !v.hasParticipated).length} votación{votacionesAbiertas.filter((v: VotacionUsuario) => !v.hasParticipated).length !== 1 ? 'es' : ''} pendiente{votacionesAbiertas.filter((v: VotacionUsuario) => !v.hasParticipated).length !== 1 ? 's' : ''}!
              </h3>
              <p className="text-blue-100">
                Tu voz es importante. Participa en las votaciones abiertas y contribuye a las decisiones de tu comunidad.
              </p>
            </div>
            <button
              onClick={() => handleVistaChange('pendientes')}
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Vote className="w-5 h-5 mr-2" />
              Ver pendientes
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      )}

      {/* Paginación */}
      {!loading && !error && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 py-6">
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(0, prev.page - 1) }))}
            disabled={pagination.page === 0}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <span className="text-sm text-gray-600">
            Página {pagination.page + 1} de {pagination.totalPages} 
            ({pagination.totalElements} votaciones total)
          </span>
          
          <button
            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages - 1, prev.page + 1) }))}
            disabled={pagination.page >= pagination.totalPages - 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}
        </>
      )}
      </>
      )}

      {/* Diálogo de confirmación para acciones de administración */}
      {showConfirmDialog.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-full mr-4 ${
                  showConfirmDialog.action === 'finalizar' ? 'bg-green-100' :
                  showConfirmDialog.action === 'suspender' ? 'bg-yellow-100' :
                  showConfirmDialog.action === 'reanudar' ? 'bg-blue-100' :
                  'bg-red-100'
                }`}>
                  {showConfirmDialog.action === 'finalizar' && <Square className="w-6 h-6 text-green-600" />}
                  {showConfirmDialog.action === 'suspender' && <Pause className="w-6 h-6 text-yellow-600" />}
                  {showConfirmDialog.action === 'reanudar' && <Play className="w-6 h-6 text-blue-600" />}
                  {showConfirmDialog.action === 'cancelar' && <XCircle className="w-6 h-6 text-red-600" />}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {showConfirmDialog.action === 'finalizar' && 'Finalizar Votación'}
                    {showConfirmDialog.action === 'suspender' && 'Suspender Votación'}
                    {showConfirmDialog.action === 'reanudar' && 'Reanudar Votación'}
                    {showConfirmDialog.action === 'cancelar' && 'Cancelar Votación'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {showConfirmDialog.votacionTitulo}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  {showConfirmDialog.action === 'finalizar' && 
                    '¿Estás seguro de que deseas finalizar esta votación? Esta acción cerrará la votación y generará los resultados finales. No podrás deshacerlo.'}
                  {showConfirmDialog.action === 'suspender' && 
                    '¿Estás seguro de que deseas suspender esta votación? Los usuarios no podrán votar hasta que la reanudes.'}
                  {showConfirmDialog.action === 'reanudar' && 
                    '¿Estás seguro de que deseas reanudar esta votación? Los usuarios podrán volver a votar.'}
                  {showConfirmDialog.action === 'cancelar' && 
                    '¿Estás seguro de que deseas cancelar esta votación? Esta acción es permanente y no se podrá deshacer.'}
                </p>

                {(showConfirmDialog.action === 'suspender' || showConfirmDialog.action === 'cancelar') && (
                  <div>
                    <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-2">
                      Motivo {showConfirmDialog.action === 'suspender' ? '(opcional)' : '(requerido)'}:
                    </label>
                    <textarea
                      id="motivo"
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Motivo para ${showConfirmDialog.action} la votación...`}
                      value={showConfirmDialog.motivo || ''}
                      onChange={(e) => setShowConfirmDialog(prev => ({ ...prev, motivo: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirmDialog({
                    show: false,
                    action: 'finalizar',
                    votacionId: '',
                    votacionTitulo: ''
                  })}
                  disabled={!!loadingAction}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={executeVotacionAction}
                  disabled={!!loadingAction || (showConfirmDialog.action === 'cancelar' && !showConfirmDialog.motivo?.trim())}
                  className={`px-6 py-2 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    showConfirmDialog.action === 'finalizar' ? 'bg-green-600 hover:bg-green-700' :
                    showConfirmDialog.action === 'suspender' ? 'bg-yellow-600 hover:bg-yellow-700' :
                    showConfirmDialog.action === 'reanudar' ? 'bg-blue-600 hover:bg-blue-700' :
                    'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {loadingAction ? (
                    <div className="flex items-center">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Procesando...
                    </div>
                  ) : (
                    <>
                      {showConfirmDialog.action === 'finalizar' && 'Finalizar'}
                      {showConfirmDialog.action === 'suspender' && 'Suspender'}
                      {showConfirmDialog.action === 'reanudar' && 'Reanudar'}
                      {showConfirmDialog.action === 'cancelar' && 'Cancelar'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
