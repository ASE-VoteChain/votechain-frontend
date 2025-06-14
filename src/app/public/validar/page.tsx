'use client';

import { useState } from 'react';
import { 
  Shield, 
  Search, 
  CheckCircle, 
  Copy, 
  ExternalLink, 
  Info, 
  Hash,
  Calendar,
  Users,
  AlertCircle
} from 'lucide-react';

interface VotacionValidacion {
  titulo: string;
  fechaCierre: string;
  totalVotos: number;
  estado: string;
  participacion: number;
  hashBlockchain: string;
}

const votacionEjemplo: VotacionValidacion = {
  titulo: 'Representante vecinal 2025',
  fechaCierre: '25 mayo 2025',
  totalVotos: 432,
  estado: 'Finalizada',
  participacion: 76,
  hashBlockchain: '9f24bd3a79c482a7b01f339ac6f1c0d62e3aaf79b88eea29d8e4c5a0ef37d5ba'
};

export default function ValidarVotacionPage() {
  const [hashInput, setHashInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null);
  const [showExample, setShowExample] = useState(false);

  const handleValidation = async () => {
    if (!hashInput.trim()) return;
    
    setIsValidating(true);
    setValidationResult(null);
    
    // Simular validación
    setTimeout(() => {
      // Simple validation - en producción sería una llamada a la blockchain
      if (hashInput.trim().length === 64 && /^[a-fA-F0-9]+$/.test(hashInput.trim())) {
        setValidationResult('valid');
      } else {
        setValidationResult('invalid');
      }
      setIsValidating(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const loadExample = () => {
    setHashInput(votacionEjemplo.hashBlockchain);
    setShowExample(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Validación de Votación
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Verifica la integridad y autenticidad de cualquier votación utilizando su hash de blockchain.
        </p>
      </div>

      {/* Formulario de validación */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-600" />
            Verificar Hash de Votación
          </h2>

          <div className="space-y-6">
            <div>
              <label htmlFor="hash-input" className="block text-sm font-medium text-gray-700 mb-2">
                Hash de la votación
              </label>
              <div className="relative">
                <textarea
                  id="hash-input"
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                  placeholder="Ingresa el hash de la votación que deseas verificar (64 caracteres hexadecimales)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <div className="absolute bottom-3 right-3">
                  <Hash className="w-5 h-5 text-gray-400" />
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                El hash debe ser una cadena de 64 caracteres hexadecimales
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleValidation}
                disabled={!hashInput.trim() || isValidating}
                className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isValidating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Validando...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Validar Hash
                  </>
                )}
              </button>
              
              <button
                onClick={loadExample}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Usar ejemplo
              </button>
            </div>
          </div>

          {/* Resultado de validación */}
          {validationResult && (
            <div className="mt-6 p-4 rounded-lg border">
              {validationResult === 'valid' ? (
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      ✅ Hash Válido
                    </h3>
                    <p className="text-green-700">
                      El hash ha sido verificado exitosamente en la blockchain. 
                      Esta votación es auténtica e íntegra.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-800 mb-2">
                      ❌ Hash Inválido
                    </h3>
                    <p className="text-red-700">
                      El hash proporcionado no es válido o no se encuentra en la blockchain.
                      Verifica que el hash esté completo y sea correcto.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Información de la votación de ejemplo */}
      {showExample && validationResult === 'valid' && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Información de la Votación Verificada
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {votacionEjemplo.titulo}
                </div>
                <div className="text-sm text-gray-500">Título</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1 flex items-center justify-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {votacionEjemplo.fechaCierre}
                </div>
                <div className="text-sm text-gray-500">Fecha de cierre</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1 flex items-center justify-center">
                  <Users className="w-5 h-5 mr-2" />
                  {votacionEjemplo.totalVotos.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Total de votos</div>
              </div>

              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {votacionEjemplo.participacion}%
                </div>
                <div className="text-sm text-gray-500">Participación</div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Verificación en Blockchain
              </h3>
              
              <p className="text-blue-800 mb-4">
                Este identificador garantiza que los resultados no han sido alterados y pueden ser verificados públicamente.
              </p>
              
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <code className="text-sm font-mono text-gray-700 break-all flex-1 mr-4">
                    {votacionEjemplo.hashBlockchain}
                  </code>
                  <button
                    onClick={() => copyToClipboard(votacionEjemplo.hashBlockchain)}
                    className="flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    title="Copiar hash"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                <div className="flex items-center">
                  <Info className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-blue-800">
                    Los resultados de esta votación están almacenados de forma permanente e inmutable en la blockchain.
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                <ExternalLink className="w-5 h-5 mr-2" />
                Abrir explorador de bloques
              </button>
              
              <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
                Descargar certificado
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cómo funciona */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          ¿Cómo funciona la validación?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Hash className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Ingresa el Hash</h3>
            <p className="text-gray-600">
              Introduce el hash de la votación que deseas verificar. Este hash es único para cada votación.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Verificación</h3>
            <p className="text-gray-600">
              El sistema busca el hash en la blockchain y verifica su autenticidad e integridad.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Resultado</h3>
            <p className="text-gray-600">
              Obtén la confirmación de que la votación es auténtica y consulta sus detalles.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Preguntas Frecuentes
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Dónde puedo encontrar el hash de una votación?
            </h3>
            <p className="text-gray-600">
              El hash se proporciona en los resultados oficiales de cada votación y en las confirmaciones 
              enviadas a los participantes.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Qué garantiza la validación por blockchain?
            </h3>
            <p className="text-gray-600">
              La blockchain garantiza que los datos no han sido modificados desde su creación, 
              proporcionando una prueba criptográfica de integridad.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              ¿Puedo validar votaciones antiguas?
            </h3>
            <p className="text-gray-600">
              Sí, todas las votaciones almacenadas en blockchain permanecen verificables indefinidamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
