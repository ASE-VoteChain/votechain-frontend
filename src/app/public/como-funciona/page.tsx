import { 
  UserPlus, 
  Vote, 
  Shield, 
  Search, 
  BarChart3, 
  Lock,
  Smartphone,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ¿Cómo Funciona VoteChain?
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Descubre el proceso completo de votación segura con tecnología blockchain
            </p>
          </div>
        </div>
      </section>

      {/* Proceso de Votación */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Proceso de Votación en 4 Pasos
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Paso 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">1. Registro</h3>
              <p className="text-gray-600">
                Crea tu cuenta con verificación de identidad para garantizar la legitimidad del proceso
              </p>
            </div>

            {/* Paso 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Vote className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">2. Votación</h3>
              <p className="text-gray-600">
                Emite tu voto de forma segura desde cualquier dispositivo con acceso a internet
              </p>
            </div>

            {/* Paso 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">3. Blockchain</h3>
              <p className="text-gray-600">
                Tu voto se registra en la blockchain de forma inmutable y anónima
              </p>
            </div>

            {/* Paso 4 */}
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">4. Resultados</h3>
              <p className="text-gray-600">
                Consulta los resultados en tiempo real con total transparencia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Características de Seguridad */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Características de Seguridad
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Encriptación Extrema</h3>
                <p className="text-gray-600">
                  Todos los datos se cifran con algoritmos de última generación
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Inmutabilidad</h3>
                <p className="text-gray-600">
                  Una vez registrado, tu voto no puede ser alterado o eliminado
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Search className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Transparencia Total</h3>
                <p className="text-gray-600">
                  Toda la información es verificable públicamente
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Smartphone className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Acceso Multiplataforma</h3>
                <p className="text-gray-600">
                  Vota desde cualquier dispositivo con conexión a internet
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Detección de Fraude</h3>
                <p className="text-gray-600">
                  Sistemas avanzados para prevenir y detectar intentos de fraude
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">Anonimato Garantizado</h3>
                <p className="text-gray-600">
                  Tu identidad permanece protegida durante todo el proceso
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tecnología Blockchain */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              ¿Por Qué Blockchain?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              La tecnología blockchain proporciona las garantías de seguridad y transparencia 
              que requiere un sistema de votación democrático
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-gray-900">Ventajas Clave</h3>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span className="text-gray-700">
                    <strong>Descentralización:</strong> No hay un punto único de falla
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span className="text-gray-700">
                    <strong>Inmutabilidad:</strong> Los registros no pueden ser alterados
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span className="text-gray-700">
                    <strong>Transparencia:</strong> Auditoría pública en tiempo real
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <span className="text-gray-700">
                    <strong>Consenso:</strong> Validación distribuida de transacciones
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h4 className="text-xl font-semibold mb-4 text-gray-900">Flujo de Datos</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <span className="text-gray-700">Voto cifrado localmente</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <span className="text-gray-700">Transmisión segura</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <span className="text-gray-700">Validación por nodos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <span className="text-gray-700">Registro inmutable</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            ¿Listo para Participar?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Únete a la revolución de la votación digital segura y transparente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Crear Cuenta
            </Link>
            <Link
              href="/public/validar"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 font-semibold transition-colors"
            >
              <Search className="w-5 h-5 mr-2" />
              Validar Voto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
