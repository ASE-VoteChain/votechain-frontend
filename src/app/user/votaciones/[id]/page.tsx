'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
  Lock
} from 'lucide-react';

interface Candidato {
  id: string;
  nombre: string;
  partido?: string;
  propuesta: string;
  imagen?: string;
  descripcionCompleta?: string;
}

interface VotacionDetalle {
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
  candidatos: Candidato[];
  instrucciones?: string;
  documentos?: Array<{ nombre: string; url: string }>;
  requisitosPrevios?: string[];
}

// Mock data - en producción vendría de API
const mockVotacionesDetalle: Record<string, VotacionDetalle> = {
  '1': {
    id: '1',
    titulo: 'Representante vecinal 2025',
    descripcion: 'Esta votación busca elegir al representante vecinal que actuará como enlace entre la comunidad y las autoridades municipales durante el período 2025-2026.',
    fechaInicio: '2025-05-10',
    fechaFin: '2025-05-25',
    estado: 'abierta',
    participantes: 156,
    totalElegibles: 240,
    hasParticipated: false,
    categoria: 'Representación',
    tipo: 'Elección de representante',
    ubicacion: 'Barrio Centro',
    organizador: 'Municipio de ejemplo',
    candidatos: [
      {
        id: 'c1',
        nombre: 'Rosa Pérez',
        partido: 'Independiente',
        propuesta: 'Mejora de espacios públicos y seguridad comunitaria',
        descripcionCompleta: 'Propone crear un plan integral de mejoramiento de plazas y parques, además de implementar un sistema de vigilancia comunitaria colaborativo.'
      },
      {
        id: 'c2',
        nombre: 'Juan Torres',
        partido: 'Partido Vecinal',
        propuesta: 'Programas sociales y desarrollo comunitario',
        descripcionCompleta: 'Enfoque en programas de apoyo a familias vulnerables, talleres de capacitación laboral y actividades recreativas para jóvenes.'
      },
      {
        id: 'c3',
        nombre: 'Lidia Flores',
        partido: 'Movimiento Ciudadano',
        propuesta: 'Transparencia en gestión y participación vecinal',
        descripcionCompleta: 'Implementación de un sistema de rendición de cuentas periódica y creación de asambleas vecinales mensuales para toma de decisiones.'
      }
    ],
    instrucciones: 'Seleccione únicamente un candidato. Su voto es secreto y no podrá ser modificado una vez confirmado.',
    requisitosPrevios: [
      'Estar registrado como residente del barrio',
      'Tener 18 años o más',
      'No tener procesos judiciales pendientes relacionados con la comunidad'
    ]
  },
  '2': {
    id: '2',
    titulo: 'Presupuesto participativo 2025',
    descripcion: 'Decisión sobre la asignación de fondos municipales para proyectos comunitarios prioritarios en el próximo año fiscal.',
    fechaInicio: '2025-05-15',
    fechaFin: '2025-05-30',
    estado: 'abierta',
    participantes: 89,
    totalElegibles: 240,
    hasParticipated: false,
    categoria: 'Presupuesto',
    tipo: 'Presupuesto participativo',
    ubicacion: 'Todo el distrito',
    organizador: 'Municipio de ejemplo',
    candidatos: [
      {
        id: 'p1',
        nombre: 'Mejoramiento del parque central',
        propuesta: 'Renovación completa de juegos infantiles, instalación de nueva iluminación LED y construcción de pista para correr',
        descripcionCompleta: 'Proyecto integral que incluye renovación de equipamiento, mejoramiento de áreas verdes, instalación de gimnasio al aire libre y mejoramiento de seguridad. Presupuesto estimado: $50,000'
      },
      {
        id: 'p2',
        nombre: 'Sistema de cámaras de seguridad',
        propuesta: 'Instalación de circuito cerrado de televisión en puntos estratégicos del barrio',
        descripcionCompleta: 'Red de 15 cámaras de alta definición con monitoreo 24/7, sistema de grabación por 30 días y centro de monitoreo comunitario. Presupuesto estimado: $45,000'
      },
      {
        id: 'p3',
        nombre: 'Centro comunitario digital',
        propuesta: 'Creación de espacio con computadores y acceso a internet gratuito para la comunidad',
        descripcionCompleta: 'Espacio equipado con 10 computadores, impresora, proyector, aula de capacitación y conexión de fibra óptica. Incluye programas de alfabetización digital. Presupuesto estimado: $40,000'
      }
    ],
    instrucciones: 'Seleccione el proyecto que considera más prioritario para la comunidad. Solo se ejecutará el proyecto ganador.',
    requisitosPrevios: [
      'Residir en el distrito por al menos 6 meses',
      'Estar al día con los pagos municipales',
      'Participar en al menos una asamblea informativa'
    ]
  }
};

export default function VotarPage() {
  const router = useRouter();
  const params = useParams();
  const [votacionDetalle, setVotacionDetalle] = useState<VotacionDetalle | null>(null);
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState<string>('');
  const [paso, setPaso] = useState<'informacion' | 'votacion' | 'confirmacion'>('informacion');
  const [mostrandoDetalles, setMostrandoDetalles] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarVotacion = async () => {
      setLoading(true);
      try {
        // Simular carga de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        const id = params.id as string;
        const votacion = mockVotacionesDetalle[id];
        
        if (!votacion) {
          router.push('/user/votaciones');
          return;
        }
        
        setVotacionDetalle(votacion);
      } catch (error) {
        console.error('Error cargando votación:', error);
        router.push('/user/votaciones');
      } finally {
        setLoading(false);
      }
    };

    cargarVotacion();
  }, [params.id, router]);

  const handleContinuar = () => {
    if (paso === 'informacion') {
      setPaso('votacion');
    } else if (paso === 'votacion' && candidatoSeleccionado) {
      setPaso('confirmacion');
    }
  };

  const handleVolver = () => {
    if (paso === 'confirmacion') {
      setPaso('votacion');
    } else if (paso === 'votacion') {
      setPaso('informacion');
    } else {
      router.push('/user/votaciones');
    }
  };

  const handleConfirmarVoto = async () => {
    try {
      // Simular envío de voto
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirigir a confirmación
      router.push(`/user/votaciones/${params.id}/confirmacion`);
    } catch (error) {
      console.error('Error al emitir voto:', error);
      // Aquí manejarías el error
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando votación...</p>
        </div>
      </div>
    );
  }

  if (!votacionDetalle) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Votación no encontrada</h2>
        <p className="text-gray-600 mb-6">La votación que buscas no existe o no está disponible.</p>
        <button
          onClick={() => router.push('/user/votaciones')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Volver a votaciones
        </button>
      </div>
    );
  }

  const porcentajeParticipacion = Math.round((votacionDetalle.participantes / votacionDetalle.totalElegibles) * 100);
  const candidatoSeleccionadoData = votacionDetalle.candidatos.find(c => c.id === candidatoSeleccionado);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header con navegación */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleVolver}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {paso === 'informacion' ? 'Volver a votaciones' : 'Volver'}
        </button>
        
        {/* Indicador de pasos */}
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${paso === 'informacion' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-1 rounded ${['votacion', 'confirmacion'].includes(paso) ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`w-3 h-3 rounded-full ${paso === 'votacion' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-1 rounded ${paso === 'confirmacion' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
          <div className={`w-3 h-3 rounded-full ${paso === 'confirmacion' ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
        </div>
      </div>

      {/* Información de la votación */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{votacionDetalle.titulo}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Hasta: {new Date(votacionDetalle.fechaFin).toLocaleDateString('es-ES', { 
                  year: 'numeric', month: 'long', day: 'numeric' 
                })}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {votacionDetalle.ubicacion}
              </div>
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {votacionDetalle.organizador}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              votacionDetalle.estado === 'abierta' 
                ? 'bg-green-100 text-green-800' 
                : votacionDetalle.estado === 'proxima'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {votacionDetalle.estado === 'abierta' && <CheckCircle className="w-4 h-4 mr-1" />}
              {votacionDetalle.estado === 'proxima' && <Clock className="w-4 h-4 mr-1" />}
              {votacionDetalle.estado.charAt(0).toUpperCase() + votacionDetalle.estado.slice(1)}
            </div>
            <div className="mt-2 flex items-center text-sm text-gray-600">
              <Users className="w-4 h-4 mr-1" />
              {votacionDetalle.participantes}/{votacionDetalle.totalElegibles} ({porcentajeParticipacion}%)
            </div>
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed">{votacionDetalle.descripcion}</p>
      </div>

      {/* Contenido según el paso */}
      {paso === 'informacion' && (
        <div className="space-y-6">
          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Instrucciones de votación</h3>
                <p className="text-blue-800">{votacionDetalle.instrucciones}</p>
              </div>
            </div>
          </div>

          {/* Requisitos previos */}
          {votacionDetalle.requisitosPrevios && votacionDetalle.requisitosPrevios.length > 0 && (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Requisitos para votar
              </h3>
              <ul className="space-y-2">
                {votacionDetalle.requisitosPrevios.map((requisito, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requisito}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Vista previa de opciones */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {votacionDetalle.tipo === 'Presupuesto participativo' ? 'Proyectos disponibles' : 'Candidatos'}
            </h3>
            <div className="grid gap-4">
              {votacionDetalle.candidatos.map((candidato) => (
                <div key={candidato.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{candidato.nombre}</h4>
                      {candidato.partido && (
                        <p className="text-sm text-gray-600 mt-1">{candidato.partido}</p>
                      )}
                      <p className="text-gray-700 mt-2">{candidato.propuesta}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Seguridad y transparencia */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Lock className="w-5 h-5 mr-2" />
              Seguridad y transparencia
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🔒 Tu voto es seguro</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Encriptación extremo a extremo</li>
                  <li>• Anonimato garantizado</li>
                  <li>• Registro inmutable en blockchain</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">🔍 Transparencia total</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Resultados públicos verificables</li>
                  <li>• Auditoría independiente</li>
                  <li>• Trazabilidad completa del proceso</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleContinuar}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
            >
              Continuar a votar
              <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Paso de votación */}
      {paso === 'votacion' && (
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">Importante</h3>
                <p className="text-yellow-800">Su voto es anónimo y seguro. Una vez emitido, no podrá ser modificado.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Seleccione {votacionDetalle.tipo === 'Presupuesto participativo' ? 'un proyecto' : 'un candidato'}:
            </h3>
            
            <div className="space-y-4">
              {votacionDetalle.candidatos.map((candidato) => (
                <div key={candidato.id}>
                  <label 
                    className={`block border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      candidatoSeleccionado === candidato.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="candidato"
                        value={candidato.id}
                        checked={candidatoSeleccionado === candidato.id}
                        onChange={(e) => setCandidatoSeleccionado(e.target.value)}
                        className="mt-1 mr-4 w-5 h-5 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{candidato.nombre}</h4>
                          {candidato.partido && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                              {candidato.partido}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-700 mb-3">{candidato.propuesta}</p>
                        
                        {candidato.descripcionCompleta && (
                          <>
                            <button
                              type="button"
                              onClick={() => setMostrandoDetalles(
                                mostrandoDetalles === candidato.id ? '' : candidato.id
                              )}
                              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              {mostrandoDetalles === candidato.id ? 'Ocultar detalles' : 'Ver detalles completos'}
                            </button>
                            
                            {mostrandoDetalles === candidato.id && (
                              <div className="mt-3 p-3 bg-gray-50 rounded border">
                                <p className="text-sm text-gray-700">{candidato.descripcionCompleta}</p>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleVolver}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Volver
            </button>
            <button
              onClick={handleContinuar}
              disabled={!candidatoSeleccionado}
              className={`px-6 py-3 rounded-lg transition-colors flex items-center ${
                candidatoSeleccionado
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Continuar
              <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* Paso de confirmación */}
      {paso === 'confirmacion' && candidatoSeleccionadoData && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Confirmar mi voto</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h4 className="font-semibold text-blue-900 mb-2">Has seleccionado:</h4>
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h5 className="text-lg font-medium text-gray-900">{candidatoSeleccionadoData.nombre}</h5>
                {candidatoSeleccionadoData.partido && (
                  <p className="text-blue-600 text-sm font-medium mt-1">{candidatoSeleccionadoData.partido}</p>
                )}
                <p className="text-gray-700 mt-2">{candidatoSeleccionadoData.propuesta}</p>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-red-900 mb-1">Último aviso</h4>
                  <p className="text-red-800">Una vez confirmado tu voto, no podrás cambiarlo. Verifica que tu selección sea correcta.</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
              <div>
                <strong>Votación:</strong> {votacionDetalle.titulo}
              </div>
              <div>
                <strong>Fecha:</strong> {new Date().toLocaleDateString('es-ES')}
              </div>
              <div>
                <strong>Categoría:</strong> {votacionDetalle.categoria}
              </div>
              <div>
                <strong>Tipo:</strong> {votacionDetalle.tipo}
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={handleVolver}
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Volver a selección
            </button>
            <button
              onClick={handleConfirmarVoto}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors flex items-center font-medium"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Confirmar mi voto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
