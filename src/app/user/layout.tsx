'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ReactNode } from 'react'

interface UserLayoutProps {
  children: ReactNode
}

export default function UserLayout({ children }: UserLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  
  // Datos mock - en una aplicación real vendrían de contexto/API
  const title = "Panel de usuario"
  const userName = "Sebastián Ramírez"

  const handleLogout = () => {
    // Aquí iría la lógica de logout
    router.push('/auth/login')
  }

  const navItems = [
    { href: '/user/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/user/votaciones', label: 'Votaciones', icon: '🗳️' },
    { href: '/user/resultados', label: 'Resultados', icon: '📊' },
    { href: '/user/perfil', label: 'Perfil', icon: '👤' },
    { href: '/user/historial', label: 'Historial', icon: '📋' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/user/dashboard" className="flex items-center">
                <h1 className="text-xl font-bold text-blue-600" style={{ fontFamily: 'Montserrat', color: 'var(--color-primary)' }}>
                  VoteChain
                </h1>
                <span className="ml-3 text-sm text-gray-500">{title}</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bienvenido, <strong>{userName}</strong>
              </span>
              <div className="relative group">
                <button className="flex items-center text-sm bg-white border border-gray-300 rounded-md px-3 py-2 hover:bg-gray-50 transition-colors">
                  Mi cuenta
                  <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="py-1">
                    <Link href="/user/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      👤 Mi perfil
                    </Link>                    <Link href="/user/historial" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      📋 Historial
                    </Link>
                    <Link href="/user/configuracion" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                      ⚙️ Configuración
                    </Link>
                    <div className="border-t border-gray-100"></div>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                    >
                      🚪 Cerrar sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 pb-4 text-sm font-medium transition-colors border-b-2 ${
                  pathname === item.href
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
