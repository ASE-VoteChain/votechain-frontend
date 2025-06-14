'use client';

import { useState } from 'react';
import { Search, Filter, Clock, CheckCircle, XCircle, ExternalLink, Info } from 'lucide-react';

interface HistorialVotacion {
  id: string;
  titulo: string;
  fecha: string;
  estado: 'emitida' | 'no-participo' | 'verificada';
  opcionSeleccionada?: string;
  hashVerificacion?: string;
}

const mockHistorial: HistorialVotacion[] = [
  {
    id: '1',
    titulo: 'Presupuesto participativo 2025',
    fecha: '12 mayo 2025',
    estado: 'verificada',
    opcionSeleccionada: 'Mejora de espacios públicos',
    hashVerificacion: 'c5a73bd8f2f78e0d412c331e937cab42e14aa57edfe9ce542f8a2e2b6c7a8fc3'
  },
  {
    id: '2',
    titulo: 'Consulta ciudadana sobre seguridad',
    fecha: '08 marzo 2025',
    estado: 'verificada',
    opcionSeleccionada: 'Aumentar vigilancia policial',
    hashVerificacion: 'e937b39d87fe5d4281a1784fce31b5dd1f86cd88fc7f952fb003bb7140af2362'
  },
  {
    id: '3',
    titulo: 'Representante vecinal 2024',
    fecha: '20 noviembre 2024',
    estado: 'no-participo'
  },
  {
    id: '4',
    titulo: 'Representante vecinal 2025',
    fecha: '12 mayo 2025',
    estado: 'verificada',
    opcionSeleccionada: 'María González',
    hashVerificacion: '35f8d7e59a86c45c9f5a3fe12fe32677b8f95453c621f4a46481ef9b5932b8a7'
  },
  {
    id: '5',
    titulo: 'Presupuesto participativo 2024',
    fecha: '10 diciembre 2024',
    estado: 'verificada',
    opcionSeleccionada: 'Mejora de espacios públicos',
    hashVerificacion: 'd38b71a91cb8f07eb189ea0a2b9ebc81a0d57c577d07b28e59ec9aba25c3782e'
  }
];

export default function HistorialPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  const historialFiltrado = mockHistorial.filter(votacion => {
    const matchSearch = votacion.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       votacion.fecha.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchFilter = filtroEstado === 'todos' || 
                       (filtroEstado === 'participadas' && votacion.estado !== 'no-participo') ||
                       (filtroEstado === 'no-participadas' && votacion.estado === 'no-participo');
    
    return matchSearch && matchFilter;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'verificada':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Verificado
        </span>;
      case 'emitida':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <Clock className="w-3 h-3 mr-1" />
          Emitida
        </span>;
      case 'no-participo':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          No participó
        </span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Historial completo de participación
        </h1>
        <p className="text-gray-600">
          Revisa todas tus participaciones en votaciones y verifica su integridad
        </p>
      </div>

      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, fecha..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600">Filtrar por:</span>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos</option>
              <option value="participadas">Participadas</option>
              <option value="no-participadas">No participadas</option>
            </select>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Info className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-blue-800">
              Has participado en <strong>{mockHistorial.filter(v => v.estado !== 'no-participo').length}</strong> votaciones hasta el momento.
            </span>
          </div>
        </div>
      </div>

      {/* Lista de votaciones */}
      <div className="space-y-4">
        {historialFiltrado.map((votacion) => (
          <div key={votacion.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {votacion.titulo}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Fecha de participación:</span>
                      <p className="font-medium text-gray-900">{votacion.fecha}</p>
                    </div>
                    
                    <div>
                      <span className="text-gray-500">Estado:</span>
                      <div className="mt-1">
                        {getEstadoBadge(votacion.estado)}
                      </div>
                    </div>
                    
                    {votacion.opcionSeleccionada && (
                      <div>
                        <span className="text-gray-500">Opción seleccionada:</span>
                        <p className="font-medium text-gray-900">{votacion.opcionSeleccionada}</p>
                      </div>
                    )}
                  </div>

                  {votacion.hashVerificacion && (
                    <div className="mt-4">
                      <span className="text-gray-500 text-sm">Código de verificación:</span>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg border">
                        <code className="text-xs text-gray-700 break-all font-mono">
                          {votacion.hashVerificacion}
                        </code>
                      </div>
                    </div>
                  )}
                </div>

                {votacion.hashVerificacion && (
                  <div className="lg:ml-4">
                    <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Verificar integridad
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {historialFiltrado.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-500">
            Intenta ajustar los filtros de búsqueda para encontrar lo que buscas.
          </p>
        </div>
      )}

      {/* Botón cargar más */}
      {historialFiltrado.length > 0 && (
        <div className="text-center">
          <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Cargar más resultados
          </button>
        </div>
      )}
    </div>
  );
}
