'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Vote, Menu, X, Shield, LogIn, UserPlus } from 'lucide-react';

export default function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/public" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Vote className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">VoteChain</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              href="/public" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Inicio
            </Link>
            <Link 
              href="/public/como-funciona" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Cómo Funciona
            </Link>
            <Link 
              href="/public/validar" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Validar
            </Link>
            <Link 
              href="/public/nosotros" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Nosotros
            </Link>
            <Link 
              href="/public/faq" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              FAQ
            </Link>
            <Link 
              href="/public/contacto" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
            >
              Contacto
            </Link>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Iniciar sesión
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors !text-white"
            >
              <UserPlus className="w-4 h-4 mr-2 text-white" />
              Registrarse
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/public"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/public/como-funciona"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Cómo Funciona
              </Link>
              <Link
                href="/public/validar"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Validar
              </Link>
              <Link
                href="/public/nosotros"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Nosotros
              </Link>
              <Link
                href="/public/faq"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                href="/public/contacto"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
              
              {/* Mobile Auth Buttons */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Link
                  href="/auth/login"
                  className="block w-full text-center px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <LogIn className="w-4 h-4 inline mr-2" />
                  Iniciar sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors !text-white"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <UserPlus className="w-4 h-4 inline mr-2 text-white" />
                  Registrarse
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
