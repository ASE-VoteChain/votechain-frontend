'use client';

import { useState } from 'react';
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
  Hash,
  ExternalLink
} from 'lucide-react';

interface VotacionUsuario {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'abierta' | 'proxima' | 'cerrada';
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
  notificacionesActivas?: boolean;
}

const mockVotaciones: VotacionUsuario[] = [
  {
    id: '1',
    titulo: 'Elección de representante vecinal',
    descripcion: 'Esta votación busca elegir al representante vecinal que actuará como enlace entre la comunidad y las autoridades municipales durante el período 2025-2026.',
    fechaInicio: '2025-05-10',
    fechaFin: '2025-05-25',
    estado: 'abierta',
    participantes: 1650,
    totalElegibles: 2500,
    hasParticipated: false,
    categoria: 'Representación',
    tipo: 'Elección de representante',
    ubicacion: 'Sector Norte - Barrio Las Flores',
    organizador: 'Junta de Acción Comunal',
    prioridad: 'alta',
    notificacionesActivas: true
  },
  {
    id: '2',
    titulo: 'Presupuesto participativo 2025',
    descripcion: 'Participa en la distribución del presupuesto municipal para proyectos comunitarios. Tus decisiones definirán las prioridades de inversión para el próximo año.',
    fechaInicio: '2025-05-15',
    fechaFin: '2025-05-30',
    estado: 'abierta',
    participantes: 1125,
    totalElegibles: 2500,
    hasParticipated: true,
    categoria: 'Presupuesto',
    tipo: 'Asignación de presupuesto',
    ubicacion: 'Municipal - Toda la ciudad',
    organizador: 'Alcaldía Municipal',
    prioridad: 'alta',
    fechaVoto: '2025-05-16T10:30:00Z',
    opcionSeleccionada: 'Mejora de parques y espacios verdes',
    hashTransaccion: '0x8f7d2a3b1c9e6f4a2d8b5c7e9f1a3d6b',
    notificacionesActivas: false
  },
  {
    id: '3',
    titulo: 'Consulta ciudadana sobre seguridad',
    descripcion: 'Consulta finalizada sobre propuestas de mejora para la seguridad en la comunidad. Los resultados están disponibles para conocer las medidas priorizadas por los ciudadanos.',
    fechaInicio: '2025-04-05',
    fechaFin: '2025-04-20',
    estado: 'cerrada',
    participantes: 1950,
    totalElegibles: 2500,
    hasParticipated: true,
    categoria: 'Seguridad',
    tipo: 'Consulta ciudadana',
    ubicacion: 'Municipal - Toda la ciudad',
    organizador: 'Secretaría de Seguridad',
    prioridad: 'media',
    fechaVoto: '2025-04-08T14:15:00Z',
    opcionSeleccionada: 'Mejora de iluminación pública',
    hashTransaccion: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    notificacionesActivas: false
  },
  {
    id: '4',
    titulo: 'Consulta sobre transporte público',
    descripcion: 'Evaluación de propuestas para mejorar el sistema de transporte público de la ciudad. Incluye nuevas rutas y mejoras en frecuencia.',
    fechaInicio: '2025-06-01',
    fechaFin: '2025-06-15',
    estado: 'proxima',
    participantes: 0,
    totalElegibles: 3200,
    hasParticipated: false,
    categoria: 'Transporte',
    tipo: 'Consulta pública',
    ubicacion: 'Municipal - Toda la ciudad',
    organizador: 'Secretaría de Movilidad',
    prioridad: 'media',
    notificacionesActivas: true
  },
  {
    id: '5',
    titulo: 'Renovación del consejo de administración',
    descripcion: 'Elección de nuevos miembros para el consejo de administración del conjunto residencial.',
    fechaInicio: '2025-07-01',
    fechaFin: '2025-07-15',
    estado: 'proxima',
    participantes: 0,
    totalElegibles: 800,
    hasParticipated: false,
    categoria: 'Administración',
    tipo: 'Elección de consejo',
    ubicacion: 'Conjunto Residencial Torres del Norte',
    organizador: 'Administración del Conjunto',
    prioridad: 'media',
    notificacionesActivas: false
  }
];

export default function VotacionesUsuarioPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [filtroCategoria, setFiltroCategoria] = useState('todas');
  const [filtroParticipacion, setFiltroParticipacion] = useState('todas');
  const [vistaActual, setVistaActual] = useState<'todas' | 'participadas' | 'pendientes'>('todas');

  const votacionesFiltradas = mockVotaciones.filter(votacion => {
    const matchSearch = votacion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       votacion.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchEstado = filtroEstado === 'todas' || votacion.estado === filtroEstado;
    const matchCategoria = filtroCategoria === 'todas' || votacion.categoria === filtroCategoria;
    const matchParticipacion = filtroParticipacion === 'todas' || 
      (filtroParticipacion === 'participadas' && votacion.hasParticipated) ||
      (filtroParticipacion === 'pendientes' && !votacion.hasParticipated);
    
    const matchVista = vistaActual === 'todas' ||
      (vistaActual === 'participadas' && votacion.hasParticipated) ||
      (vistaActual === 'pendientes' && !votacion.hasParticipated && votacion.estado === 'abierta');
    
    return matchSearch && matchEstado && matchCategoria && matchParticipacion && matchVista;
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

  const getParticipationRate = (participantes: number, total: number) => {
    return Math.round((participantes / total) * 100);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const categorias = ['todas', ...Array.from(new Set(mockVotaciones.map(v => v.categoria)))];
  const votacionesAbiertas = mockVotaciones.filter(v => v.estado === 'abierta');
  const votacionesProximas = mockVotaciones.filter(v => v.estado === 'proxima');
  const votacionesParticipadas = mockVotaciones.filter(v => v.hasParticipated);
  const votacionesCerradas = mockVotaciones.filter(v => v.estado === 'cerrada');

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
            <Bell className="w-4 h-4 mr-2" />
            Configurar notificaciones
          </button>
        </div>
      </div>

      {/* Dashboard de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Abiertas</p>
              <p className="text-3xl font-bold">{votacionesAbiertas.length}</p>
              <p className="text-green-100 text-xs mt-1">
                {votacionesAbiertas.filter(v => !v.hasParticipated).length} pendientes
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
                {votacionesProximas.filter(v => v.notificacionesActivas).length} con notificaciones
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
                {Math.round((votacionesParticipadas.length / mockVotaciones.length) * 100)}% del total
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
                Resultados disponibles
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
            onClick={() => setVistaActual('todas')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              vistaActual === 'todas'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Todas las votaciones
            <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
              {mockVotaciones.length}
            </span>
          </button>
          <button
            onClick={() => setVistaActual('pendientes')}
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
            onClick={() => setVistaActual('participadas')}
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
        </nav>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <option value="proxima">Próximas</option>
              <option value="cerrada">Cerradas</option>
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

          {/* Filtro por participación */}
          <select
            value={filtroParticipacion}
            onChange={(e) => setFiltroParticipacion(e.target.value)}
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
            onClick={() => {
              setSearchTerm('');
              setFiltroEstado('todas');
              setFiltroCategoria('todas');
              setFiltroParticipacion('todas');
              setVistaActual('todas');
            }}
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
                  <div className="bg-green-50 rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-green-900 flex items-center">
                      <History className="w-4 h-4 mr-2" />
                      Tu participación
                    </h4>
                    <div className="text-sm text-green-800 space-y-1">
                      <p><strong>Fecha:</strong> {votacion.fechaVoto ? formatDateTime(votacion.fechaVoto) : 'No disponible'}</p>
                      <p><strong>Opción:</strong> {votacion.opcionSeleccionada || 'No disponible'}</p>
                      {votacion.hashTransaccion && (
                        <div className="flex items-center">
                          <Hash className="w-3 h-3 mr-1" />
                          <span className="font-mono text-xs break-all">{votacion.hashTransaccion}</span>
                          <button className="ml-2 text-green-600 hover:text-green-700">
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Estadísticas de participación */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Participación general</span>
                  <span className="text-sm font-medium text-gray-900">
                    {votacion.participantes} / {votacion.totalElegibles} 
                    ({getParticipationRate(votacion.participantes, votacion.totalElegibles)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ 
                      width: `${getParticipationRate(votacion.participantes, votacion.totalElegibles)}%` 
                    }}
                  ></div>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-1" />
                  <span>{votacion.participantes} participantes</span>
                  <span className="mx-2">•</span>
                  <span>{votacion.tipo}</span>
                </div>

                <div className="flex gap-2">
                  {votacion.estado === 'abierta' && !votacion.hasParticipated && (
                    <Link 
                      href={`/user/votaciones/${votacion.id}`}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Vote className="w-4 h-4 mr-2" />
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
      {votacionesFiltradas.length === 0 && (
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
            {vistaActual === 'todas' && 'Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.'}
          </p>
          {vistaActual !== 'todas' && (
            <button
              onClick={() => setVistaActual('todas')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Ver todas las votaciones
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>
      )}

      {/* Call to Action para votaciones abiertas */}
      {vistaActual === 'todas' && votacionesAbiertas.filter(v => !v.hasParticipated).length > 0 && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                ¡Tienes {votacionesAbiertas.filter(v => !v.hasParticipated).length} votación{votacionesAbiertas.filter(v => !v.hasParticipated).length !== 1 ? 'es' : ''} pendiente{votacionesAbiertas.filter(v => !v.hasParticipated).length !== 1 ? 's' : ''}!
              </h3>
              <p className="text-blue-100">
                Tu voz es importante. Participa en las votaciones abiertas y contribuye a las decisiones de tu comunidad.
              </p>
            </div>
            <button
              onClick={() => setVistaActual('pendientes')}
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Vote className="w-5 h-5 mr-2" />
              Ver pendientes
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
