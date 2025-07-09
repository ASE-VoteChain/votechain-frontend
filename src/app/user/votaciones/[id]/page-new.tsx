'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import useUser from '@/hooks/useUser';
import voteService, { VotacionDetalle, CreateVoteRequest } from '@/lib/voteService';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Users, 
  AlertTriangle,
  Shield,
  Info,
  Calendar,
  MapPin,
  User,
  Lock,
  Vote,
  Loader2,
  Hash,
  ExternalLink,
  FileText
} from 'lucide-react';

export default function VotacionDetallePage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: userLoading } = useUser();
  
  const [votacion, setVotacion] = useState<VotacionDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOpcion, setSelectedOpcion] = useState<number | null>(null);
  const [voting, setVoting] = useState(false);
  const [voteSuccess, setVoteSuccess] = useState(false);
  const [voteError, setVoteError] = useState('');

  const votacionId = params?.id ? parseInt(params.id as string) : null;

  // Cargar detalle de la votación
  useEffect(() => {
    if (!userLoading && user && votacionId) {
      loadVotacionDetail();
    } else if (!userLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, userLoading, votacionId]);

  const loadVotacionDetail = async () => {
    if (!votacionId) return;
    
    try {
      setLoading(true);
      setError('');
      
      console.log('📊 Cargando detalle de votación:', votacionId);
      const votacionData = await voteService.getVotacionDetail(votacionId);
      setVotacion(votacionData);
      
      console.log('✅ Detalle de votación cargado:', {
        id: votacionData.id,
        titulo: votacionData.titulo,
        estado: votacionData.estado,
        hasParticipated: votacionData.hasParticipated,
        opciones: votacionData.opciones?.length || 0
      });
      
    } catch (err) {
      console.error('❌ Error cargando detalle de votación:', err);
      setError(err instanceof Error ? err.message : 'Error cargando votación');
    } finally {
      setLoading(false);
    }
  };

  // Manejar envío de voto
  const handleVote = async () => {
    if (!votacion || !selectedOpcion || !user) return;

    try {
      setVoting(true);
      setVoteError('');

      const voteData: CreateVoteRequest = {
        votacionId: votacion.id,
        opcionId: selectedOpcion
      };

      console.log('🗳️ Enviando voto:', voteData);
      const voteResponse = await voteService.createVote(voteData);
      
      console.log('✅ Voto enviado exitosamente:', voteResponse);
      setVoteSuccess(true);
      
      // Recargar datos de la votación para reflejar el voto
      setTimeout(() => {
        loadVotacionDetail();
      }, 1000);
      
    } catch (err) {
      console.error('❌ Error enviando voto:', err);
      setVoteError(err instanceof Error ? err.message : 'Error enviando voto');
    } finally {
      setVoting(false);
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gray-200 rounded mr-3"></div>
                <div className="h-6 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
              
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <h2 className="text-lg font-semibold text-red-800 mb-2">Error al cargar votación</h2>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={loadVotacionDetail}
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

  if (!votacion) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Votación no encontrada</h2>
            <p className="text-gray-600 mb-4">La votación que buscas no existe o no tienes acceso a ella.</p>
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

  const isVotingAvailable = voteService.isVotingAvailable(votacion);
  const estadoMessage = voteService.getEstadoMessage(votacion);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Volver
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Detalle de Votación</h1>
        </div>

        {/* Mensaje de éxito del voto */}
        {voteSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">¡Voto registrado exitosamente!</h3>
                <p className="text-green-600">Tu voto ha sido registrado y procesado en la blockchain.</p>
              </div>
            </div>
          </div>
        )}

        {/* Información principal de la votación */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{votacion.titulo}</h2>
                <p className="text-gray-600 text-lg">{votacion.descripcion}</p>
              </div>
              <div className="ml-4">
                {votacion.hasParticipated ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Ya votaste
                  </span>
                ) : isVotingAvailable ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <Vote className="w-4 h-4 mr-1" />
                    Disponible
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    <Lock className="w-4 h-4 mr-1" />
                    No disponible
                  </span>
                )}
              </div>
            </div>

            {/* Estado y mensaje */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Info className="w-5 h-5 text-blue-500 mr-2" />
                <p className="text-blue-800">{estadoMessage}</p>
              </div>
            </div>

            {/* Información de la votación */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="font-medium text-gray-700">Período</span>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Inicio:</strong> {voteService.formatDate(votacion.fechaInicio)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Fin:</strong> {voteService.formatDate(votacion.fechaFin)}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Users className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="font-medium text-gray-700">Participación</span>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Participantes:</strong> {votacion.participantes || 0}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Total elegibles:</strong> {votacion.totalElegibles || 0}
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="font-medium text-gray-700">Información</span>
                </div>
                <p className="text-sm text-gray-600">
                  <strong>Categoría:</strong> {voteService.mapCategoria(votacion.categoria)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Organizador:</strong> {votacion.organizador || 'Sistema'}
                </p>
              </div>
            </div>

            {/* Ubicación */}
            {votacion.ubicacion && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                  <span className="font-medium text-gray-700">Ubicación</span>
                </div>
                <p className="text-gray-600">{votacion.ubicacion}</p>
              </div>
            )}

            {/* Requisitos */}
            {votacion.requisitos && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-yellow-500 mr-2" />
                  <span className="font-medium text-yellow-800">Requisitos</span>
                </div>
                <p className="text-yellow-700">{votacion.requisitos}</p>
              </div>
            )}
          </div>
        </div>

        {/* Opciones de votación */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Opciones disponibles ({votacion.opciones?.length || 0})
            </h3>

            {votacion.hasParticipated && votacion.userVote ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                    <span className="font-medium text-green-800">Tu voto registrado</span>
                  </div>
                  <p className="text-green-700 mb-2">
                    <strong>Opción seleccionada:</strong> {votacion.userVote.opcionTitulo}
                  </p>
                  <p className="text-sm text-green-600">
                    <strong>Fecha:</strong> {voteService.formatDate(votacion.userVote.fechaVoto)}
                  </p>
                  {votacion.userVote.hashTransaccion && (
                    <p className="text-sm text-green-600 flex items-center mt-2">
                      <Hash className="w-4 h-4 mr-1" />
                      <strong>Hash:</strong> 
                      <code className="ml-1 bg-green-100 px-2 py-1 rounded text-xs">
                        {votacion.userVote.hashTransaccion}
                      </code>
                    </p>
                  )}
                </div>

                {/* Mostrar todas las opciones */}
                <div className="space-y-3">
                  {votacion.opciones?.map((opcion) => (
                    <div
                      key={opcion.id}
                      className={`border rounded-lg p-4 ${
                        votacion.userVote?.opcionId === opcion.id
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className={`font-medium ${
                            votacion.userVote?.opcionId === opcion.id
                              ? 'text-green-800'
                              : 'text-gray-800'
                          }`}>
                            {opcion.titulo}
                            {votacion.userVote?.opcionId === opcion.id && (
                              <span className="ml-2 text-sm text-green-600">(Tu elección)</span>
                            )}
                          </h4>
                          {opcion.descripcion && (
                            <p className={`text-sm mt-1 ${
                              votacion.userVote?.opcionId === opcion.id
                                ? 'text-green-600'
                                : 'text-gray-600'
                            }`}>
                              {opcion.descripcion}
                            </p>
                          )}
                        </div>
                        {opcion.totalVotos !== undefined && (
                          <span className={`text-sm font-medium ${
                            votacion.userVote?.opcionId === opcion.id
                              ? 'text-green-700'
                              : 'text-gray-600'
                          }`}>
                            {opcion.totalVotos} votos
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : isVotingAvailable ? (
              <div className="space-y-4">
                {/* Error de voto */}
                {voteError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-red-500 mr-2" />
                      <p className="text-red-700">{voteError}</p>
                    </div>
                  </div>
                )}

                <p className="text-gray-600 mb-4">
                  Selecciona una opción para emitir tu voto:
                </p>

                <div className="space-y-3">
                  {votacion.opciones?.map((opcion) => (
                    <label
                      key={opcion.id}
                      className={`block border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedOpcion === opcion.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="opcion"
                          value={opcion.id}
                          checked={selectedOpcion === opcion.id}
                          onChange={() => setSelectedOpcion(opcion.id)}
                          className="mt-1 mr-3 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{opcion.titulo}</h4>
                          {opcion.descripcion && (
                            <p className="text-sm text-gray-600 mt-1">{opcion.descripcion}</p>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Botón de votar */}
                <div className="pt-4">
                  <button
                    onClick={handleVote}
                    disabled={!selectedOpcion || voting}
                    className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {voting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Enviando voto...
                      </>
                    ) : (
                      <>
                        <Vote className="w-5 h-5 mr-2" />
                        Emitir voto
                      </>
                    )}
                  </button>
                  {selectedOpcion && !voting && (
                    <p className="text-sm text-gray-500 text-center mt-2">
                      Al hacer clic confirmas tu voto. Esta acción no se puede deshacer.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {votacion.opciones?.map((opcion) => (
                  <div
                    key={opcion.id}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{opcion.titulo}</h4>
                        {opcion.descripcion && (
                          <p className="text-sm text-gray-600 mt-1">{opcion.descripcion}</p>
                        )}
                      </div>
                      {opcion.totalVotos !== undefined && (
                        <span className="text-sm font-medium text-gray-600">
                          {opcion.totalVotos} votos
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información adicional</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">
                  <strong>ID de votación:</strong> {votacion.id}
                </p>
                <p className="text-gray-600">
                  <strong>Estado:</strong> {voteService.mapEstado(votacion.estado)}
                </p>
                <p className="text-gray-600">
                  <strong>Creada:</strong> {voteService.formatDate(votacion.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-gray-600">
                  <strong>Última actualización:</strong> {voteService.formatDate(votacion.updatedAt)}
                </p>
                <p className="text-gray-600">
                  <strong>Opciones disponibles:</strong> {votacion.opciones?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
