'use client';

import PublicNavbar from '@/components/PublicNavbar';
import { ReactNode } from 'react';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 VoteChain. Todos los derechos reservados.</p>
            <p className="mt-2 text-sm">
              Plataforma de votación digital segura basada en blockchain
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
