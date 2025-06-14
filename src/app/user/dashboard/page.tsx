'use client'

import Link from 'next/link'

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de usuario</h1>
        <p className="text-lg text-gray-600">
          Bienvenido a tu plataforma de votación segura y transparente
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Votaciones activas</p>
              <p className="text-xs text-gray-400">Requiere tu participación</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-semibold">8</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Votos emitidos</p>
              <p className="text-xs text-gray-400">Total histórico</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold">5</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resultados vistos</p>
              <p className="text-xs text-gray-400">Últimos 30 días</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-semibold">100%</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Tasa participación</p>
              <p className="text-xs text-gray-400">Últimas votaciones</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Votaciones pendientes</h3>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">Representante vecinal 2025</h4>
                  <p className="text-sm text-gray-500 mt-1">Cierra: 25 mayo 2025</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Activa
                </span>
              </div>
              <Link 
                href="/user/votaciones" 
                className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Emitir voto →
              </Link>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-900">Presupuesto participativo</h4>
                  <p className="text-sm text-gray-500 mt-1">Cierra: 30 mayo 2025</p>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  Activa
                </span>
              </div>
              <Link 
                href="/user/votaciones" 
                className="mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Emitir voto →
              </Link>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link 
              href="/user/votaciones" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors inline-block text-center"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Ver todas las votaciones
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h3>
          <div className="space-y-3">
            <Link 
              href="/user/perfil" 
              className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">👤</span>
                <div>
                  <h4 className="font-medium text-gray-900">Mi perfil</h4>
                  <p className="text-sm text-gray-500">Ver y editar información personal</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/user/historial" 
              className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">📋</span>
                <div>
                  <h4 className="font-medium text-gray-900">Mi historial</h4>
                  <p className="text-sm text-gray-500">Revisar participación en votaciones</p>
                </div>
              </div>
            </Link>

            <Link 
              href="/user/configuracion" 
              className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚙️</span>
                <div>
                  <h4 className="font-medium text-gray-900">Configuración</h4>
                  <p className="text-sm text-gray-500">Ajustar preferencias y seguridad</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Actividad reciente</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Voto emitido: Representante vecinal</p>
                  <p className="text-xs text-gray-500">Hace 2 días</p>
                </div>
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                Verificado
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Perfil actualizado</p>
                  <p className="text-xs text-gray-500">Hace 1 semana</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Resultados consultados: Presupuesto 2024</p>
                  <p className="text-xs text-gray-500">Hace 2 semanas</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <Link 
              href="/user/historial" 
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Ver historial completo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
