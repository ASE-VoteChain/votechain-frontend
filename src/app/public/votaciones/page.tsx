'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Users, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Filter, 
  Search, 
  Eye, 
  Vote,
  BarChart3,
  AlertCircle,
  User,
  LogIn,
  UserPlus,
  MapPin,
  FileText,
  Shield,
  RefreshCw
} from 'lucide-react';

interface VotacionPublica {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'abierta' | 'proxima' | 'cerrada';
  participantes: number;
  totalElegibles: number;
  categoria: string;
  tipo: string;
  ubicacion: string;
  organizador: string;
  requiereRegistro: boolean;
}

const mockVotaciones: VotacionPublica[] = [
  {
    id: '1',
    titulo: 'Elección de representante vecinal',
    descripcion: 'Esta votación busca elegir al representante vecinal que actuará como enlace entre la comunidad y las autoridades municipales durante el período 2025-2026.',
    fechaInicio: '2025-05-10',
    fechaFin: '2025-05-25',
    estado: 'abierta',
    participantes: 1650,
    totalElegibles: 2500,
    categoria: 'Representación',
    tipo: 'Elección de representante',
    ubicacion: 'Sector Norte - Barrio Las Flores',
    organizador: 'Junta de Acción Comunal',
    requiereRegistro: true
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
    categoria: 'Presupuesto',
    tipo: 'Asignación de presupuesto',
    ubicacion: 'Municipal - Toda la ciudad',
    organizador: 'Alcaldía Municipal',
    requiereRegistro: true
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
    categoria: 'Seguridad',
    tipo: 'Consulta ciudadana',
    ubicacion: 'Municipal - Toda la ciudad',
    organizador: 'Secretaría de Seguridad',
    requiereRegistro: true
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
    categoria: 'Transporte',
    tipo: 'Consulta pública',
    ubicacion: 'Municipal - Toda la ciudad',
    organizador: 'Secretaría de Movilidad',
    requiereRegistro: true
  }
];

export default function VotacionesPublicasPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [showLoginModal, setShowLoginModal] = useState(false);

  const votacionesFiltradas = mockVotaciones.filter(votacion => {
    const matchSearch = votacion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       votacion.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchEstado = filtroEstado === 'todas' || votacion.estado === filtroEstado;
    
    return matchSearch && matchEstado;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'abierta':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Abierta
          </span>
        );
      case 'proxima':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Clock className="w-4 h-4 mr-1" />
            Próxima
          </span>
        );
      case 'cerrada':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <XCircle className="w-4 h-4 mr-1" />
            Cerrada
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

  const getDaysRemaining = (fechaFin: string) => {
    const today = new Date();
    const endDate = new Date(fechaFin);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };  const handleVotarClick = () => {
    setShowLoginModal(true);
  };

  const handleVerDetalles = (votacionId: string) => {
    // Aquí navegaríamos a la página de detalles
    window.location.href = `/public/votaciones/${votacionId}`;
  };

  const handleVerResultados = (votacionId: string) => {
    // Aquí navegaríamos a la página de resultados
    window.location.href = `/public/resultados/${votacionId}`;
  };

  return (
    <div className="space-y-8">      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Votaciones Disponibles
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Consulta las votaciones activas, próximas y finalizadas. Participa en la democracia digital de tu comunidad.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </button>
          <Link
            href="/auth/login"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Iniciar sesión para votar
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar votaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todas</option>
              <option value="abierta">Abiertas</option>
              <option value="proxima">Próximas</option>
              <option value="cerrada">Cerradas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Abiertas</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockVotaciones.filter(v => v.estado === 'abierta').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Próximas</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockVotaciones.filter(v => v.estado === 'proxima').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gray-100 rounded-lg">
              <XCircle className="w-8 h-8 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cerradas</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockVotaciones.filter(v => v.estado === 'cerrada').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total votantes</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockVotaciones.reduce((acc, v) => acc + v.totalElegibles, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>      {/* Lista de votaciones */}
      <div className="space-y-6">
        {votacionesFiltradas.map((votacion) => (
          <div key={votacion.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
            <div className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {votacion.categoria}
                    </span>
                    {getEstadoBadge(votacion.estado)}
                    {votacion.estado === 'abierta' && (
                      <span className="text-sm text-orange-600 font-medium">
                        {getDaysRemaining(votacion.fechaFin)} días restantes
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {votacion.titulo}
                  </h3>
                  
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {votacion.descripcion}
                  </p>

                  {/* Información adicional */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-5 h-5 mr-2" />
                      <div>
                        <p className="text-xs font-medium">Fecha de inicio</p>
                        <p className="text-sm">{formatDate(votacion.fechaInicio)}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-5 h-5 mr-2" />
                      <div>
                        <p className="text-xs font-medium">Fecha de cierre</p>
                        <p className="text-sm">{formatDate(votacion.fechaFin)}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <BarChart3 className="w-5 h-5 mr-2" />
                      <div>
                        <p className="text-xs font-medium">Tipo de votación</p>
                        <p className="text-sm">{votacion.tipo}</p>
                      </div>
                    </div>
                  </div>

                  {/* Información del organizador y ubicación */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center text-gray-500">
                      <User className="w-5 h-5 mr-2" />
                      <div>
                        <p className="text-xs font-medium">Organizador</p>
                        <p className="text-sm">{votacion.organizador}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-5 h-5 mr-2" />
                      <div>
                        <p className="text-xs font-medium">Ubicación</p>
                        <p className="text-sm">{votacion.ubicacion}</p>
                      </div>
                    </div>
                  </div>

                  {/* Estadísticas de participación */}
                  {votacion.estado !== 'proxima' && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-600">Participación actual</span>
                        <span className="text-sm font-bold text-gray-900">
                          {votacion.participantes.toLocaleString()} / {votacion.totalElegibles.toLocaleString()} 
                          ({getParticipationRate(votacion.participantes, votacion.totalElegibles)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{ 
                            width: `${getParticipationRate(votacion.participantes, votacion.totalElegibles)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Panel de acciones */}
                <div className="flex flex-col gap-3 lg:ml-6 lg:min-w-[220px] border-l border-gray-200 pl-6">
                  {votacion.estado === 'abierta' && (
                    <>                      <button 
                        onClick={() => handleVotarClick()}
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Vote className="w-5 h-5 mr-2" />
                        Emitir voto
                      </button>
                      <button 
                        onClick={() => handleVerDetalles(votacion.id)}
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        Ver detalles
                      </button>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Shield className="w-4 h-4 text-green-600" />
                          <span className="text-sm font-medium text-green-900">Voto seguro</span>
                        </div>
                        <p className="text-xs text-green-700">
                          Tu voto es anónimo y se registra en blockchain
                        </p>
                      </div>
                    </>
                  )}

                  {votacion.estado === 'proxima' && (
                    <>
                      <button className="inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg cursor-not-allowed">
                        <Clock className="w-5 h-5 mr-2" />
                        Próximamente
                      </button>
                      <button 
                        onClick={() => handleVerDetalles(votacion.id)}
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        Ver detalles
                      </button>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">Próximamente</span>
                        </div>
                        <p className="text-xs text-blue-700">
                          Regístrate para recibir notificaciones
                        </p>
                      </div>
                    </>
                  )}

                  {votacion.estado === 'cerrada' && (
                    <>
                      <button 
                        onClick={() => handleVerResultados(votacion.id)}
                        className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <BarChart3 className="w-5 h-5 mr-2" />
                        Ver resultados
                      </button>
                      <button 
                        onClick={() => handleVerDetalles(votacion.id)}
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        Ver detalles
                      </button>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-gray-600" />
                          <span className="text-sm font-medium text-gray-900">Votación finalizada</span>
                        </div>
                        <p className="text-xs text-gray-600">
                          Consulta los resultados oficiales
                        </p>
                      </div>
                    </>
                  )}

                  <div className="text-center text-sm text-gray-500 mt-2 pt-3 border-t border-gray-200">
                    <Users className="w-4 h-4 inline mr-1" />
                    {votacion.participantes.toLocaleString()} participantes
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {votacionesFiltradas.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No se encontraron votaciones
          </h3>
          <p className="text-gray-500">
            Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
          </p>
        </div>
      )}      {/* Botón para cargar más */}
      {votacionesFiltradas.length > 0 && (
        <div className="text-center">
          <button className="inline-flex items-center px-6 py-3 border border-gray-300 bg-white text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
            Cargar más votaciones
          </button>
        </div>
      )}

      {/* Call to action mejorado */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">
          ¿Quieres participar en las votaciones?
        </h3>
        <p className="text-blue-100 mb-6 text-lg">
          Únete a VoteChain y forma parte de la democracia digital de tu comunidad. 
          Tu voz importa y tu voto cuenta.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/auth/register"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Registrarse gratis
          </Link>
          <Link
            href="/auth/login"
            className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
          >
            <LogIn className="w-5 h-5 mr-2" />
            Iniciar sesión
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-blue-500">
          <div className="text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-blue-200" />
            <h4 className="font-semibold mb-1">Voto seguro</h4>
            <p className="text-sm text-blue-200">Protegido por blockchain</p>
          </div>
          <div className="text-center">
            <Eye className="w-8 h-8 mx-auto mb-2 text-blue-200" />
            <h4 className="font-semibold mb-1">Transparente</h4>
            <p className="text-sm text-blue-200">Resultados verificables</p>
          </div>
          <div className="text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-200" />
            <h4 className="font-semibold mb-1">Democrático</h4>
            <p className="text-sm text-blue-200">Cada voto cuenta igual</p>
          </div>
        </div>
      </div>

      {/* Modal de login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Vote className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Inicia sesión para votar
              </h3>
              <p className="text-gray-600">
                Necesitas estar registrado y autenticado para participar en las votaciones
              </p>
            </div>

            <div className="space-y-3">
              <Link
                href="/auth/login"
                className="w-full inline-flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Iniciar sesión
              </Link>
              
              <Link
                href="/auth/register"
                className="w-full inline-flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Crear cuenta nueva
              </Link>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full text-center text-gray-500 hover:text-gray-700 text-sm"
              >
                Continuar sin votar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
