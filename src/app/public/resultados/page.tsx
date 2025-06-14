'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Calendar,
  Download,
  Share2,
  Eye,
  CheckCircle,
  Clock,
  Search,
  Filter,
  ExternalLink,
  PieChart
} from 'lucide-react';

interface ResultadoPublico {
  id: string;
  titulo: string;
  fechaFin: string;
  totalParticipantes: number;
  totalElegibles: number;
  estado: 'finalizada' | 'en-conteo';
  opciones: {
    nombre: string;
    votos: number;
    porcentaje: number;
  }[];
  categoria: string;
  hashVerificacion: string;
}

const mockResultados: ResultadoPublico[] = [
  {
    id: '1',
    titulo: 'Presupuesto participativo 2024',
    fechaFin: '2024-12-15',
    totalParticipantes: 2400,
    totalElegibles: 3200,
    estado: 'finalizada',
    categoria: 'Municipal',
    hashVerificacion: 'd38b71a91cb8f07eb189ea0a2b9ebc81a0d57c577d07b28e59ec9aba25c3782e',
    opciones: [
      { nombre: 'Mejora de espacios públicos', votos: 960, porcentaje: 40 },
      { nombre: 'Infraestructura deportiva', votos: 720, porcentaje: 30 },
      { nombre: 'Programas educativos', votos: 480, porcentaje: 20 },
      { nombre: 'Seguridad ciudadana', votos: 240, porcentaje: 10 }
    ]
  },
  {
    id: '2',
    titulo: 'Representante vecinal sector norte',
    fechaFin: '2024-11-30',
    totalParticipantes: 1850,
    totalElegibles: 2500,
    estado: 'finalizada',
    categoria: 'Representación',
    hashVerificacion: '35f8d7e59a86c45c9f5a3fe12fe32677b8f95453c621f4a46481ef9b5932b8a7',
    opciones: [
      { nombre: 'María González', votos: 925, porcentaje: 50 },
      { nombre: 'Carlos Rodríguez', votos: 555, porcentaje: 30 },
      { nombre: 'Ana López', votos: 370, porcentaje: 20 }
    ]
  },
  {
    id: '3',
    titulo: 'Consulta sobre transporte público',
    fechaFin: '2024-10-20',
    totalParticipantes: 3100,
    totalElegibles: 4500,
    estado: 'finalizada',
    categoria: 'Transporte',
    hashVerificacion: 'a2f6e45c1b93d7f8e091c5d6b3fc8427e5a91d06c85b74e80f2a651d67e4fd30',
    opciones: [
      { nombre: 'Ampliar líneas de autobús', votos: 1550, porcentaje: 50 },
      { nombre: 'Mejorar frecuencias', votos: 930, porcentaje: 30 },
      { nombre: 'Implementar ciclovías', votos: 620, porcentaje: 20 }
    ]
  },
  {
    id: '4',
    titulo: 'Consulta de seguridad ciudadana',
    fechaFin: '2025-01-25',
    totalParticipantes: 2100,
    totalElegibles: 4000,
    estado: 'en-conteo',
    categoria: 'Seguridad',
    hashVerificacion: '',
    opciones: []
  }
];

export default function ResultadosPublicosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [selectedResultado, setSelectedResultado] = useState<string | null>(null);

  const resultadosFiltrados = mockResultados.filter(resultado => {
    const matchSearch = resultado.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filtroEstado === 'todas' || resultado.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'finalizada':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Finalizada
          </span>
        );
      case 'en-conteo':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4 mr-1" />
            En conteo
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

  const getColorForOption = (index: number) => {
    const colors = ['bg-blue-600', 'bg-green-600', 'bg-purple-600', 'bg-yellow-600', 'bg-red-600'];
    return colors[index % colors.length];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Resultados de Votaciones
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Consulta los resultados oficiales de todas las votaciones finalizadas. 
          Información verificable y transparente para toda la comunidad.
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar resultados..."
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
              <option value="finalizada">Finalizadas</option>
              <option value="en-conteo">En conteo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Finalizadas</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockResultados.filter(r => r.estado === 'finalizada').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total votantes</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockResultados
                  .filter(r => r.estado === 'finalizada')
                  .reduce((acc, r) => acc + r.totalParticipantes, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Participación media</p>
              <p className="text-3xl font-bold text-gray-900">
                {Math.round(
                  mockResultados
                    .filter(r => r.estado === 'finalizada')
                    .reduce((acc, r) => acc + getParticipationRate(r.totalParticipantes, r.totalElegibles), 0) /
                  mockResultados.filter(r => r.estado === 'finalizada').length
                )}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <BarChart3 className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En proceso</p>
              <p className="text-3xl font-bold text-gray-900">
                {mockResultados.filter(r => r.estado === 'en-conteo').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de resultados */}
      <div className="space-y-6">
        {resultadosFiltrados.map((resultado) => (
          <div key={resultado.id} className="bg-white rounded-lg shadow-lg">
            <div className="p-8">
              {/* Header del resultado */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                      {resultado.categoria}
                    </span>
                    {getEstadoBadge(resultado.estado)}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {resultado.titulo}
                  </h3>
                  
                  <div className="flex items-center gap-6 text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span>Finalizada: {formatDate(resultado.fechaFin)}</span>
                    </div>
                    {resultado.estado === 'finalizada' && (
                      <div className="flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        <span>
                          {resultado.totalParticipantes.toLocaleString()} / {resultado.totalElegibles.toLocaleString()} participantes
                          ({getParticipationRate(resultado.totalParticipantes, resultado.totalElegibles)}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedResultado(selectedResultado === resultado.id ? null : resultado.id)}
                    className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Eye className="w-5 h-5 mr-2" />
                    {selectedResultado === resultado.id ? 'Ocultar' : 'Ver detalles'}
                  </button>
                  
                  {resultado.estado === 'finalizada' && (
                    <>
                      <button className="inline-flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Download className="w-5 h-5 mr-2" />
                        Descargar
                      </button>
                      <button className="inline-flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Resultados detallados */}
              {selectedResultado === resultado.id && (
                <div className="border-t pt-8">
                  {resultado.estado === 'finalizada' ? (
                    <>
                      <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                        <BarChart3 className="w-6 h-6 mr-2" />
                        Resultados oficiales
                      </h4>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Gráfico de barras */}
                        <div>
                          <h5 className="text-lg font-semibold text-gray-900 mb-4">Distribución de votos</h5>
                          <div className="space-y-4">
                            {resultado.opciones.map((opcion, index) => (
                              <div key={index} className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="font-medium text-gray-900">{opcion.nombre}</span>
                                  <div className="text-sm text-gray-600">
                                    <span className="font-bold">{opcion.votos.toLocaleString()}</span> votos
                                    <span className="ml-2 font-bold text-blue-600">({opcion.porcentaje}%)</span>
                                  </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                  <div
                                    className={`${getColorForOption(index)} h-4 rounded-full transition-all flex items-center justify-end pr-2`}
                                    style={{ width: `${opcion.porcentaje}%` }}
                                  >
                                    <span className="text-white text-xs font-medium">
                                      {opcion.porcentaje > 15 ? `${opcion.porcentaje}%` : ''}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Gráfico circular placeholder */}
                        <div>
                          <h5 className="text-lg font-semibold text-gray-900 mb-4">Visualización circular</h5>
                          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                            <div className="text-center text-gray-500">
                              <PieChart className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                              <p className="font-medium">Gráfico circular</p>
                              <p className="text-sm">Distribución visual de resultados</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Resumen y verificación */}
                      <div className="bg-blue-50 rounded-lg p-6">
                        <h5 className="font-bold text-blue-900 mb-4">Resumen de participación y verificación</h5>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                          <div>
                            <span className="text-blue-700 text-sm">Total de votos:</span>
                            <p className="font-bold text-blue-900 text-lg">{resultado.totalParticipantes.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-blue-700 text-sm">Elegibles:</span>
                            <p className="font-bold text-blue-900 text-lg">{resultado.totalElegibles.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-blue-700 text-sm">Participación:</span>
                            <p className="font-bold text-blue-900 text-lg">
                              {getParticipationRate(resultado.totalParticipantes, resultado.totalElegibles)}%
                            </p>
                          </div>
                        </div>
                        
                        {resultado.hashVerificacion && (
                          <div className="border-t border-blue-200 pt-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-blue-700 text-sm">Hash de verificación:</span>
                                <p className="font-mono text-xs text-blue-800 break-all">
                                  {resultado.hashVerificacion}
                                </p>
                              </div>
                              <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Validar
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-gray-900 mb-2">Conteo en proceso</h4>
                      <p className="text-gray-600">
                        Los resultados estarán disponibles una vez finalizado el proceso de conteo y verificación.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {resultadosFiltrados.length === 0 && (
        <div className="text-center py-16">
          <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-500">
            Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
          </p>
        </div>
      )}

      {/* Transparencia footer */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Resultados 100% Verificables
        </h3>
        <p className="text-gray-600 text-lg mb-6 max-w-3xl mx-auto">
          Todos los resultados mostrados son verificables públicamente a través de la blockchain. 
          Cada votación cuenta con un hash único que garantiza la integridad de los datos.
        </p>
        <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          <ExternalLink className="w-5 h-5 mr-2" />
          Aprender sobre verificación
        </button>
      </div>
    </div>
  );
}
