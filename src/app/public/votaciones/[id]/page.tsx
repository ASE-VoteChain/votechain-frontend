'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  CheckCircle, 
  Vote,
  ArrowRight,
  BarChart3,
  AlertCircle,
  Shield,
  Eye,
  Download,
  Share2,
  ChevronLeft,
  MapPin,
  FileText,
  ExternalLink,
  User,
  LogIn,
  UserPlus
} from 'lucide-react';

interface DetalleVotacionPublica {
  id: string;
  titulo: string;
  descripcion: string;
  descripcionDetallada: string;
  fechaInicio: string;
  fechaFin: string;
  estado: 'abierta' | 'proxima' | 'cerrada';
  participantes: number;
  totalElegibles: number;
  categoria: string;
  tipo: string;
  ubicacion: string;
  organizador: string;
  opciones: { id: string; nombre: string; descripcion: string; votos?: number }[];
  documentos: { nombre: string; url: string; tipo: string }[];
  blockchain: {
    bloque: string;
    hash: string;
    timestamp: string;
  };
  requiereRegistro: boolean;
}

const mockDetalleVotacion: DetalleVotacionPublica = {
  id: '1',
  titulo: 'Elección de representante vecinal',
  descripcion: 'Esta votación busca elegir al representante vecinal que actuará como enlace entre la comunidad y las autoridades municipales durante el período 2025-2026.',
  descripcionDetallada: `La elección de representante vecinal es un proceso democrático fundamental para nuestra comunidad. El representante elegido será responsable de:

• Ser el enlace oficial entre los vecinos y las autoridades municipales
• Participar en reuniones del consejo municipal
• Representar los intereses y necesidades de la comunidad
• Coordinar proyectos de mejora comunitaria
• Facilitar la comunicación entre vecinos y gobierno local

El período de servicio será de 2 años (2025-2026) con posibilidad de reelección. El representante deberá presentar informes trimestrales sobre sus actividades y mantener canales de comunicación abiertos con la comunidad.`,
  fechaInicio: '2025-05-10',
  fechaFin: '2025-05-25',
  estado: 'abierta',
  participantes: 1650,
  totalElegibles: 2500,
  categoria: 'Representación',
  tipo: 'Elección de representante',
  ubicacion: 'Sector Norte - Barrio Las Flores',
  organizador: 'Junta de Acción Comunal - Sector Norte',
  requiereRegistro: true,
  opciones: [
    {
      id: '1',
      nombre: 'María González',
      descripcion: 'Licenciada en Trabajo Social con 10 años de experiencia en gestión comunitaria. Propone crear un comité de seguimiento a proyectos municipales.',
      votos: 580
    },
    {
      id: '2',
      nombre: 'Carlos Rodríguez',
      descripcion: 'Ingeniero Civil y actual miembro del comité de obras. Su propuesta se enfoca en la mejora de infraestructura y servicios públicos.',
      votos: 420
    },
    {
      id: '3',
      nombre: 'Ana Patricia López',
      descripcion: 'Educadora con experiencia en liderazgo juvenil. Propone programas de capacitación ciudadana y espacios de participación para jóvenes.',
      votos: 350
    },
    {
      id: '4',
      nombre: 'Voto en blanco',
      descripcion: 'Opción para expresar desacuerdo con los candidatos propuestos.',
      votos: 300
    }
  ],
  documentos: [
    {
      nombre: 'Reglamento de elección',
      url: '#',
      tipo: 'PDF'
    },
    {
      nombre: 'Propuestas de candidatos',
      url: '#',
      tipo: 'PDF'
    },
    {
      nombre: 'Cronograma electoral',
      url: '#',
      tipo: 'PDF'
    }
  ],
  blockchain: {
    bloque: '#125847',
    hash: '0x8f7d2a3b1c9e6f4a2d8b5c7e9f1a3d6b8c2e5f7a9b1d4c6e8f0a2b5c7d9e1f3a5',
    timestamp: '2025-05-10T09:00:00Z'
  }
};

export default function DetalleVotacionPublicaPage() {
  const [showBlockchainInfo, setShowBlockchainInfo] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const getParticipationRate = (participantes: number, total: number) => {
    return Math.round((participantes / total) * 100);
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

  const getDaysRemaining = (fechaFin: string) => {
    const today = new Date();
    const endDate = new Date(fechaFin);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalVotos = mockDetalleVotacion.opciones.reduce((acc, opcion) => acc + (opcion.votos || 0), 0);

  const handleVotarClick = () => {
    setShowLoginModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Navegación */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/public/votaciones" className="hover:text-gray-900 flex items-center">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Volver a votaciones
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                {mockDetalleVotacion.categoria}
              </span>
              {mockDetalleVotacion.estado === 'abierta' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Abierta
                </span>
              )}
              {mockDetalleVotacion.estado === 'abierta' && (
                <span className="text-sm text-orange-600 font-medium">
                  {getDaysRemaining(mockDetalleVotacion.fechaFin)} días restantes
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {mockDetalleVotacion.titulo}
            </h1>
            
            <p className="text-xl text-gray-600 mb-6 leading-relaxed">
              {mockDetalleVotacion.descripcion}
            </p>

            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">Período de votación</p>
                    <p className="text-sm">{formatDate(mockDetalleVotacion.fechaInicio)} - {formatDate(mockDetalleVotacion.fechaFin)}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">Ubicación</p>
                    <p className="text-sm">{mockDetalleVotacion.ubicacion}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <BarChart3 className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">Tipo de votación</p>
                    <p className="text-sm">{mockDetalleVotacion.tipo}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <User className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">Organizador</p>
                    <p className="text-sm">{mockDetalleVotacion.organizador}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel de acciones principales */}
          <div className="flex flex-col gap-3 lg:min-w-[280px] bg-gray-50 rounded-lg p-6">
            {mockDetalleVotacion.estado === 'abierta' && (
              <>
                <button
                  onClick={handleVotarClick}
                  className="inline-flex items-center justify-center px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
                >
                  <Vote className="w-6 h-6 mr-2" />
                  Emitir mi voto
                </button>
                <p className="text-sm text-gray-600 text-center bg-yellow-50 border border-yellow-200 rounded p-2">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  Requiere registro para votar
                </p>
              </>
            )}

            <div className="flex gap-2">
              <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="w-4 h-4 mr-2" />
                Compartir
              </button>
              <button className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </button>
            </div>

            <div className="bg-white rounded border p-4 mt-4">
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 mb-2">¿No tienes cuenta?</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Regístrate gratis para participar en las votaciones
                </p>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Crear cuenta
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contenido principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Descripción detallada */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Descripción detallada</h2>
            <div className="prose prose-gray max-w-none">
              <p className="whitespace-pre-line text-gray-600 leading-relaxed">
                {mockDetalleVotacion.descripcionDetallada}
              </p>
            </div>
          </div>

          {/* Opciones de votación */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Opciones disponibles</h2>
            <div className="space-y-4">
              {mockDetalleVotacion.opciones.map((opcion, index) => (
                <div key={opcion.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </span>
                        <h3 className="font-semibold text-gray-900">{opcion.nombre}</h3>
                      </div>
                      <p className="text-gray-600 leading-relaxed ml-11">
                        {opcion.descripcion}
                      </p>
                    </div>
                    
                    {opcion.votos !== undefined && (
                      <div className="ml-4 text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {opcion.votos}
                        </div>
                        <div className="text-sm text-gray-500">
                          {totalVotos > 0 ? Math.round((opcion.votos / totalVotos) * 100) : 0}%
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {opcion.votos !== undefined && totalVotos > 0 && (
                    <div className="mt-3 ml-11">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(opcion.votos / totalVotos) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Documentos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Documentos relacionados</h2>
            <div className="space-y-3">
              {mockDetalleVotacion.documentos.map((doc, index) => (
                <a
                  key={index}
                  href={doc.url}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{doc.nombre}</p>
                    <p className="text-sm text-gray-500">{doc.tipo}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Estadísticas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Estadísticas en tiempo real</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Participación</span>
                  <span className="text-sm font-bold text-gray-900">
                    {getParticipationRate(mockDetalleVotacion.participantes, mockDetalleVotacion.totalElegibles)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ 
                      width: `${getParticipationRate(mockDetalleVotacion.participantes, mockDetalleVotacion.totalElegibles)}%` 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{mockDetalleVotacion.participantes.toLocaleString()} han votado</span>
                  <span>{mockDetalleVotacion.totalElegibles.toLocaleString()} elegibles</span>
                </div>
              </div>

              {totalVotos > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Votos contabilizados</p>
                  <p className="text-2xl font-bold text-gray-900">{totalVotos.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información de blockchain */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-bold text-gray-900">Seguridad Blockchain</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Bloque</p>
                <p className="text-sm text-gray-900 font-mono">{mockDetalleVotacion.blockchain.bloque}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-600">Timestamp</p>
                <p className="text-sm text-gray-900">{formatDate(mockDetalleVotacion.blockchain.timestamp)}</p>
              </div>
              
              <button
                onClick={() => setShowBlockchainInfo(!showBlockchainInfo)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Eye className="w-4 h-4" />
                {showBlockchainInfo ? 'Ocultar hash' : 'Ver hash completo'}
              </button>
              
              {showBlockchainInfo && (
                <div className="mt-3 p-3 bg-gray-50 rounded border">
                  <p className="text-xs font-medium text-gray-600 mb-1">Hash del bloque</p>
                  <p className="text-xs text-gray-900 font-mono break-all">
                    {mockDetalleVotacion.blockchain.hash}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Acciones adicionales */}
          <div className="space-y-3">
            <Link
              href="/public/validar"
              className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Shield className="w-4 h-4 mr-2" />
              Validar votación
            </Link>
            
            {mockDetalleVotacion.estado === 'cerrada' && (
              <Link
                href={`/public/resultados/${mockDetalleVotacion.id}`}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Ver resultados completos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            )}
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
                Necesitas estar registrado y autenticado para participar en esta votación
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
