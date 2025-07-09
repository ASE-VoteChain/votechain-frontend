import { 
  Shield, 
  Users, 
  Target, 
  Award,
  Globe,
  Heart,
  Lightbulb,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre VoteChain
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Transformando la democracia digital con tecnología blockchain segura y transparente
            </p>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Nuestra Misión</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Democratizar el acceso a sistemas de votación seguros y transparentes, 
                utilizando tecnología blockchain para garantizar la integridad electoral 
                y fortalecer la confianza ciudadana en los procesos democráticos.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Nuestra Visión</h2>
              </div>
              <p className="text-gray-700 text-lg leading-relaxed">
                Ser la plataforma líder mundial en votación digital, estableciendo 
                nuevos estándares de seguridad, transparencia y accesibilidad que 
                inspiren confianza y participación ciudadana en todo el mundo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Nuestros Valores
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Seguridad</h3>
              <p className="text-gray-600">
                Protegemos cada voto con la más alta tecnología de seguridad disponible
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Transparencia</h3>
              <p className="text-gray-600">
                Cada proceso es abierto, verificable y accesible para todos
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Innovación</h3>
              <p className="text-gray-600">
                Utilizamos tecnología de vanguardia para resolver desafíos complejos
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Inclusión</h3>
              <p className="text-gray-600">
                Facilitamos la participación democrática para todos los ciudadanos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Historia */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Nuestra Historia
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Desde la concepción hasta la implementación, conoce el camino que nos llevó 
              a crear la plataforma de votación más segura del mundo
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Identificación del Problema</h3>
                  <p className="text-gray-700">
                    Reconocimos la necesidad crítica de sistemas de votación más seguros, 
                    transparentes y accesibles en la era digital, especialmente después de 
                    observar las limitaciones de los métodos tradicionales.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Investigación y Desarrollo</h3>
                  <p className="text-gray-700">
                    Invertimos años en investigar las mejores prácticas en criptografía, 
                    blockchain y sistemas distribuidos para crear una arquitectura robusta 
                    y confiable que pudiera manejar procesos electorales críticos.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Pruebas y Validación</h3>
                  <p className="text-gray-700">
                    Realizamos extensivas pruebas de seguridad, penetración y usabilidad 
                    con expertos en ciberseguridad y organizaciones electorales para 
                    validar la efectividad de nuestra solución.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start space-x-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900">Lanzamiento y Adopción</h3>
                  <p className="text-gray-700">
                    Lanzamos VoteChain con un enfoque gradual, comenzando con organizaciones 
                    pequeñas y expandiéndonos a medida que demostramos la confiabilidad 
                    y seguridad de nuestra plataforma.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Nuestro Equipo
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Un grupo multidisciplinario de expertos comprometidos con la excelencia 
              en seguridad, tecnología y experiencia de usuario
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Expertos en Ciberseguridad</h3>
              <p className="text-gray-600">
                Especialistas con décadas de experiencia en protección de sistemas críticos
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Desarrolladores Blockchain</h3>
              <p className="text-gray-600">
                Ingenieros especializados en tecnologías distribuidas y criptografía avanzada
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Especialistas UX/UI</h3>
              <p className="text-gray-600">
                Diseñadores enfocados en crear experiencias intuitivas y accesibles
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Logros y Certificaciones */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              Reconocimientos y Certificaciones
            </h2>
            <p className="text-xl text-gray-600">
              Nuestro compromiso con la excelencia ha sido reconocido por organizaciones líderes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <Award className="w-12 h-12 text-gold-500 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">ISO 27001</h3>
              <p className="text-sm text-gray-600">Certificación de Seguridad de la Información</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">SOC 2 Type II</h3>
              <p className="text-sm text-gray-600">Auditoría de Controles de Seguridad</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">99.9% Uptime</h3>
              <p className="text-sm text-gray-600">Disponibilidad del Sistema</p>
            </div>

            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">100K+ Votos</h3>
              <p className="text-sm text-gray-600">Procesados Exitosamente</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Únete a la Revolución Democrática
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Forma parte del futuro de la votación digital segura y transparente
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 font-semibold transition-colors"
            >
              Crear Cuenta
            </Link>
            <Link
              href="/public/como-funciona"
              className="inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-blue-600 font-semibold transition-colors"
            >
              Conocer Más
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
