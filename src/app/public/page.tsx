'use client';

import Link from 'next/link';
import { Vote, Shield, Eye, Users, CheckCircle, ArrowRight } from 'lucide-react';

interface VotacionAbierta {
  id: string;
  nombre: string;
  fechaCierre: string;
  estado: 'abierta' | 'proxima';
}

const votacionesAbiertas: VotacionAbierta[] = [
  {
    id: '1',
    nombre: 'Representante vecinal',
    fechaCierre: '25 mayo 2025',
    estado: 'abierta'
  },
  {
    id: '2',
    nombre: 'Presupuesto participativo',
    fechaCierre: '30 mayo 2025',
    estado: 'abierta'
  }
];

export default function PublicHomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6 rounded-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Bienvenido a VoteChain
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            La plataforma de votación digital que combina seguridad blockchain con facilidad de uso para una democracia del siglo XXI.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-lg hover:bg-green-600 transition-colors shadow-lg"
          >
            Crea tu cuenta ahora
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ¿Qué es VoteChain? */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Qué es VoteChain?</h3>
          <div className="space-y-4 text-gray-600">
            <p>
              Una plataforma de votación digital segura y transparente basada en tecnología blockchain, 
              que garantiza la integridad y el anonimato de cada voto emitido.
            </p>
            <p>
              Diseñada para organizaciones, comunidades y gobiernos que buscan procesos democráticos 
              confiables y accesibles.
            </p>
          </div>
        </div>

        {/* Votaciones abiertas */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Votaciones abiertas</h3>
          <div className="space-y-4">
            {votacionesAbiertas.map((votacion) => (
              <div key={votacion.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900">{votacion.nombre}</div>
                  <div className="text-sm text-gray-500">Cierra: {votacion.fechaCierre}</div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Abierta
                </span>
              </div>
            ))}
            <div className="mt-4">
              <Link
                href="/public/votaciones"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Ver todas
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ¿Por qué usar VoteChain? */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Por qué usar VoteChain?</h3>
          <ul className="space-y-4 text-gray-600">
            <li className="flex items-start">
              <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Seguridad:</strong> Votaciones inalterables gracias a la tecnología blockchain
              </div>
            </li>
            <li className="flex items-start">
              <Eye className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Privacidad:</strong> Sistema 100% anónimo que protege la identidad del votante
              </div>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Transparencia:</strong> Resultados auditables en tiempo real por todos los participantes
              </div>
            </li>
            <li className="flex items-start">
              <Users className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <strong className="text-gray-900">Accesibilidad:</strong> Participa desde cualquier dispositivo con conexión a internet
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">¿Ya estás registrado?</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-gray-600 flex-1">
            Inicia sesión para emitir tu voto o gestionar elecciones en cualquier momento y desde cualquier lugar.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Vote className="w-4 h-4 mr-2" />
              Iniciar sesión
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users className="w-4 h-4 mr-2" />
              Registrarse
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Seguridad Blockchain</h4>
          <p className="text-gray-600 text-sm">
            Tecnología blockchain garantiza la inmutabilidad de los votos
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Verificación Pública</h4>
          <p className="text-gray-600 text-sm">
            Cualquier persona puede verificar la integridad de los resultados
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Eye className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Transparencia Total</h4>
          <p className="text-gray-600 text-sm">
            Resultados en tiempo real y auditables por toda la comunidad
          </p>
        </div>

        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-yellow-600" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Fácil Acceso</h4>
          <p className="text-gray-600 text-sm">
            Interfaz intuitiva accesible desde cualquier dispositivo
          </p>
        </div>
      </section>
    </div>
  );
}
