'use client';

import Link from 'next/link';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

export default function AccesoDenegadoPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-16 w-16 text-red-500" />
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Acceso Denegado
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            No tienes permisos para acceder a esta página
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">
                Tu cuenta no tiene los permisos necesarios para acceder a esta sección del sistema.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                ¿Qué puedes hacer?
              </h3>
              
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Verificar que has iniciado sesión con la cuenta correcta</li>
                <li>• Contactar al administrador del sistema</li>
                <li>• Regresar a la página principal</li>
              </ul>
            </div>

            <div className="mt-8 space-y-3">
              <Link
                href="/user/dashboard"
                className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Ir al Dashboard
              </Link>
              
              <button
                onClick={() => window.history.back()}
                className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Regresar
              </button>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              Si consideras que esto es un error, contacta al soporte técnico.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}