'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Votación Creada!</h2>
          <p className="text-gray-600 mb-4">La votación se ha creado exitosamente.</p>
          <p className="text-sm text-gray-500">Redirigiendo al dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Crear Nueva Votación</h1>
            <p className="text-gray-600">Completa los siguientes campos para crear una nueva votación</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => handleInputChange('titulo', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    validationErrors.titulo ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Título de la votación"
                />
                {validationErrors.titulo && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.titulo}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => handleInputChange('categoria', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
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

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                  validationErrors.descripcion ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe la votación, su propósito y contexto"
              />
              {validationErrors.descripcion && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.descripcion}</p>
              )}
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridad
                </label>
                <select
                  value={formData.prioridad}
                  onChange={(e) => handleInputChange('prioridad', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio *
                </label>
                <input
                  type="datetime-local"
                  value={formData.fechaInicio}
                  onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    validationErrors.fechaInicio ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {validationErrors.fechaInicio && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.fechaInicio}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Fin *
                </label>
                <input
                  type="datetime-local"
                  value={formData.fechaFin}
                  onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    validationErrors.fechaFin ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {validationErrors.fechaFin && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.fechaFin}</p>
                )}
              </div>
            </div>

            {/* Location and Organizer */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación *
                </label>
                <input
                  type="text"
                  value={formData.ubicacion}
                  onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    validationErrors.ubicacion ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ubicación física o virtual"
                />
                {validationErrors.ubicacion && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.ubicacion}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organizador *
                </label>
                <input
                  type="text"
                  value={formData.organizador}
                  onChange={(e) => handleInputChange('organizador', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                    validationErrors.organizador ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nombre del organizador"
                />
                {validationErrors.organizador && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.organizador}</p>
                )}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requisitos
              </label>
              <textarea
                value={formData.requisitos}
                onChange={(e) => handleInputChange('requisitos', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Requisitos para participar (opcional)"
              />
            </div>

            {/* Voting Options */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Opciones de Votación *
                </label>
                <button
                  type="button"
                  onClick={addOption}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  + Agregar Opción
                </button>
              </div>

              {validationErrors.opciones && (
                <p className="mb-4 text-sm text-red-600">{validationErrors.opciones}</p>
              )}

              <div className="space-y-4">
                {formData.opciones.map((option, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-700">Opción {index + 1}</h4>
                      {formData.opciones.length > 2 && (
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Texto *
                        </label>
                        <input
                          type="text"
                          value={option.titulo}
                          onChange={(e) => handleOptionChange(index, 'titulo', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${
                            validationErrors[`option-${index}-titulo`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Texto de la opción"
                        />
                        {validationErrors[`option-${index}-titulo`] && (
                          <p className="mt-1 text-sm text-red-600">{validationErrors[`option-${index}-titulo`]}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Descripción
                        </label>
                        <input
                          type="text"
                          value={option.descripcion}
                          onChange={(e) => handleOptionChange(index, 'descripcion', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                          placeholder="Descripción adicional (opcional)"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4 pt-6">
              <button
                type="button"
                onClick={() => router.push('/user/public-stats')}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creando...' : 'Crear Votación'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
