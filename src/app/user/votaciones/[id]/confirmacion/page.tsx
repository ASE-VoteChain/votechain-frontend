'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircle, 
  Hash, 
  Calendar, 
  Clock, 
  Download,
  Share2,
  ArrowRight,
  Copy,
  Eye,
  Shield,
  Users,
  BarChart3,
  ExternalLink
} from 'lucide-react';

interface ConfirmacionVoto {
  id: string;
  tituloVotacion: string;
  candidatoSeleccionado: string;
  fechaVoto: string;
  horaVoto: string;
  hashTransaccion: string;
  blockchainExplorer: string;
  estadoVerificacion: 'pendiente' | 'confirmado' | 'verificado';
  numeroConfirmaciones: number;
  tiempoEstimadoVerificacion: string;
}

// Mock data - en producción vendría de API
const mockConfirmaciones: Record<string, ConfirmacionVoto> = {
  '1': {
    id: '1',
    tituloVotacion: 'Representante vecinal 2025',
    candidatoSeleccionado: 'Rosa Pérez',
    fechaVoto: new Date().toISOString(),
    horaVoto: new Date().toLocaleTimeString('es-ES'),
    hashTransaccion: '0x8f9c2b1e4d7a3c9f6e2a8b5d1c7e9f3a6d2b8c4e1a9f7b3d5c8e2a6f1b4d7c9e',
    blockchainExplorer: 'https://etherscan.io/tx/',
    estadoVerificacion: 'confirmado',
    numeroConfirmaciones: 12,
    tiempoEstimadoVerificacion: '2-3 minutos'
  },
  '2': {
    id: '2',
    tituloVotacion: 'Presupuesto participativo 2025',
    candidatoSeleccionado: 'Mejoramiento del parque central',
    fechaVoto: new Date().toISOString(),
    horaVoto: new Date().toLocaleTimeString('es-ES'),
    hashTransaccion: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    blockchainExplorer: 'https://etherscan.io/tx/',
    estadoVerificacion: 'verificado',
    numeroConfirmaciones: 25,
    tiempoEstimadoVerificacion: 'Completado'
  }
};

export default function ConfirmacionVotoPage() {
  const router = useRouter();
  const params = useParams();
  const [confirmacion, setConfirmacion] = useState<ConfirmacionVoto | null>(null);
  const [copiado, setCopiado] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarConfirmacion = async () => {
      setLoading(true);
      try {
        // Simular carga de API
        await new Promise(resolve => setTimeout(resolve, 1500));
        const id = params.id as string;
        const confirmacionData = mockConfirmaciones[id];
        
        if (!confirmacionData) {
          router.push('/user/votaciones');
          return;
        }
        
        setConfirmacion(confirmacionData);
      } catch (error) {
        console.error('Error cargando confirmación:', error);
        router.push('/user/votaciones');
      } finally {
        setLoading(false);
      }
    };

    cargarConfirmacion();
  }, [params.id, router]);

  const copiarHash = async () => {
    if (confirmacion) {
      try {
        await navigator.clipboard.writeText(confirmacion.hashTransaccion);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
      } catch (error) {
        console.error('Error copiando hash:', error);
      }
    }
  };

  const descargarComprobante = () => {
    if (!confirmacion) return;
    
    const comprobante = {
      votacion: confirmacion.tituloVotacion,
      candidato: confirmacion.candidatoSeleccionado,
      fecha: confirmacion.fechaVoto,
      hash: confirmacion.hashTransaccion,
      estado: confirmacion.estadoVerificacion
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(comprobante, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `comprobante-voto-${confirmacion.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Procesando tu voto...</h3>
          <p className="text-gray-600">Validando y registrando en blockchain</p>
        </div>
      </div>
    );
  }

  if (!confirmacion) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirmación no encontrada</h2>
        <p className="text-gray-600 mb-6">No se pudo encontrar la confirmación de tu voto.</p>
        <Link
          href="/user/votaciones"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Volver a votaciones
        </Link>
      </div>
    );
  }

  const fechaFormateada = new Date(confirmacion.fechaVoto).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header de éxito */}
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Voto registrado exitosamente!</h1>
        <p className="text-lg text-gray-600">Tu participación ha sido registrada de forma segura en la blockchain</p>
      </div>

      {/* Detalles del voto */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalles de tu voto</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Votación</label>
              <p className="text-lg font-medium text-gray-900">{confirmacion.tituloVotacion}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Tu selección</label>
              <p className="text-lg font-medium text-green-700">{confirmacion.candidatoSeleccionado}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Fecha y hora</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-gray-900">
                  <Calendar className="w-4 h-4 mr-2" />
                  {fechaFormateada}
                </div>
                <div className="flex items-center text-gray-900">
                  <Clock className="w-4 h-4 mr-2" />
                  {confirmacion.horaVoto}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Estado de verificación</label>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                confirmacion.estadoVerificacion === 'verificado'
                  ? 'bg-green-100 text-green-800'
                  : confirmacion.estadoVerificacion === 'confirmado'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {confirmacion.estadoVerificacion === 'verificado' && <CheckCircle className="w-4 h-4 mr-1" />}
                {confirmacion.estadoVerificacion === 'confirmado' && <Shield className="w-4 h-4 mr-1" />}
                {confirmacion.estadoVerificacion === 'pendiente' && <Clock className="w-4 h-4 mr-1" />}
                {confirmacion.estadoVerificacion.charAt(0).toUpperCase() + confirmacion.estadoVerificacion.slice(1)}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Confirmaciones blockchain</label>
              <p className="text-lg font-medium text-gray-900">{confirmacion.numeroConfirmaciones}/12</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((confirmacion.numeroConfirmaciones / 12) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Tiempo estimado</label>
              <p className="text-lg font-medium text-gray-900">{confirmacion.tiempoEstimadoVerificacion}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hash de transacción */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Hash className="w-5 h-5 mr-2" />
          Hash de transacción blockchain
        </h3>
        
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <code className="text-sm font-mono text-gray-800 break-all pr-4">
              {confirmacion.hashTransaccion}
            </code>
            <div className="flex space-x-2 flex-shrink-0">
              <button
                onClick={copiarHash}
                className={`p-2 rounded-lg transition-colors ${
                  copiado ? 'bg-green-100 text-green-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
                }`}
                title="Copiar hash"
              >
                <Copy className="w-4 h-4" />
              </button>
              <a
                href={`${confirmacion.blockchainExplorer}${confirmacion.hashTransaccion}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                title="Ver en explorador de blockchain"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mt-3">
          Este hash único identifica tu voto en la blockchain y garantiza su inmutabilidad y verificabilidad.
        </p>
      </div>

      {/* Acciones */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Qué puedes hacer ahora?</h3>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={descargarComprobante}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-8 h-8 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Descargar comprobante</span>
          </button>
          
          <Link
            href={`/user/resultados?votacion=${confirmacion.id}`}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="w-8 h-8 text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Ver resultados</span>
          </Link>
          
          <Link
            href="/user/historial"
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-8 h-8 text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Ver historial</span>
          </Link>
          
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'VoteChain - Voto registrado',
                  text: `He participado en: ${confirmacion.tituloVotacion}`,
                  url: window.location.href
                });
              }
            }}
            className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-8 h-8 text-orange-600 mb-2" />
            <span className="text-sm font-medium text-gray-900">Compartir</span>
          </button>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">¿Qué sigue?</h3>
        <div className="space-y-3 text-blue-800">
          <div className="flex items-start">
            <Users className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <p>Los resultados se publicarán automáticamente cuando termine el período de votación.</p>
          </div>
          <div className="flex items-start">
            <Shield className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <p>Tu voto está protegido por criptografía avanzada y registrado permanentemente en blockchain.</p>
          </div>
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
            <p>Puedes verificar la validez de tu voto en cualquier momento usando el hash de transacción.</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div className="flex justify-between items-center pt-6">
        <Link
          href="/user/votaciones"
          className="text-blue-600 hover:text-blue-800 transition-colors"
        >
          ← Volver a votaciones
        </Link>
        
        <Link
          href="/user/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center"
        >
          Ir al dashboard
          <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </div>
  );
}
