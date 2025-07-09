'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CalendarDays, 
  MapPin, 
  User, 
  FileText, 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Save
} from 'lucide-react';
import useUser from '@/hooks/useUser';
import votacionService, { CreateVotacionRequest, VotacionOpcion } from '@/lib/votacionService';

export default function CrearVotacionPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  
  // Form state
  const [formData, setFormData] = useState<CreateVotacionRequest>({
    titulo: '',
    descripcion: '',
    categoria: 'GENERAL',
    estado: 'ABIERTA',
    prioridad: 'MEDIA',
    fechaInicio: '',
    fechaFin: '',
    ubicacion: '',
    organizador: '',
    requisitos: '',
    opciones: [
      { titulo: '', descripcion: '', orden: 1 },
      { titulo: '', descripcion: '', orden: 2 }
    ]
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Set default organizador when user loads
  useEffect(() => {
    if (user && !formData.organizador) {
      setFormData(prev => ({
        ...prev,
        organizador: `${user.firstName} ${user.lastName}` || user.email || 'Usuario'
      }));
    }
  }, [user, formData.organizador]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, userLoading, router]);

  const handleInputChange = (field: keyof CreateVotacionRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleOptionChange = (index: number, field: keyof VotacionOpcion, value: string) => {
    const newOpciones = [...formData.opciones];
    newOpciones[index] = {
      ...newOpciones[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      opciones: newOpciones
    }));

    // Clear validation error
    if (validationErrors[`option-${index}-${String(field)}`]) {
      setValidationErrors(prev => ({
        ...prev,
        [`option-${index}-${String(field)}`]: ''
      }));
    }
  };

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      opciones: [...prev.opciones, { 
        titulo: '', 
        descripcion: '', 
        orden: prev.opciones.length + 1 
      }]
    }));
  };

  const removeOption = (index: number) => {
    if (formData.opciones.length > 2) {
      const newOpciones = formData.opciones.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        opciones: newOpciones
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Basic field validation
    if (!formData.titulo.trim()) errors.titulo = 'El título es requerido';
    if (!formData.descripcion.trim()) errors.descripcion = 'La descripción es requerida';
    if (!formData.categoria) errors.categoria = 'La categoría es requerida';
    if (!formData.fechaInicio) errors.fechaInicio = 'La fecha de inicio es requerida';
    if (!formData.fechaFin) errors.fechaFin = 'La fecha de fin es requerida';
    if (!formData.ubicacion?.trim()) errors.ubicacion = 'La ubicación es requerida';
    if (!formData.organizador?.trim()) errors.organizador = 'El organizador es requerido';

    // Date validation
    if (formData.fechaInicio && formData.fechaFin) {
      const inicio = new Date(formData.fechaInicio);
      const fin = new Date(formData.fechaFin);
      const now = new Date();
      
      if (inicio < now) {
        errors.fechaInicio = 'La fecha de inicio debe ser futura';
      }
      if (fin <= inicio) {
        errors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    // Options validation
    const validOptions = formData.opciones.filter(op => op.titulo.trim());
    if (validOptions.length < 2) {
      errors.opciones = 'Se requieren al menos 2 opciones válidas';
    }

    formData.opciones.forEach((option, index) => {
      if (!option.titulo.trim()) {
        errors[`option-${index}-titulo`] = 'El texto de la opción es requerido';
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Por favor corrige los errores en el formulario');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newVotacion = await votacionService.createVotacion(formData);
      console.log('Votación creada:', newVotacion);
      
      setSuccess(true);
      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push('/user/public-stats');
      }, 2000);
    } catch (err) {
      console.error('Error creating votacion:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión. Intenta nuevamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600">Verificando permisos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Votación Creada!</h2>
          <p className="text-gray-600 mb-4">La votación se ha creado exitosamente.</p>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <p>Redirigiendo...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 px-6 py-4 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-white" />
              <div>
                <h1 className="text-2xl font-bold text-white">Crear Nueva Votación</h1>
                <p className="text-blue-100 text-sm">Configura los detalles de tu votación</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <p className="text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información Básica */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <User className="w-5 h-5 text-blue-600 mr-2" />
                  Información Básica
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => handleInputChange('titulo', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                        validationErrors.titulo ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Título descriptivo de la votación"
                    />
                    {validationErrors.titulo && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.titulo}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría *
                    </label>
                    <select
                      value={formData.categoria}
                      onChange={(e) => handleInputChange('categoria', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                        validationErrors.categoria ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Selecciona una categoría</option>
                      <option value="GENERAL">General</option>
                      <option value="INSTITUCIONAL">Institucional</option>
                      <option value="POLITICA">Política</option>
                      <option value="EDUCATIVA">Educativa</option>
                      <option value="COMUNITARIA">Comunitaria</option>
                      <option value="EMPRESARIAL">Empresarial</option>
                      <option value="OTRA">Otra</option>
                    </select>
                    {validationErrors.categoria && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.categoria}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FileText className="w-5 h-5 text-green-600 mr-2" />
                  Descripción
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe tu votación *
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-black resize-none ${
                      validationErrors.descripcion ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describe la votación, su propósito y contexto..."
                  />
                  {validationErrors.descripcion && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.descripcion}</p>
                  )}
                </div>
              </div>

              {/* Estado y Prioridad */}
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Settings className="w-5 h-5 text-purple-600 mr-2" />
                  Configuración
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={formData.estado}
                      onChange={(e) => handleInputChange('estado', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    >
                      <option value="CREADA">Creada</option>
                      <option value="ABIERTA">Abierta</option>
                      <option value="CERRADA">Cerrada</option>
                      <option value="SUSPENDIDA">Suspendida</option>
                      <option value="CANCELADA">Cancelada</option>
                      <option value="PROXIMA">Próxima</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Prioridad
                    </label>
                    <select
                      value={formData.prioridad}
                      onChange={(e) => handleInputChange('prioridad', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    >
                      <option value="BAJA">Baja</option>
                      <option value="MEDIA">Media</option>
                      <option value="ALTA">Alta</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Fechas */}
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <CalendarDays className="w-5 h-5 text-orange-600 mr-2" />
                  Fechas de Votación
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.fechaInicio}
                      onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black ${
                        validationErrors.fechaInicio ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.fechaInicio && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.fechaInicio}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Fin *
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.fechaFin}
                      onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-black ${
                        validationErrors.fechaFin ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {validationErrors.fechaFin && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.fechaFin}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ubicación y Organizador */}
              <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 text-teal-600 mr-2" />
                  Ubicación y Organizador
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación *
                    </label>
                    <input
                      type="text"
                      value={formData.ubicacion}
                      onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black ${
                        validationErrors.ubicacion ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Virtual / Presencial / Ubicación específica"
                    />
                    {validationErrors.ubicacion && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.ubicacion}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Organizador *
                    </label>
                    <input
                      type="text"
                      value={formData.organizador}
                      onChange={(e) => handleInputChange('organizador', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black ${
                        validationErrors.organizador ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Nombre completo del organizador"
                    />
                    {validationErrors.organizador && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.organizador}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Requisitos */}
              <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FileText className="w-5 h-5 text-amber-600 mr-2" />
                  Requisitos para Participar
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe los requisitos (opcional)
                  </label>
                  <textarea
                    value={formData.requisitos}
                    onChange={(e) => handleInputChange('requisitos', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-black resize-none"
                    placeholder="Ej: Mayor de edad, Empleado activo, Miembro de la comunidad..."
                  />
                </div>
              </div>

              {/* Opciones de Votación */}
              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <CheckCircle className="w-5 h-5 text-indigo-600 mr-2" />
                    Opciones de Votación
                  </h2>
                  <button
                    type="button"
                    onClick={addOption}
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar Opción</span>
                  </button>
                </div>

                {validationErrors.opciones && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">{validationErrors.opciones}</p>
                  </div>
                )}

                <div className="space-y-3">
                  {formData.opciones.map((option, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-gray-700">Opción {index + 1}</h4>
                        {formData.opciones.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Eliminar</span>
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Texto de la Opción *
                          </label>
                          <input
                            type="text"
                            value={option.titulo}
                            onChange={(e) => handleOptionChange(index, 'titulo', e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black ${
                              validationErrors[`option-${index}-titulo`] ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder={`Opción ${index + 1}`}
                          />
                          {validationErrors[`option-${index}-titulo`] && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors[`option-${index}-titulo`]}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                          </label>
                          <input
                            type="text"
                            value={option.descripcion}
                            onChange={(e) => handleOptionChange(index, 'descripcion', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                            placeholder="Información adicional..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => router.push('/user/public-stats')}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>Creando...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Crear Votación</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}