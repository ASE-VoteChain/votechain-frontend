'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Filter, 
  Edit, 
  Eye,   Trash2, 
  PlusCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react';

interface VotacionAdmin {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: string;
  estado: 'abierta' | 'cerrada' | 'borrador' | 'programada';
  fechaInicio: string;
  fechaCierre: string;
  participantes: number;
  totalElegibles: number;
  categoria: string;
  visibilidad: 'publica' | 'privada';
  createdBy: string;
  createdAt: string;
}

const mockVotaciones: VotacionAdmin[] = [
  {
    id: '1',
    titulo: 'Presupuesto participativo 2025',
    descripcion: 'Distribución del presupuesto municipal para proyectos comunitarios.',
    tipo: 'Asignación de recursos',
    estado: 'abierta',
    fechaInicio: '2025-05-15',
    fechaCierre: '2025-05-30',
    participantes: 1125,
    totalElegibles: 2500,
    categoria: 'Presupuesto',
    visibilidad: 'publica',
    createdBy: 'admin',
    createdAt: '2025-05-10T09:00:00Z'
  },
  {
    id: '2',
    titulo: 'Representante vecinal 2024',
    descripcion: 'Elección del representante vecinal para el período 2024-2026.',
    tipo: 'Elección de representantes',
    estado: 'cerrada',
    fechaInicio: '2024-11-01',
    fechaCierre: '2024-11-20',
    participantes: 1890,
    totalElegibles: 2500,
    categoria: 'Representación',
    visibilidad: 'publica',
    createdBy: 'admin',
    createdAt: '2024-10-25T14:30:00Z'
  },
  {
    id: '3',
    titulo: 'Consulta sobre seguridad ciudadana',
    descripcion: 'Propuestas para mejorar la seguridad en espacios públicos.',
    tipo: 'Consulta ciudadana',
    estado: 'cerrada',
    fechaInicio: '2024-08-01',
    fechaCierre: '2024-08-18',
    participantes: 1600,
    totalElegibles: 2500,
    categoria: 'Seguridad',
    visibilidad: 'publica',
    createdBy: 'admin',
    createdAt: '2024-07-28T11:15:00Z'
  },
  {
    id: '4',
    titulo: 'Selección de nombre para parque',
    descripcion: 'Votación para elegir el nombre del nuevo parque municipal.',
    tipo: 'Consulta ciudadana',
    estado: 'borrador',
    fechaInicio: '',
    fechaCierre: '',
    participantes: 0,
    totalElegibles: 0,
    categoria: 'Infraestructura',
    visibilidad: 'publica',
    createdBy: 'admin',
    createdAt: '2025-06-10T16:45:00Z'
  },
  {
    id: '5',
    titulo: 'Renovación junta directiva',
    descripcion: 'Elección de nuevos miembros para la junta directiva.',
    tipo: 'Elección de representantes',
    estado: 'programada',
    fechaInicio: '2025-07-01',
    fechaCierre: '2025-07-15',
    participantes: 0,
    totalElegibles: 800,
    categoria: 'Administración',
    visibilidad: 'privada',
    createdBy: 'admin',
    createdAt: '2025-06-05T10:20:00Z'
  }
];

export default function AdminVotacionesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const votacionesFiltradas = mockVotaciones.filter(votacion => {
    const matchSearch = votacion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       votacion.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchEstado = filtroEstado === 'todas' || votacion.estado === filtroEstado;
    const matchCategoria = filtroCategoria === 'todas' || votacion.categoria === filtroCategoria;
    
    return matchSearch && matchEstado && matchCategoria;
  });

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
            <Calendar className="w-3 h-3 mr-1" />
            Programada
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getParticipationRate = (participantes: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((participantes / total) * 100);
  };

  const categorias = ['todas', ...Array.from(new Set(mockVotaciones.map(v => v.categoria)))];

  const handleDeleteVotacion = (id: string) => {
    // Aquí iría la lógica para eliminar la votación
    console.log('Eliminar votación:', id);
    setShowDeleteModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de votaciones</h1>
          <p className="text-gray-600 mt-1">
            Administra todas las votaciones del sistema
          </p>
        </div>
        <Link
          href="/admin/crear-votacion"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Nueva votación
        </Link>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{mockVotaciones.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Abiertas</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockVotaciones.filter(v => v.estado === 'abierta').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Borradores</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockVotaciones.filter(v => v.estado === 'borrador').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <XCircle className="w-6 h-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cerradas</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockVotaciones.filter(v => v.estado === 'cerrada').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar votaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtro por estado */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todos los estados</option>
              <option value="abierta">Abiertas</option>
              <option value="cerrada">Cerradas</option>
              <option value="borrador">Borradores</option>
              <option value="programada">Programadas</option>
            </select>
          </div>

          {/* Filtro por categoría */}
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categorias.map(categoria => (
              <option key={categoria} value={categoria}>
                {categoria === 'todas' ? 'Todas las categorías' : categoria}
              </option>
            ))}
          </select>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {votacionesFiltradas.length} votación{votacionesFiltradas.length !== 1 ? 'es' : ''} encontrada{votacionesFiltradas.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Tabla de votaciones */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha cierre
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
              {votacionesFiltradas.map((votacion) => (
                <tr key={votacion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{votacion.titulo}</div>
                      <div className="text-sm text-gray-500">{votacion.categoria}</div>
                      {votacion.visibilidad === 'privada' && (
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800 mt-1">
                          Privada
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {votacion.tipo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEstadoBadge(votacion.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(votacion.fechaCierre)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {votacion.totalElegibles > 0 ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {getParticipationRate(votacion.participantes, votacion.totalElegibles)}%
                        </div>
                        <div className="text-sm text-gray-500">
                          {votacion.participantes} / {votacion.totalElegibles}
                        </div>
                        <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ 
                              width: `${getParticipationRate(votacion.participantes, votacion.totalElegibles)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      {votacion.estado === 'abierta' && (
                        <button className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50">
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      
                      {votacion.estado === 'borrador' && (
                        <button className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      
                      <Link 
                        href={`/admin/votaciones/${votacion.id}`}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      
                      <button 
                        onClick={() => setShowDeleteModal(votacion.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Confirmar eliminación
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar esta votación? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteVotacion(showDeleteModal)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje si no hay resultados */}
      {votacionesFiltradas.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron votaciones
          </h3>
          <p className="text-gray-500 mb-4">
            Intenta ajustar los filtros de búsqueda o crea una nueva votación.
          </p>
          <Link
            href="/admin/crear-votacion"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Crear nueva votación
          </Link>
        </div>
      )}
    </div>
  );
}
