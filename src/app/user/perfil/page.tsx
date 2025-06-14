'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PerfilPage() {
  const [userData] = useState({
    nombre: 'Sebastián Ramírez',
    email: 'sebastian@email.com',
    dni: '12345678',
    rol: 'Votante',
    fechaRegistro: '15 enero 2024',
    iniciales: 'SR'
  })

  const [recentVotes] = useState([
    {
      id: 1,
      nombre: 'Representante vecinal 2025',
      fecha: '12 mayo 2025',
      estado: 'Verificado',
      hash: 'c5a73bd8f2f78e0d412c331e937cab42e14aa57edfe9ce542f8a2e2b6c7a8fc3'
    },
    {
      id: 2,
      nombre: 'Presupuesto participativo 2024',
      fecha: '28 abril 2025',
      estado: 'Verificado',
      hash: 'a8b9c2d1e3f4567890abcdef123456789012345678901234567890abcdef1234'
    },
    {
      id: 3,
      nombre: 'Mejoras urbanas distrito 5',
      fecha: '15 marzo 2025',
      estado: 'Verificado',
      hash: 'def123456789abcdef1234567890abcdef123456789abcdef1234567890abcde'
    }
  ])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Perfil de usuario</h1>
        <p className="text-gray-600">Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            {/* Avatar */}
            <div className="text-center mb-6">
              <div 
                className="w-32 h-32 mx-auto rounded-full flex items-center justify-center text-3xl font-bold text-white mb-4"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {userData.iniciales}
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{userData.nombre}</h2>
              <p className="text-gray-600 mb-3">{userData.email}</p>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {userData.rol}
              </span>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <Link 
                href="/user/configuracion" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors block text-center"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Editar perfil
              </Link>
              <button className="w-full text-red-600 hover:text-red-700 font-medium py-2 px-4 border border-red-300 rounded-lg hover:bg-red-50 transition-colors">
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Información personal</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre completo
                  </label>
                  <p className="text-gray-900 font-medium">{userData.nombre}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo electrónico
                  </label>
                  <p className="text-gray-900 font-medium">{userData.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DNI
                  </label>
                  <p className="text-gray-900 font-medium">{userData.dni}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol en la plataforma
                  </label>
                  <p className="text-gray-900 font-medium">{userData.rol}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de registro
                  </label>
                  <p className="text-gray-900 font-medium">{userData.fechaRegistro}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado de la cuenta
                  </label>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Verificada
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Voting Statistics */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Estadísticas de participación</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">8</div>
                  <div className="text-sm text-gray-600">Votaciones participadas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
                  <div className="text-sm text-gray-600">Tasa de participación</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
                  <div className="text-sm text-gray-600">Votaciones activas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Voting History */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Historial reciente de votaciones</h3>
              <Link 
                href="/user/historial" 
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Ver todo →
              </Link>
            </div>
            <div className="divide-y divide-gray-200">
              {recentVotes.map((vote) => (
                <div key={vote.id} className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{vote.nombre}</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ {vote.estado}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Fecha:</strong> {vote.fecha}
                  </p>
                  <div className="text-xs text-gray-500">
                    <strong>Hash de validación:</strong>
                    <div className="mt-1 font-mono bg-gray-50 p-2 rounded border text-xs break-all">
                      {vote.hash}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
