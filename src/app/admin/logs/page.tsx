'use client';

import { useState } from 'react';
import { 
  Search, 
  Download, 
  RefreshCw, 
  User,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Eye
} from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  usuario: string;
  accion: string;
  recurso: string;
  estado: 'exito' | 'error' | 'advertencia' | 'info';
  ip: string;
  detalles?: string;
  metadata?: Record<string, string | number | boolean | string[]>;
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2025-06-12T10:32:15Z',
    usuario: 'votante_32',
    accion: 'Emitió voto',
    recurso: 'Presupuesto participativo 2025',
    estado: 'exito',
    ip: '192.168.1.45',
    detalles: 'Voto registrado exitosamente en blockchain',
    metadata: { transactionHash: '0x8f7d2a3b1c9e6f4a2d8b5c7e9f1a3d6b' }
  },
  {
    id: '2',
    timestamp: '2025-06-12T10:28:43Z',
    usuario: 'admin',
    accion: 'Modificó votación',
    recurso: 'Elección vecinal 2025',
    estado: 'exito',
    ip: '192.168.1.10',
    detalles: 'Actualizada fecha de cierre',
    metadata: { cambios: ['fechaCierre'] }
  },
  {
    id: '3',
    timestamp: '2025-06-12T09:47:22Z',
    usuario: 'votante_18',
    accion: 'Emitió voto',
    recurso: 'Presupuesto participativo 2025',
    estado: 'exito',
    ip: '192.168.1.78',
    detalles: 'Voto registrado exitosamente',
    metadata: { transactionHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d' }
  },
  {
    id: '4',
    timestamp: '2025-06-11T18:32:10Z',
    usuario: 'sistema',
    accion: 'Backup automático',
    recurso: 'Base de datos',
    estado: 'exito',
    ip: '127.0.0.1',
    detalles: 'Backup completo realizado exitosamente',
    metadata: { tamano: '2.3GB', duracion: '15min' }
  },
  {
    id: '5',
    timestamp: '2025-06-11T15:12:35Z',
    usuario: 'votante_45',
    accion: 'Intento de acceso',
    recurso: 'Panel de administración',
    estado: 'error',
    ip: '192.168.1.99',
    detalles: 'Acceso denegado - permisos insuficientes',
    metadata: { intentos: 3 }
  },
  {
    id: '6',
    timestamp: '2025-06-11T14:05:18Z',
    usuario: 'admin',
    accion: 'Creó votación',
    recurso: 'Consulta sobre transporte',
    estado: 'exito',
    ip: '192.168.1.10',
    detalles: 'Nueva votación creada y programada',
    metadata: { tipo: 'consulta', fechaInicio: '2025-07-01' }
  },
  {
    id: '7',
    timestamp: '2025-06-11T13:22:47Z',
    usuario: 'votante_67',
    accion: 'Consultó resultados',
    recurso: 'Representante vecinal 2024',
    estado: 'exito',
    ip: '192.168.1.156',
    detalles: 'Acceso a página de resultados'
  },
  {
    id: '8',
    timestamp: '2025-06-11T11:45:33Z',
    usuario: 'sistema',
    accion: 'Sincronización blockchain',
    recurso: 'Red blockchain',
    estado: 'advertencia',
    ip: '127.0.0.1',
    detalles: 'Sincronización completada con retraso',
    metadata: { bloques: 1250, retraso: '5min' }
  },
  {
    id: '9',
    timestamp: '2025-06-11T10:15:29Z',
    usuario: 'admin',
    accion: 'Cerró votación',
    recurso: 'Consulta sobre seguridad',
    estado: 'exito',
    ip: '192.168.1.10',
    detalles: 'Votación cerrada manualmente'
  },
  {
    id: '10',
    timestamp: '2025-06-11T09:30:12Z',
    usuario: 'votante_23',
    accion: 'Error de autenticación',
    recurso: 'Sistema de login',
    estado: 'error',
    ip: '192.168.1.89',
    detalles: 'Credenciales inválidas',
    metadata: { intentos: 1 }
  }
];

export default function AdminLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroUsuario, setFiltroUsuario] = useState('todos');
  const [filtroAccion, setFiltroAccion] = useState('todos');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const [logSeleccionado, setLogSeleccionado] = useState<LogEntry | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const logsPorPagina = 10;

  const logsFiltrados = mockLogs.filter(log => {
    const matchSearch = 
      log.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.recurso.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchEstado = filtroEstado === 'todos' || log.estado === filtroEstado;
    const matchUsuario = filtroUsuario === 'todos' || log.usuario === filtroUsuario;
    const matchAccion = filtroAccion === 'todos' || log.accion.includes(filtroAccion);
    
    let matchFecha = true;
    if (fechaInicio || fechaFin) {
      const logDate = new Date(log.timestamp);
      if (fechaInicio) {
        matchFecha = matchFecha && logDate >= new Date(fechaInicio);
      }
      if (fechaFin) {
        matchFecha = matchFecha && logDate <= new Date(fechaFin + 'T23:59:59');
      }
    }
    
    return matchSearch && matchEstado && matchUsuario && matchAccion && matchFecha;
  });

  const totalPaginas = Math.ceil(logsFiltrados.length / logsPorPagina);
  const indiceInicio = (paginaActual - 1) * logsPorPagina;  const logsActuales = logsFiltrados.slice(indiceInicio, indiceInicio + logsPorPagina);

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'exito':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Éxito
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Error
          </span>
        );
      case 'advertencia':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Advertencia
          </span>
        );
      case 'info':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Info
          </span>
        );
      default:
        return null;
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const handleExport = () => {
    // Simular exportación
    const csvContent = logsFiltrados.map(log => 
      `${log.timestamp},${log.usuario},${log.accion},${log.recurso},${log.estado},${log.ip}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };
  const usuarios = Array.from(new Set(mockLogs.map(log => log.usuario)));

  const statsResumen = {
    total: mockLogs.length,
    exitos: mockLogs.filter(log => log.estado === 'exito').length,
    errores: mockLogs.filter(log => log.estado === 'error').length,
    advertencias: mockLogs.filter(log => log.estado === 'advertencia').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Registro de actividad</h1>
          <p className="text-gray-600 mt-1">
            Historial completo de eventos del sistema
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
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total eventos</p>
              <p className="text-2xl font-bold text-gray-900">{statsResumen.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Exitosos</p>
              <p className="text-2xl font-bold text-gray-900">{statsResumen.exitos}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Errores</p>
              <p className="text-2xl font-bold text-gray-900">{statsResumen.errores}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Advertencias</p>
              <p className="text-2xl font-bold text-gray-900">{statsResumen.advertencias}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Búsqueda */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Estado */}
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos los estados</option>
            <option value="exito">Éxito</option>
            <option value="error">Error</option>
            <option value="advertencia">Advertencia</option>
            <option value="info">Info</option>
          </select>

          {/* Usuario */}
          <select
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="todos">Todos los usuarios</option>
            {usuarios.map(usuario => (
              <option key={usuario} value={usuario}>{usuario}</option>
            ))}
          </select>

          {/* Fecha inicio */}
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Fecha fin */}
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Mostrando {indiceInicio + 1} - {Math.min(indiceInicio + logsPorPagina, logsFiltrados.length)} de {logsFiltrados.length} registros
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFiltroEstado('todos');
              setFiltroUsuario('todos');
              setFiltroAccion('todos');
              setFechaInicio('');
              setFechaFin('');
              setPaginaActual(1);
            }}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla de logs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha y hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recurso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Detalles
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {logsActuales.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDateTime(log.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{log.usuario}</span>
                    </div>
                    <div className="text-xs text-gray-500">{log.ip}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.accion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.recurso}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEstadoBadge(log.estado)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setLogSeleccionado(log)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-between items-center px-6 py-3 border-t border-gray-200">
            <button
              onClick={() => setPaginaActual(Math.max(1, paginaActual - 1))}
              disabled={paginaActual === 1}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <span className="text-sm text-gray-700">
              Página {paginaActual} de {totalPaginas}
            </span>
            
            <button
              onClick={() => setPaginaActual(Math.min(totalPaginas, paginaActual + 1))}
              disabled={paginaActual === totalPaginas}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {logSeleccionado && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-medium text-gray-900">Detalles del evento</h3>
                <button
                  onClick={() => setLogSeleccionado(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Timestamp</label>
                    <p className="text-sm text-gray-900">{formatDateTime(logSeleccionado.timestamp)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <div className="mt-1">{getEstadoBadge(logSeleccionado.estado)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Usuario</label>
                    <p className="text-sm text-gray-900">{logSeleccionado.usuario}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">IP</label>
                    <p className="text-sm text-gray-900">{logSeleccionado.ip}</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Acción</label>
                  <p className="text-sm text-gray-900">{logSeleccionado.accion}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Recurso</label>
                  <p className="text-sm text-gray-900">{logSeleccionado.recurso}</p>
                </div>
                
                {logSeleccionado.detalles && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Detalles</label>
                    <p className="text-sm text-gray-900">{logSeleccionado.detalles}</p>
                  </div>
                )}
                
                {logSeleccionado.metadata && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Metadata</label>
                    <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg overflow-x-auto">
                      {JSON.stringify(logSeleccionado.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje si no hay resultados */}
      {logsFiltrados.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron registros
          </h3>
          <p className="text-gray-500">
            Intenta ajustar los filtros de búsqueda.
          </p>
        </div>
      )}
    </div>
  );
}
