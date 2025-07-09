'use client';

import { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Shield, 
  Vote, 
  Users, 
  Lock,
  Search,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'seguridad' | 'tecnico' | 'proceso';
}

const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'general',
    question: '¿Qué es VoteChain?',
    answer: 'VoteChain es una plataforma de votación digital que utiliza tecnología blockchain para garantizar la seguridad, transparencia e inmutabilidad de los procesos electorales. Permite a los usuarios votar de forma segura desde cualquier dispositivo con conexión a internet.'
  },
  {
    id: '2',
    category: 'general',
    question: '¿Es gratuito usar VoteChain?',
    answer: 'Sí, VoteChain es completamente gratuito para los votantes. Solo necesitas registrarte con una cuenta válida para participar en las votaciones disponibles.'
  },
  {
    id: '3',
    category: 'seguridad',
    question: '¿Es seguro votar en línea?',
    answer: 'Absolutamente. VoteChain utiliza encriptación de extremo a extremo, tecnología blockchain y múltiples capas de seguridad para proteger tu voto. La blockchain garantiza que tu voto no puede ser alterado, duplicado o eliminado.'
  },
  {
    id: '4',
    category: 'seguridad',
    question: '¿Mi voto es anónimo?',
    answer: 'Sí, tu voto es completamente anónimo. Aunque tu identidad se verifica durante el registro para prevenir fraudes, tu voto se separa de tu identidad antes de ser registrado en la blockchain.'
  },
  {
    id: '5',
    category: 'proceso',
    question: '¿Cómo puedo votar?',
    answer: 'El proceso es simple: 1) Regístrate en la plataforma, 2) Verifica tu identidad, 3) Selecciona la votación activa, 4) Emite tu voto, 5) Confirma tu participación. Tu voto se registrará inmediatamente en la blockchain.'
  },
  {
    id: '6',
    category: 'proceso',
    question: '¿Puedo cambiar mi voto después de enviarlo?',
    answer: 'No, una vez que tu voto se registra en la blockchain, no puede ser modificado. Esto es por diseño para garantizar la integridad del proceso electoral. Asegúrate de revisar tu selección antes de confirmar.'
  },
  {
    id: '7',
    category: 'proceso',
    question: '¿Cómo sé que mi voto fue contado?',
    answer: 'Después de votar, recibirás un código de confirmación único que puedes usar en nuestra herramienta de validación para verificar que tu voto fue registrado correctamente en la blockchain.'
  },
  {
    id: '8',
    category: 'tecnico',
    question: '¿Qué es blockchain y por qué lo usan?',
    answer: 'Blockchain es una tecnología de registro distribuido que crea un libro contable inmutable y transparente. Lo usamos porque garantiza que los votos no puedan ser alterados, proporciona transparencia total y elimina la necesidad de confiar en una autoridad central.'
  },
  {
    id: '9',
    category: 'tecnico',
    question: '¿Qué dispositivos puedo usar para votar?',
    answer: 'Puedes votar desde cualquier dispositivo con navegador web y conexión a internet: computadoras, laptops, tablets o smartphones. La plataforma es responsive y se adapta a cualquier tamaño de pantalla.'
  },
  {
    id: '10',
    category: 'seguridad',
    question: '¿Qué pasa si hay un problema técnico mientras voto?',
    answer: 'Si experimentas problemas técnicos, tu voto no se registrará hasta que confirmes exitosamente. Puedes intentar nuevamente o contactar a nuestro soporte técnico. Nunca se registrarán votos parciales o incompletos.'
  },
  {
    id: '11',
    category: 'general',
    question: '¿Quién puede crear votaciones?',
    answer: 'Las votaciones pueden ser creadas por administradores autorizados de organizaciones, instituciones educativas, empresas o entidades gubernamentales que hayan sido verificadas y aprobadas en nuestra plataforma.'
  },
  {
    id: '12',
    category: 'proceso',
    question: '¿Cuándo puedo ver los resultados?',
    answer: 'Los resultados se actualizan en tiempo real durante el período de votación. Puedes ver el progreso en vivo, y los resultados finales estarán disponibles inmediatamente después del cierre de la votación.'
  }
];

const categoryIcons = {
  general: Users,
  seguridad: Shield,
  tecnico: Lock,
  proceso: Vote
};

const categoryNames = {
  general: 'General',
  seguridad: 'Seguridad',
  tecnico: 'Técnico',
  proceso: 'Proceso de Votación'
};

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Preguntas Frecuentes
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Encuentra respuestas a las preguntas más comunes sobre VoteChain
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Todas las categorías
            </button>
            {Object.entries(categoryNames).map(([key, name]) => {
              const Icon = categoryIcons[key as keyof typeof categoryIcons];
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-full font-medium transition-colors ${
                    selectedCategory === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {filteredFAQs.map((faq) => {
              const isOpen = openItems.includes(faq.id);
              const CategoryIcon = categoryIcons[faq.category];
              
              return (
                <div key={faq.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full px-6 py-4 text-left focus:outline-none focus:bg-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          faq.category === 'general' ? 'bg-blue-100' :
                          faq.category === 'seguridad' ? 'bg-green-100' :
                          faq.category === 'tecnico' ? 'bg-purple-100' :
                          'bg-orange-100'
                        }`}>
                          <CategoryIcon className={`w-5 h-5 ${
                            faq.category === 'general' ? 'text-blue-600' :
                            faq.category === 'seguridad' ? 'text-green-600' :
                            faq.category === 'tecnico' ? 'text-purple-600' :
                            'text-orange-600'
                          }`} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {faq.question}
                        </h3>
                      </div>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                    </div>
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-4">
                      <div className="pl-12">
                        <p className="text-gray-700 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Nuestro equipo está aquí para ayudarte con cualquier pregunta adicional
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/public/contacto"
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Contactar Soporte
            </Link>
            <Link
              href="/public/validar"
              className="inline-flex items-center px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white font-semibold transition-colors"
            >
              <Search className="w-5 h-5 mr-2" />
              Validar Voto
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
