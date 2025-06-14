'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Vote, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Activity,
  PlusCircle,
  FileText,
  Shield,
  Download,
  RefreshCw
} from 'lucide-react';

interface VotacionAdmin {
  id: string;
  titulo: string;
  tipo: string;
  estado: 'abierta' | 'cerrada' | 'borrador' | 'programada';
  fechaInicio: string;
  fechaCierre: string;
  participantes: number;
  totalElegibles: number;
  categoria: string;
}

const mockVotaciones: VotacionAdmin[] = [
  {
    id: '1',
    titulo: 'Presupuesto participativo 2025',
    tipo: 'Asignación de recursos',
    estado: 'abierta',
    fechaInicio: '2025-05-15',
    fechaCierre: '2025-05-30',
    participantes: 1125,
    totalElegibles: 2500,
    categoria: 'Presupuesto'
  },
  {
    id: '2',
    titulo: 'Representante vecinal 2024',
    tipo: 'Elección de representantes',
    estado: 'cerrada',
    fechaInicio: '2024-11-01',
    fechaCierre: '2024-11-20',
    participantes: 1890,
    totalElegibles: 2500,
    categoria: 'Representación'
  },
  {
    id: '3',
    titulo: 'Consulta sobre seguridad ciudadana',
    tipo: 'Consulta ciudadana',
    estado: 'cerrada',
    fechaInicio: '2024-08-01',
    fechaCierre: '2024-08-18',
    participantes: 1600,
    totalElegibles: 2500,
    categoria: 'Seguridad'
  },
  {
    id: '4',
    titulo: 'Selección de nombre para parque',
    tipo: 'Consulta ciudadana',
    estado: 'borrador',
    fechaInicio: '',
    fechaCierre: '',
    participantes: 0,
    totalElegibles: 0,
    categoria: 'Infraestructura'
  }
];

const logActividad = [
  {
    id: '1',
    fecha: '2025-06-12T10:32:00Z',
    usuario: 'votante_32',
    accion: 'Emitió voto',
    recurso: 'Presupuesto 2025',
    estado: 'exito'
  },
  {
    id: '2',
    fecha: '2025-06-12T10:28:00Z',
    usuario: 'admin',
    accion: 'Modificó votación',
    recurso: 'Elección vecinal',
    estado: 'exito'
  },
  {
    id: '3',
    fecha: '2025-06-11T15:12:00Z',
    usuario: 'votante_45',
    accion: 'Intento de acceso',
    recurso: 'Panel admin',
    estado: 'error'
  }
];

export default function AdminDashboard() {
  const [refreshing, setRefreshing] = useState(false);
  const votacionesAbiertas = mockVotaciones.filter(v => v.estado === 'abierta');
  const votacionesBorrador = mockVotaciones.filter(v => v.estado === 'borrador');

  const participacionPromedio = mockVotaciones
    .filter(v => v.totalElegibles > 0)
    .reduce((acc, v) => acc + (v.participantes / v.totalElegibles), 0) / 
    mockVotaciones.filter(v => v.totalElegibles > 0).length * 100;

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'abierta':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Abierta
          </span>
        );
      case 'cerrada':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="w-3 h-3 mr-1" />
            Cerrada
          </span>
        );
      case 'borrador':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Borrador
          </span>
        );
      case 'programada':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <Clock className="w-3 h-3 mr-1" />
            Programada
          </span>
        );      default:
        return null;
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Administración</h1>
          <p className="text-gray-600 mt-1">
            Gestión y monitoreo del sistema VoteChain
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
          <Link
            href="/admin/crear-votacion"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Nueva votación
          </Link>
        </div>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total votaciones</p>
              <p className="text-3xl font-bold">{mockVotaciones.length}</p>
              <p className="text-blue-100 text-xs mt-1">En el sistema</p>
            </div>
            <div className="p-3 bg-blue-400 bg-opacity-30 rounded-lg">
              <Vote className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Votaciones activas</p>
              <p className="text-3xl font-bold">{votacionesAbiertas.length}</p>
              <p className="text-green-100 text-xs mt-1">En progreso</p>
            </div>
            <div className="p-3 bg-green-400 bg-opacity-30 rounded-lg">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-medium">En borrador</p>
              <p className="text-3xl font-bold">{votacionesBorrador.length}</p>
              <p className="text-yellow-100 text-xs mt-1">Pendientes</p>
            </div>
            <div className="p-3 bg-yellow-400 bg-opacity-30 rounded-lg">
              <Clock className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Participación promedio</p>
              <p className="text-3xl font-bold">{Math.round(participacionPromedio)}%</p>
              <p className="text-purple-100 text-xs mt-1">En votaciones activas</p>
            </div>
            <div className="p-3 bg-purple-400 bg-opacity-30 rounded-lg">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Votaciones recientes */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Gestión de votaciones</h3>
                <Link
                  href="/admin/votaciones"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ver todas →
                </Link>
              </div>
            </div>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Título
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Participación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockVotaciones.slice(0, 4).map((votacion) => (
                    <tr key={votacion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{votacion.titulo}</div>
                          <div className="text-sm text-gray-500">{votacion.tipo}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getEstadoBadge(votacion.estado)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {votacion.totalElegibles > 0 ? (
                          <div>
                            <div className="font-medium">
                              {Math.round((votacion.participantes / votacion.totalElegibles) * 100)}%
                            </div>
                            <div className="text-gray-500">
                              {votacion.participantes} / {votacion.totalElegibles}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900">Editar</button>
                        {votacion.estado === 'abierta' && (
                          <button className="text-red-600 hover:text-red-900">Cerrar</button>
                        )}
                        <button className="text-gray-600 hover:text-gray-900">Ver</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Panel lateral */}
        <div className="space-y-6">
          {/* Actividad reciente */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Actividad reciente
                </h3>
                <Link
                  href="/admin/logs"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Ver logs →
                </Link>
              </div>
            </div>
            <div className="px-6 py-4">
              <div className="space-y-4">
                {logActividad.map((log) => (
                  <div key={log.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                      log.estado === 'exito' ? 'bg-green-400' : 'bg-red-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">{log.usuario}</span> {log.accion.toLowerCase()}
                      </div>
                      <div className="text-sm text-gray-500">{log.recurso}</div>
                      <div className="text-xs text-gray-400">{formatDateTime(log.fecha)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Acciones rápidas</h3>
            </div>
            <div className="px-6 py-4 space-y-3">
              <Link
                href="/admin/crear-votacion"
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Nueva votación
              </Link>
              <Link
                href="/admin/logs"
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="w-4 h-4 mr-2" />
                Ver registros
              </Link>
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Exportar datos
              </button>
            </div>
          </div>

          {/* Estado del sistema */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Estado del sistema
              </h3>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Base de datos</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Operativo
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Blockchain</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Sincronizado
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Último backup</span>
                <span className="text-xs text-gray-500">Hace 2 horas</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
