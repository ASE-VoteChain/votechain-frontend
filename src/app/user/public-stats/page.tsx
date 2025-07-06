'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import useUser from '@/hooks/useUser'
import StatisticsService, { PublicStats } from '@/lib/statisticsService'
import { 
  Vote, 
  Users, 
  BarChart3, 
  TrendingUp,
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  RefreshCw,
  ArrowRight,
  PlusCircle,
  Eye,
  Award,
  Globe,
  TrendingDown
} from 'lucide-react'

export default function PublicStatsPage() {
  const { user, loading: userLoading } = useUser()
  const [stats, setStats] = useState<PublicStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        setError('')
        const publicStats = await StatisticsService.getPublicStats()
        setStats(publicStats)
        
        // Mostrar mensaje informativo si estamos usando datos de fallback
        if (publicStats._source === 'fallback') {
          console.log('ℹ️ Mostrando datos de demostración - el backend no está disponible')
        }
      } catch (error: unknown) {
        console.error('Error cargando estadísticas públicas:', error)
        // Este catch ya no debería ejecutarse normalmente ya que getPublicStats siempre retorna datos
        setError((error as Error).message || 'Error cargando estadísticas públicas')
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const handleRefreshStats = async () => {
    try {
      setLoading(true)
      setError('')
      const publicStats = await StatisticsService.getPublicStats()
      setStats(publicStats)
      
      // Mostrar mensaje informativo si estamos usando datos de fallback
      if (publicStats._source === 'fallback') {
        console.log('ℹ️ Mostrando datos de demostración - el backend no está disponible')
      }
    } catch (error: unknown) {
      console.error('Error actualizando estadísticas públicas:', error)
      // Este catch ya no debería ejecutarse normalmente ya que getPublicStats siempre retorna datos
      setError((error as Error).message || 'Error actualizando estadísticas')
    } finally {
      setLoading(false)
    }
  }

  // Mensaje cuando no hay datos del sistema
  const noSystemDataMessage = (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-lg p-8 text-center">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Globe className="w-8 h-8 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-blue-900 mb-2">
        Sistema en Inicio
      </h3>
      <p className="text-blue-700 mb-6 max-w-md mx-auto">
        El sistema de votaciones está iniciándose. Pronto habrá estadísticas públicas disponibles para mostrar.
      </p>
      <div className="space-y-3">
        <button
          onClick={handleRefreshStats}
          className="block w-full sm:inline-block sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mr-0 sm:mr-3"
        >
          <RefreshCw className="w-4 h-4 inline mr-2" />
          Actualizar estadísticas
        </button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Globe className="w-10 h-10 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Estadísticas Públicas
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Descubre la actividad del sistema VoteChain. Estas estadísticas muestran el nivel de participación y engagement de nuestra comunidad de votación.
        </p>
      </div>

      {/* Indicador de datos de demostración */}
      {stats?._source === 'fallback' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mr-3">
              <span className="text-yellow-800 text-xs font-bold">!</span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                Mostrando datos de demostración
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                El servidor backend no está disponible. Los datos mostrados son ejemplos para demostrar la funcionalidad del sistema.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Estadísticas del Sistema */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <TrendingDown className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error al cargar estadísticas</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleRefreshStats}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Intentar de nuevo
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="animate-pulse">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                  <div className="ml-4 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : !stats ? (
        noSystemDataMessage
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Votaciones Activas</p>
                  <p className="text-3xl font-bold mb-1">{stats.votacionesActivas}</p>
                  <p className="text-blue-100 text-xs">Disponibles ahora</p>
                </div>
                <div className="p-3 bg-blue-400 bg-opacity-30 rounded-lg">
                  <Vote className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total de Votos</p>
                  <p className="text-3xl font-bold mb-1">{stats.totalVotos.toLocaleString()}</p>
                  <p className="text-green-100 text-xs">Votos registrados</p>
                </div>
                <div className="p-3 bg-green-400 bg-opacity-30 rounded-lg">
                  <CheckCircle className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Votaciones</p>
                  <p className="text-3xl font-bold mb-1">{stats.totalVotaciones}</p>
                  <p className="text-purple-100 text-xs">Creadas históricamente</p>
                </div>
                <div className="p-3 bg-purple-400 bg-opacity-30 rounded-lg">
                  <BarChart3 className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg shadow-lg p-6 text-white transform hover:scale-105 transition-transform">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Usuarios Registrados</p>
                  <p className="text-3xl font-bold mb-1">{stats.totalUsuarios.toLocaleString()}</p>
                  <p className="text-orange-100 text-xs">Miembros activos</p>
                </div>
                <div className="p-3 bg-orange-400 bg-opacity-30 rounded-lg">
                  <Users className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>

          {/* Métricas Adicionales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Participación</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Promedio por votación</span>
                  <span className="font-semibold text-gray-900">
                    {stats.totalVotaciones > 0 ? Math.round(stats.totalVotos / stats.totalVotaciones) : 0} votos
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Tasa de votaciones activas</span>
                  <span className="font-semibold text-gray-900">
                    {stats.totalVotaciones > 0 ? Math.round((stats.votacionesActivas / stats.totalVotaciones) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Activity className="w-6 h-6 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Actividad</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Votaciones por usuario</span>
                  <span className="font-semibold text-gray-900">
                    {stats.totalUsuarios > 0 ? (stats.totalVotaciones / stats.totalUsuarios).toFixed(1) : 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Votos por usuario</span>
                  <span className="font-semibold text-gray-900">
                    {stats.totalUsuarios > 0 ? (stats.totalVotos / stats.totalUsuarios).toFixed(1) : 0}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Globe className="w-6 h-6 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Estado del Sistema</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-2 ${stats.votacionesActivas > 0 ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                  <span className="text-sm text-gray-600">
                    {stats.votacionesActivas > 0 ? 'Sistema activo' : 'Sistema en espera'}
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Datos actualizados</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Votaciones */}
          {stats.topVotaciones && stats.topVotaciones.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Award className="w-6 h-6 text-yellow-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Votaciones Más Populares</h2>
                </div>
                <button
                  onClick={handleRefreshStats}
                  disabled={loading}
                  className="flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
                  Actualizar
                </button>
              </div>
              <div className="space-y-4">
                {stats.topVotaciones.map((votacion, index) => (
                  <div key={votacion.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-700 font-bold text-sm">#{index + 1}</span>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-gray-900 mb-1">{votacion.titulo}</h3>
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${StatisticsService.getEstadoColor(votacion.estado)}`}>
                            {StatisticsService.translateEstado(votacion.estado)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${StatisticsService.getCategoriaColor(votacion.categoria)}`}>
                            {StatisticsService.translateCategoria(votacion.categoria)}
                          </span>
                          <span className="text-xs text-gray-500">
                            por {votacion.creador}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Creada el {StatisticsService.formatDateOnly(votacion.fechaCreacion)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold text-green-600">{votacion.totalVotos}</p>
                      <p className="text-xs text-gray-500">votos</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Vote className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aún no hay votaciones
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                El sistema está funcionando pero aún no se han creado votaciones. ¡Sé el primero en crear una!
              </p>
              <div className="space-y-3">
                {user ? (
                  <Link
                    href="/user/crear-votacion"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Crear primera votación
                  </Link>
                ) : (
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Registrarse para crear votaciones
                  </Link>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">¿Listo para participar?</h2>
        <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          Únete a nuestra comunidad de votación y forma parte del futuro de la democracia digital.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <>
              <Link
                href="/user/dashboard"
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <Activity className="w-4 h-4 inline mr-2" />
                Ir al Dashboard
              </Link>
              <Link
                href="/user/votaciones"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-colors"
              >
                <Vote className="w-4 h-4 inline mr-2" />
                Ver Votaciones
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/register"
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <Users className="w-4 h-4 inline mr-2" />
                Registrarse
              </Link>
              <Link
                href="/auth/login"
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-400 transition-colors"
              >
                <ArrowRight className="w-4 h-4 inline mr-2" />
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Footer info */}
      {stats && (
        <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-4">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>Última actualización: {StatisticsService.formatDate(stats.generadoEn)}</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
              <span>Datos verificados</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
