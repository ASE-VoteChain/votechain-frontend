'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import useUser from '@/hooks/useUser'
import AuthService from '@/lib/auth'

export default function Navbar() {
  const { user, loading } = useUser()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    AuthService.logout()
    router.push('/auth/login')
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'U'
    const first = firstName?.charAt(0) || ''
    const last = lastName?.charAt(0) || ''
    return `${first}${last}`.toUpperCase()
  }

  const getFullName = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'Usuario'
    return `${firstName || ''} ${lastName || ''}`.trim()
  }

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/user/public-stats" className="flex items-center">
              <h1 className="text-xl font-bold" 
                  style={{ 
                    fontFamily: 'Montserrat', 
                    color: 'var(--color-primary)' 
                  }}>
                VoteChain
              </h1>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                href="/user/public-stats"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/user/votaciones"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Votaciones
              </Link>
              <Link
                href="/user/crear-votacion"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Crear Votación
              </Link>
              <Link
                href="/user/historial"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Historial
              </Link>
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center">
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="animate-pulse bg-gray-300 h-8 w-8 rounded-full"></div>
                <div className="animate-pulse bg-gray-300 h-4 w-20 rounded"></div>
              </div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                  <span className="font-medium hidden sm:block">
                    {getFullName(user.firstName, user.lastName)}
                  </span>
                  <svg 
                    className="w-4 h-4 hidden sm:block" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {getFullName(user.firstName, user.lastName)}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Link
                      href="/user/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Mi Perfil
                    </Link>
                    <Link
                      href="/user/configuracion"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      Configuración
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Iniciar Sesión
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                href="/user/public-stats"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/user/votaciones"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Votaciones
              </Link>
              <Link
                href="/user/crear-votacion"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Crear Votación
              </Link>
              <Link
                href="/user/historial"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Historial
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </nav>
  )
}
