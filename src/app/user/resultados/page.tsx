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
  Filter
} from 'lucide-react';

interface ResultadoVotacion {
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
  hasParticipated: boolean;
}

const mockResultados: ResultadoVotacion[] = [
  {
    id: '1',
    titulo: 'Presupuesto participativo 2024',
    fechaFin: '2024-12-15',
    totalParticipantes: 2400,
    totalElegibles: 3200,
    estado: 'finalizada',
    hasParticipated: true,
    categoria: 'Municipal',
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
    hasParticipated: true,
    categoria: 'Representación',
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
    hasParticipated: false,
    categoria: 'Transporte',
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
    hasParticipated: true,
    categoria: 'Seguridad',
    opciones: [
      { nombre: 'Aumentar vigilancia policial', votos: 0, porcentaje: 0 },
      { nombre: 'Mejorar iluminación pública', votos: 0, porcentaje: 0 },
      { nombre: 'Cámaras de seguridad', votos: 0, porcentaje: 0 }
    ]
  }
];

export default function ResultadosPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [selectedVotacion, setSelectedVotacion] = useState<string | null>(null);

  const resultadosFiltrados = mockResultados.filter(resultado => {
    const matchSearch = resultado.titulo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filtroEstado === 'todas' || resultado.estado === filtroEstado;
    return matchSearch && matchEstado;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'finalizada':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Finalizada
          </span>
        );
      case 'en-conteo':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resultados de votaciones</h1>
          <p className="text-gray-600 mt-1">
            Consulta los resultados de votaciones finalizadas y en proceso
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </button>
        </div>
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todas</option>
              <option value="finalizada">Finalizadas</option>
              <option value="en-conteo">En conteo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Finalizadas</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockResultados.filter(r => r.estado === 'finalizada').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Participación promedio</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(mockResultados.reduce((acc, r) => acc + getParticipationRate(r.totalParticipantes, r.totalElegibles), 0) / mockResultados.length)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Mis participaciones</p>
              <p className="text-2xl font-bold text-gray-900">
                {mockResultados.filter(r => r.hasParticipated).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Lista de resultados */}
      <div className="space-y-6">
        {resultadosFiltrados.map((resultado) => (
          <div key={resultado.id} className="bg-white rounded-lg shadow">
            <div className="p-6">
              {/* Header del resultado */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                      {resultado.categoria}
                    </span>
                    {getEstadoBadge(resultado.estado)}
                    {resultado.hasParticipated && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                        Participaste
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {resultado.titulo}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Finalizada: {formatDate(resultado.fechaFin)}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      <span>
                        {resultado.totalParticipantes} / {resultado.totalElegibles} participantes
                        ({getParticipationRate(resultado.totalParticipantes, resultado.totalElegibles)}%)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedVotacion(selectedVotacion === resultado.id ? null : resultado.id)}
                    className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {selectedVotacion === resultado.id ? 'Ocultar' : 'Ver detalles'}
                  </button>
                  <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                    <Share2 className="w-4 h-4 mr-2" />
                    Compartir
                  </button>
                </div>
              </div>

              {/* Resultados detallados */}
              {selectedVotacion === resultado.id && resultado.estado === 'finalizada' && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Resultados detallados
                  </h4>
                  
                  <div className="space-y-4">
                    {resultado.opciones.map((opcion, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-900">{opcion.nombre}</span>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">{opcion.votos.toLocaleString()}</span> votos
                              <span className="ml-2 font-bold text-blue-600">({opcion.porcentaje}%)</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-blue-600 h-3 rounded-full transition-all"
                              style={{ width: `${opcion.porcentaje}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">Resumen de participación</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Total de votos:</span>
                        <p className="font-bold text-blue-900">{resultado.totalParticipantes.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-blue-700">Elegibles:</span>
                        <p className="font-bold text-blue-900">{resultado.totalElegibles.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-blue-700">Participación:</span>
                        <p className="font-bold text-blue-900">
                          {getParticipationRate(resultado.totalParticipantes, resultado.totalElegibles)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mensaje para votaciones en conteo */}
              {selectedVotacion === resultado.id && resultado.estado === 'en-conteo' && (
                <div className="border-t pt-6">
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">Conteo en proceso</h4>
                    <p className="text-gray-600">
                      Los resultados estarán disponibles una vez finalizado el proceso de conteo y verificación.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay resultados */}
      {resultadosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-500">
            Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
          </p>
        </div>
      )}
    </div>
  );
}
