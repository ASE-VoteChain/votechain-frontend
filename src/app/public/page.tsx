'use client';

import Link from 'next/link';
import { 
  Vote, 
  Shield, 
  Eye, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  LogIn, 
  UserPlus,
  Lock,
  Smartphone,
  Globe,
  Award,
  Clock,
  Zap
} from 'lucide-react';

export default function PublicHomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-6 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Democracia Digital Segura
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            VoteChain utiliza tecnología blockchain para garantizar votaciones transparentes, 
            seguras e inviolables. Solo usuarios autenticados pueden participar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-lg"
            >
              <UserPlus className="mr-2 w-6 h-6" />
              Únete ahora
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
            >
              <LogIn className="mr-2 w-6 h-6" />
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>

      {/* Authentication Required Notice */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-3xl font-bold text-amber-900 mb-4">
            Acceso Solo para Usuarios Autenticados
          </h2>
          <p className="text-lg text-amber-800 mb-6">
            Para garantizar la integridad del proceso electoral, solo los usuarios registrados 
            y verificados pueden votar y ver resultados. Esto asegura que cada voto sea válido y único.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
            >
              Crear cuenta gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white rounded-xl shadow-lg p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo Funciona VoteChain?
            </h2>
            <p className="text-xl text-gray-600">
              Un proceso simple y seguro en 4 pasos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Paso 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">1. Regístrate</h3>
              <p className="text-gray-600">
                Crea tu cuenta con datos verificables. Tu identidad se valida para garantizar 
                la legitimidad del proceso.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">2. Inicia Sesión</h3>
              <p className="text-gray-600">
                Accede a tu cuenta segura para ver las votaciones disponibles 
                y tu historial de participación.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Vote className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3. Vota</h3>
              <p className="text-gray-600">
                Selecciona tu opción preferida. Tu voto se registra de forma 
                anónima y segura en la blockchain.
              </p>
            </div>

            {/* Paso 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">4. Verifica</h3>
              <p className="text-gray-600">
                Consulta los resultados en tiempo real y verifica la 
                integridad de tu voto en la blockchain.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ¿Qué es VoteChain? */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
            <Vote className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Qué es VoteChain?</h3>
          <div className="space-y-4 text-gray-600">
            <p>
              Una plataforma de votación digital de nueva generación que combina la seguridad 
              de la blockchain con una interfaz intuitiva y accesible.
            </p>
            <p>
              Diseñada para organizaciones, comunidades y gobiernos que buscan procesos 
              democráticos confiables, transparentes y verificables.
            </p>
            <p className="font-medium text-blue-600">
              Solo usuarios autenticados pueden participar, garantizando la integridad de cada votación.
            </p>
          </div>
        </div>

        {/* Seguridad y Confianza */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Seguridad y Confianza</h3>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Blockchain inmutable:</strong> Una vez registrado, tu voto no puede ser alterado
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Anonimato garantizado:</strong> Tu identidad permanece privada
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Verificación pública:</strong> Cualquier usuario puede auditar los resultados
              </div>
            </li>
          </ul>
        </div>

        {/* Ventajas de la Autenticación */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Solo Usuarios Verificados</h3>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start">
              <Lock className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Un voto por persona:</strong> Evita la duplicación y el fraude
              </div>
            </li>
            <li className="flex items-start">
              <Award className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Legitimidad:</strong> Solo votantes elegibles pueden participar
              </div>
            </li>
            <li className="flex items-start">
              <Eye className="w-5 h-5 text-purple-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Trazabilidad:</strong> Historial completo de tu participación
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Technology Features */}
      <section className="bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-xl p-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tecnología de Vanguardia
            </h2>
            <p className="text-xl text-blue-100">
              Características que hacen de VoteChain la plataforma más segura
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-300" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Blockchain</h4>
              <p className="text-blue-100 text-sm">
                Registro inmutable de votos con validación criptográfica
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-300" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Tiempo Real</h4>
              <p className="text-blue-100 text-sm">
                Resultados actualizados instantáneamente y verificables
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-purple-300" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Multiplataforma</h4>
              <p className="text-blue-100 text-sm">
                Accesible desde cualquier dispositivo con internet
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-yellow-300" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Global</h4>
              <p className="text-blue-100 text-sm">
                Participación desde cualquier lugar del mundo
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para Participar?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Únete a miles de usuarios que ya confían en VoteChain para sus procesos democráticos.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <Clock className="w-8 h-8 text-blue-200 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Proceso Rápido</h3>
              <p className="text-blue-100 text-sm">
                Registro en menos de 5 minutos. Votación con un solo clic.
              </p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6">
              <Award className="w-8 h-8 text-blue-200 mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Máxima Seguridad</h3>
              <p className="text-blue-100 text-sm">
                Tu voto está protegido por la tecnología blockchain más avanzada.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-lg"
            >
              <UserPlus className="mr-2 w-6 h-6" />
              Crear cuenta gratis
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white text-lg font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
            >
              <LogIn className="mr-2 w-6 h-6" />
              Ya tengo cuenta
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
