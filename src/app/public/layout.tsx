'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/public', label: 'Inicio' },
    { href: '/public/votaciones', label: 'Votaciones' },
    { href: '/public/resultados', label: 'Resultados' },
    { href: '/public/panel-publico', label: 'Panel público' },
    { href: '/public/validar', label: 'Validar' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/public" className="flex items-center">
                <h1 className="text-xl font-bold text-blue-600" style={{ fontFamily: 'Montserrat', color: 'var(--color-primary)' }}>
                  VoteChain
                </h1>
                <span className="ml-3 text-sm text-gray-500">Democracia digital segura</span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Iniciar sesión
              </Link>
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

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <h2 className="text-lg font-bold text-blue-600">VoteChain</h2>
              <span className="ml-2 text-sm text-gray-500">Democracia digital segura</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Términos de uso
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Privacidad
              </Link>
              <Link href="#" className="text-sm text-gray-500 hover:text-gray-700">
                Contacto
              </Link>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
            © 2025 VoteChain. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
