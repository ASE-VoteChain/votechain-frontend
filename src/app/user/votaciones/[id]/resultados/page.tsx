'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import useUser from '@/hooks/useUser';
import userVotacionService, { EstadisticasVotacionResponse } from '@/lib/userVotacionService';
import { 
  ArrowLeft, 
  BarChart3, 
  Users, 
  Calendar,
  Clock,
  Trophy,
  TrendingUp,
  Activity,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Hash,
  ExternalLink,
  Copy,
  Loader2,
  Info,
  Target,
  Zap,
  MapPin,
  User
} from 'lucide-react';

export default function ResultadosVotacionPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: userLoading } = useUser();
  
  const [estadisticas, setEstadisticas] = useState<EstadisticasVotacionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedHash, setCopiedHash] = useState('');

  const votacionId = params?.id ? parseInt(params.id as string) : null;

  // Cargar estadísticas de la votación
  useEffect(() => {
    if (!userLoading && user && votacionId) {
      loadEstadisticas();
    } else if (!userLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, userLoading, votacionId]);

  const loadEstadisticas = async () => {
    if (!votacionId) return;
    
    try {
      setLoading(true);
      setError('');
      
      console.log('📊 Cargando estadísticas de votación:', votacionId);
      const estadisticasData = await userVotacionService.getEstadisticasVotacion(votacionId);
      setEstadisticas(estadisticasData);
      
      console.log('✅ Estadísticas cargadas:', {
        id: estadisticasData.votacion.id,
        titulo: estadisticasData.votacion.titulo,
        totalVotos: estadisticasData.estadisticasBasicas.totalVotos,
        ganador: estadisticasData.ganador.opcion
      });
      
    } catch (err) {
      console.error('❌ Error cargando estadísticas:', err);
      setError(err instanceof Error ? err.message : 'Error cargando estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedHash(type);
      setTimeout(() => setCopiedHash(''), 2000);
    } catch (err) {
      console.error('Error copiando al portapapeles:', err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getBlockchainStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verificado
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pendiente
          </span>
        );
      case 'NOT_DEPLOYED':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="w-3 h-3 mr-1" />
            No desplegado
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Fallido
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gray-200 rounded mr-3"></div>
                <div className="h-6 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
              
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-6">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                Volver
              </button>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-red-800 mb-2">Error al cargar estadísticas</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadEstadisticas}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!estadisticas) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Estadísticas no disponibles</h2>
            <p className="text-gray-600 mb-4">No se pudieron cargar las estadísticas de esta votación.</p>
            <Link
              href="/user/votaciones"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ver todas las votaciones
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Volver
          </button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Resultados y Estadísticas</h1>
            <p className="text-gray-600 mt-1">{estadisticas.votacion.titulo}</p>
          </div>
          <div className="text-sm text-gray-500">
            Generado el {formatDate(estadisticas.generadoEn)}
          </div>
        </div>

        {/* Información básica de la votación */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Información general</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Inicio: {formatDate(estadisticas.votacion.fechaInicio)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Fin: {formatDate(estadisticas.votacion.fechaFin)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>Organizador: {estadisticas.votacion.organizador}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Estado actual</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Estado: </span>
                    <span className={`font-medium ${
                      estadisticas.votacion.estado === 'CERRADA' ? 'text-gray-800' :
                      estadisticas.votacion.estado === 'ABIERTA' ? 'text-green-600' :
                      'text-blue-600'
                    }`}>
                      {estadisticas.votacion.estado}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Categoría: </span>
                    <span className="font-medium text-gray-800">{estadisticas.votacion.categoria}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Activa: </span>
                    <span className={`font-medium ${estadisticas.estadisticasBasicas.votacionActiva ? 'text-green-600' : 'text-gray-600'}`}>
                      {estadisticas.estadisticasBasicas.votacionActiva ? 'Sí' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Duración</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>Total: {estadisticas.estadisticasAdicionales.duracionTotal.dias} días, {estadisticas.estadisticasAdicionales.duracionTotal.horas} horas</span>
                  </div>
                  {estadisticas.estadisticasAdicionales.tiempoRestante.activa && (
                    <div className="flex items-center text-orange-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Restante: {estadisticas.estadisticasAdicionales.tiempoRestante.dias}d {estadisticas.estadisticasAdicionales.tiempoRestante.horas}h {estadisticas.estadisticasAdicionales.tiempoRestante.minutos}m</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Votos</p>
                <p className="text-3xl font-bold">{estadisticas.estadisticasBasicas.totalVotos}</p>
              </div>
              <div className="p-3 bg-blue-400 bg-opacity-30 rounded-lg">
                <BarChart3 className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Participación</p>
                <p className="text-3xl font-bold">{estadisticas.estadisticasBasicas.participacionPorcentaje.toFixed(1)}%</p>
                <p className="text-green-100 text-xs">
                  {estadisticas.estadisticasBasicas.totalVotos} de {estadisticas.estadisticasBasicas.totalUsuariosElegibles}
                </p>
              </div>
              <div className="p-3 bg-green-400 bg-opacity-30 rounded-lg">
                <Users className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Promedio/Hora</p>
                <p className="text-3xl font-bold">{estadisticas.estadisticasAdicionales.promedioVotosPorHora.toFixed(1)}</p>
                <p className="text-purple-100 text-xs">votos por hora</p>
              </div>
              <div className="p-3 bg-purple-400 bg-opacity-30 rounded-lg">
                <TrendingUp className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Blockchain</p>
                <p className="text-3xl font-bold">{estadisticas.blockchain.verificationPercentage.toFixed(0)}%</p>
                <p className="text-yellow-100 text-xs">verificación</p>
              </div>
              <div className="p-3 bg-yellow-400 bg-opacity-30 rounded-lg">
                <Shield className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Ganador y Distribución de Votos */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Trophy className="w-6 h-6 text-yellow-500 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">Resultado Ganador</h3>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-2xl font-bold text-yellow-800">{estadisticas.ganador.opcion}</h4>
                    <p className="text-yellow-600">Opción ganadora</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-yellow-800">{estadisticas.ganador.porcentaje.toFixed(1)}%</p>
                    <p className="text-yellow-600">{estadisticas.ganador.votos} votos</p>
                  </div>
                </div>
              </div>

              <h4 className="font-medium text-gray-900 mb-3">Distribución de votos</h4>
              <div className="space-y-3">
                {Object.entries(estadisticas.distribucionOpciones)
                  .sort(([,a], [,b]) => b.votos - a.votos)
                  .map(([opcion, datos], index) => (
                  <div key={opcion} className="relative">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700 flex items-center">
                        {index === 0 && <Trophy className="w-4 h-4 text-yellow-500 mr-1" />}
                        {opcion}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{datos.votos} votos</span>
                        <span className="font-semibold text-gray-900">{datos.porcentaje.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          index === 0 ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${datos.porcentaje}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Información de Blockchain */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-blue-500 mr-2" />
                <h3 className="text-xl font-semibold text-gray-900">Estado Blockchain</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Estado:</span>
                  {getBlockchainStatusBadge(estadisticas.blockchain.blockchainStatus)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-green-600 font-medium">Verificados</p>
                    <p className="text-2xl font-bold text-green-800">{estadisticas.blockchain.verifiedVotes}</p>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-3">
                    <p className="text-sm text-yellow-600 font-medium">Pendientes</p>
                    <p className="text-2xl font-bold text-yellow-800">{estadisticas.blockchain.pendingVotes}</p>
                  </div>
                </div>

                {estadisticas.blockchain.rejectedVotes > 0 && (
                  <div className="bg-red-50 rounded-lg p-3">
                    <p className="text-sm text-red-600 font-medium">Rechazados</p>
                    <p className="text-2xl font-bold text-red-800">{estadisticas.blockchain.rejectedVotes}</p>
                  </div>
                )}

                <div className="pt-2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-600">Verificación</span>
                    <span className="text-sm font-medium text-gray-900">
                      {estadisticas.blockchain.verificationPercentage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${estadisticas.blockchain.verificationPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {estadisticas.blockchain.transactionHash && (
                  <div className="pt-2">
                    <p className="text-sm text-gray-600 mb-1">Hash de transacción:</p>
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono flex-1 truncate">
                        {estadisticas.blockchain.transactionHash}
                      </code>
                      <button
                        onClick={() => copyToClipboard(estadisticas.blockchain.transactionHash!, 'blockchain')}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        {copiedHash === 'blockchain' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tendencia Temporal */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Activity className="w-6 h-6 text-green-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Tendencia Temporal</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Votos por período</h4>
                <div className="space-y-2">
                  {Object.entries(estadisticas.tendenciaTemporal).map(([fecha, votos]) => (
                    <div key={fecha} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{formatDate(fecha)}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(votos / estadisticas.estadisticasBasicas.totalVotos) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 min-w-[2rem]">{votos}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Estadísticas adicionales</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hora con más votos:</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(estadisticas.estadisticasAdicionales.horaConMasVotos)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Promedio por hora:</span>
                    <span className="font-medium text-gray-900">
                      {estadisticas.estadisticasAdicionales.promedioVotosPorHora.toFixed(1)} votos
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-purple-500 mr-2" />
              <h3 className="text-xl font-semibold text-gray-900">Actividad Reciente</h3>
            </div>

            <div className="space-y-3">
              {estadisticas.actividadReciente.length > 0 ? (
                estadisticas.actividadReciente.map((actividad, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      {actividad.blockchainVerified ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                      ) : (
                        <Clock className="w-5 h-5 text-yellow-500 mr-3" />
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Voto {actividad.blockchainVerified ? 'verificado' : 'pendiente'}
                        </p>
                        <p className="text-xs text-gray-500">{formatDate(actividad.timestamp)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="bg-white px-2 py-1 rounded text-xs font-mono">
                        {actividad.userHash}
                      </code>
                      <button
                        onClick={() => copyToClipboard(actividad.userHash, `activity-${index}`)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                      >
                        {copiedHash === `activity-${index}` ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No hay actividad reciente disponible</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href={`/user/votaciones/${votacionId}`}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors !text-white"
          >
            <Info className="w-5 h-5 mr-2" />
            Ver detalles de votación
          </Link>
          <Link
            href="/user/votaciones"
            className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors !text-white"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            Ver todas las votaciones
          </Link>
        </div>
      </div>
    </div>
  );
}
