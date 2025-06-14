'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Shield, 
  Clock, 
  Users, 
  Hash, 
  RefreshCw,
  ExternalLink,
  Info,
  Activity
} from 'lucide-react';

interface OpcionVotacion {
  nombre: string;
  votos: number;
  porcentaje: number;
  color: string;
}

interface BlockchainBlock {
  timestamp: string;
  hash: string;
  votos: number;
}

const opcionesActuales: OpcionVotacion[] = [
  {
    nombre: 'Proyecto de infraestructura vial',
    votos: 345,
    porcentaje: 41.3,
    color: 'bg-blue-600'
  },
  {
    nombre: 'Mejora de espacios públicos',
    votos: 299,
    porcentaje: 35.8,
    color: 'bg-green-600'
  },
  {
    nombre: 'Centro cultural comunitario',
    votos: 191,
    porcentaje: 22.9,
    color: 'bg-purple-600'
  }
];

const historialBlockchain: BlockchainBlock[] = [
  {
    timestamp: '11/06/2025 10:15',
    hash: '8e31c6f4a92b7d8c3e5f2a1b9d7e4c6a8f5b3d2e9c7a5f8b1d4e7c9a6f3b8e5',
    votos: 27
  },
  {
    timestamp: '11/06/2025 09:30',
    hash: '3f72a9b8e5c1d6f4a7b9c2e8f5a3d6b9c7f4a1e8d5b2c9f6a3e7b4c8f1a5d9',
    votos: 35
  },
  {
    timestamp: '11/06/2025 08:45',
    hash: 'c4d8e5f1a3b6c9f2a5d8e3f6a9c2d5f8a1e4c7f9a2b5d8e6f3a9c1d4f7a8b5',
    votos: 18
  },
  {
    timestamp: '11/06/2025 08:00',
    hash: 'a7b4c1d8e5f2a9c6d3f7a4b1e8d5c2f9a6b3e7c4f1a8d5b2e9c6f3a7b4c1d8',
    votos: 42
  },
  {
    timestamp: '11/06/2025 07:15',
    hash: 'f9c2a5d8e1b4f7a3c6d9e2f5a8b1c4d7e9f2a5c8d1b4e7f9a2c5d8e1b4f7a3',
    votos: 29
  }
];

export default function PanelPublicoPage() {
  const [isUpdating, setIsUpdating] = useState(false);

  const totalVotos = opcionesActuales.reduce((sum, opcion) => sum + opcion.votos, 0);
  const participacionPorcentaje = 68; // Mock percentage

  const handleRefresh = () => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 2000);
  };

  const formatHash = (hash: string) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 6)}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Panel Público de Transparencia
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Seguimiento en tiempo real de las votaciones activas con total transparencia y verificación blockchain.
        </p>
      </div>

      {/* Resumen actual */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="w-6 h-6 mr-2 text-blue-600" />
            Resumen actual de la elección
          </h2>
          <button
            onClick={handleRefresh}
            disabled={isUpdating}
            className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Votación</p>
            <p className="text-lg font-bold text-gray-900">Presupuesto participativo 2025</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Estado</p>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              En progreso
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Cierre</p>
            <p className="text-lg font-bold text-gray-900">30 junio 2025</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Votos contabilizados</p>
            <p className="text-lg font-bold text-gray-900">{totalVotos.toLocaleString()} votos</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Participación</p>
            <p className="text-lg font-bold text-gray-900">{participacionPorcentaje}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Hash de verificación</p>
            <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
              Ver hash
              <ExternalLink className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Distribución de votos */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
          Distribución de votos por opción
        </h2>

        <div className="space-y-6">
          {opcionesActuales.map((opcion, index) => (
            <div key={index} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">{opcion.nombre}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">
                    {opcion.votos.toLocaleString()} votos
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-800">
                    {opcion.porcentaje}%
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`${opcion.color} h-4 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
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

        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {totalVotos.toLocaleString()}
            </div>
            <div className="text-gray-600">Total de votos emitidos</div>
          </div>
        </div>
      </div>

      {/* Evolución en tiempo real */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
          Evolución de votos en tiempo real
        </h2>

        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center mb-6">
          <div className="text-center text-gray-500">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Gráfico de línea de tiempo real</p>
            <p className="text-sm">Visualización de la evolución de votos por hora</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <Info className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-blue-800">
              Esta información se actualiza automáticamente cada 5 minutos.
            </span>
          </div>
        </div>
      </div>

      {/* Historial de bloques */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Shield className="w-6 h-6 mr-2 text-blue-600" />
          Historial de bloques en blockchain
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-900">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Timestamp
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">
                  <div className="flex items-center">
                    <Hash className="w-4 h-4 mr-2" />
                    Hash
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Votos
                  </div>
                </th>
                <th className="text-left py-4 px-4 font-semibold text-gray-900">Verificación</th>
              </tr>
            </thead>
            <tbody>
              {historialBlockchain.map((block, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-gray-700">{block.timestamp}</td>
                  <td className="py-4 px-4">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono text-gray-700">
                      {formatHash(block.hash)}
                    </code>
                  </td>
                  <td className="py-4 px-4 text-gray-700 font-medium">{block.votos}</td>
                  <td className="py-4 px-4">
                    <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                      Verificar
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-6">
          <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
            Ver historial completo
          </button>
        </div>
      </div>

      {/* Información de transparencia */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8">
        <div className="text-center max-w-3xl mx-auto">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Transparencia Total Garantizada
          </h3>
          <p className="text-gray-600 text-lg mb-6">
            Todos los datos mostrados en este panel son verificables públicamente a través de la blockchain. 
            Cada voto está protegido criptográficamente y es inmutable.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-gray-700">Verificable</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-2">∞</div>
              <div className="text-gray-700">Inmutable</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-700">Disponible</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
