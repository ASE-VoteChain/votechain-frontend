'use client';

import { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Send,
  MessageCircle,
  Shield,
  HeadphonesIcon,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulamos el envío del formulario
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Contáctanos
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Estamos aquí para ayudarte con cualquier pregunta o consulta sobre VoteChain
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Email</h3>
              <p className="text-gray-600 mb-2">soporte@votechain.com</p>
              <p className="text-sm text-gray-500">Respuesta en 24 horas</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Teléfono</h3>
              <p className="text-gray-600 mb-2">+1 (555) 123-4567</p>
              <p className="text-sm text-gray-500">Lun - Vie, 9:00 - 18:00</p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Chat en Vivo</h3>
              <p className="text-gray-600 mb-2">Disponible 24/7</p>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Iniciar Chat
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Soporte Urgente</h3>
              <p className="text-gray-600 mb-2">+1 (555) 911-VOTE</p>
              <p className="text-sm text-gray-500">Solo emergencias</p>
            </div>
          </div>

          {/* Contact Form and Info */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Envíanos un Mensaje</h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-700">¡Mensaje enviado exitosamente! Te responderemos pronto.</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-700">Error al enviar el mensaje. Por favor, inténtalo de nuevo.</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Consulta
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">Consulta General</option>
                    <option value="technical">Soporte Técnico</option>
                    <option value="security">Seguridad</option>
                    <option value="partnership">Alianzas</option>
                    <option value="media">Medios de Comunicación</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Asunto *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe brevemente tu consulta"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Cuéntanos más detalles sobre tu consulta..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Enviar Mensaje</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Company Info */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Información de Contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Oficina Principal</p>
                      <p className="text-gray-600">
                        123 Tech Avenue<br />
                        Silicon Valley, CA 94025<br />
                        Estados Unidos
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900">Horarios de Atención</p>
                      <p className="text-gray-600">
                        Lunes - Viernes: 9:00 AM - 6:00 PM PST<br />
                        Sábado: 10:00 AM - 2:00 PM PST<br />
                        Domingo: Cerrado
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-8">
                <div className="flex items-start space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-blue-600 mt-1" />
                  <h3 className="text-xl font-semibold text-gray-900">Reportes de Seguridad</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Si has encontrado una vulnerabilidad de seguridad, por favor repórtala de forma responsable.
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Email: security@votechain.com<br />
                  PGP Key: Disponible en nuestro sitio web
                </p>
                <p className="text-xs text-gray-500">
                  Valoramos la divulgación responsable y trabajamos con investigadores de seguridad 
                  para proteger nuestra plataforma.
                </p>
              </div>

              <div className="bg-green-50 rounded-lg p-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Tiempo de Respuesta</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Consultas Generales:</span>
                    <span className="font-medium text-gray-900">24 horas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Soporte Técnico:</span>
                    <span className="font-medium text-gray-900">4-8 horas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Incidentes de Seguridad:</span>
                    <span className="font-medium text-gray-900">1 hora</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Emergencias:</span>
                    <span className="font-medium text-gray-900">Inmediato</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
