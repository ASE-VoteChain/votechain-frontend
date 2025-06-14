'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Calendar, 
  Info
} from 'lucide-react';

interface OpcionVotacion {
  id: string;
  texto: string;
}

export default function CrearVotacionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Estados del formulario
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [fechaCierre, setFechaCierre] = useState('');
  const [horaCierre, setHoraCierre] = useState('');
  const [tipo, setTipo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [visibilidad, setVisibilidad] = useState<'publica' | 'privada'>('publica');
  const [opciones, setOpciones] = useState<OpcionVotacion[]>([
    { id: '1', texto: '' },
    { id: '2', texto: '' }
  ]);
  const [permitirMultiple, setPermitirMultiple] = useState(false);
  const [requiereVerificacion, setRequiereVerificacion] = useState(true);
  const [ubicacion, setUbicacion] = useState('');  const [organizador, setOrganizador] = useState('');

  const tiposVotacion = [
    { value: 'eleccion', label: 'Elección de representantes' },
    { value: 'consulta', label: 'Consulta ciudadana' },
    { value: 'presupuesto', label: 'Asignación de presupuesto' },
    { value: 'propuesta', label: 'Aprobación de propuestas' },
    { value: 'referendum', label: 'Referéndum' }
  ];

  const categorias = [
    'Representación',
    'Presupuesto',
    'Seguridad',
    'Infraestructura',
    'Educación',
    'Salud',
    'Medio ambiente',
    'Transporte',
    'Cultura',
    'Deportes',
    'Administración',
    'Otro'
  ];

  const agregarOpcion = () => {
    const nuevoId = (opciones.length + 1).toString();
    setOpciones([...opciones, { id: nuevoId, texto: '' }]);
  };

  const eliminarOpcion = (id: string) => {
    if (opciones.length > 2) {
      setOpciones(opciones.filter(opcion => opcion.id !== id));
    }
  };

  const actualizarOpcion = (id: string, texto: string) => {
    setOpciones(opciones.map(opcion => 
      opcion.id === id ? { ...opcion, texto } : opcion
    ));
  };

  const handleSubmit = async (e: React.FormEvent, saveAsDraft = false) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validaciones
      if (!titulo.trim()) {
        alert('El título es obligatorio');
        return;
      }

      if (!descripcion.trim()) {
        alert('La descripción es obligatoria');
        return;
      }

      if (!tipo) {
        alert('Selecciona un tipo de votación');
        return;
      }

      if (!saveAsDraft) {
        if (!fechaInicio || !fechaCierre) {
          alert('Las fechas de inicio y cierre son obligatorias');
          return;
        }

        if (new Date(fechaCierre) <= new Date(fechaInicio)) {
          alert('La fecha de cierre debe ser posterior a la fecha de inicio');
          return;
        }
      }

      const opcionesValidas = opciones.filter(opcion => opcion.texto.trim());
      if (opcionesValidas.length < 2) {
        alert('Debe haber al menos 2 opciones válidas');
        return;
      }

      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1500));

      const nuevaVotacion = {
        titulo,
        descripcion,
        fechaInicio: fechaInicio + (horaInicio ? `T${horaInicio}:00Z` : ''),
        fechaCierre: fechaCierre + (horaCierre ? `T${horaCierre}:00Z` : ''),
        tipo,
        categoria,
        visibilidad,
        opciones: opcionesValidas,
        permitirMultiple,
        requiereVerificacion,
        ubicacion,
        organizador,
        estado: saveAsDraft ? 'borrador' : 'programada'
      };

      console.log('Nueva votación:', nuevaVotacion);

      router.push('/admin/votaciones');
    } catch (error) {
      console.error('Error al crear votación:', error);
      alert('Error al crear la votación. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Crear nueva votación</h1>
        <p className="text-gray-600 mt-2">
          Configura todos los detalles de la votación antes de publicarla
        </p>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-8">
        {/* Información básica */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Información básica</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Título */}
            <div>
              <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-2">
                Título de la votación *
              </label>
              <input
                type="text"
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Elección de delegados estudiantiles"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                id="descripcion"
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Breve explicación del propósito de la votación..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Tipo y categoría */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de votación *
                </label>
                <select
                  id="tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Seleccionar tipo...</option>
                  {tiposVotacion.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  id="categoria"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar categoría...</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Organizador y ubicación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="organizador" className="block text-sm font-medium text-gray-700 mb-2">
                  Organizador
                </label>
                <input
                  type="text"
                  id="organizador"
                  value={organizador}
                  onChange={(e) => setOrganizador(e.target.value)}
                  placeholder="Ej. Junta de Acción Comunal"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-2">
                  Ubicación/Ámbito
                </label>
                <input
                  type="text"
                  id="ubicacion"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  placeholder="Ej. Municipal - Toda la ciudad"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fechas y horarios */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Fechas y horarios
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha y hora de inicio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Inicio de la votación
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Fecha y hora de cierre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cierre de la votación
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={fechaCierre}
                  onChange={(e) => setFechaCierre(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="time"
                  value={horaCierre}
                  onChange={(e) => setHoraCierre(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Opciones de votación */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Opciones de votación</h2>
          
          <div className="space-y-4">
            {opciones.map((opcion, index) => (
              <div key={opcion.id} className="flex items-center space-x-3">
                <span className="text-sm text-gray-500 w-8">#{index + 1}</span>
                <input
                  type="text"
                  value={opcion.texto}
                  onChange={(e) => actualizarOpcion(opcion.id, e.target.value)}
                  placeholder={`Opción ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {opciones.length > 2 && (
                  <button
                    type="button"
                    onClick={() => eliminarOpcion(opcion.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            
            <button
              type="button"
              onClick={agregarOpcion}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir otra opción
            </button>
          </div>
        </div>

        {/* Configuración */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración</h2>
          
          <div className="space-y-6">
            {/* Visibilidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Visibilidad
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visibilidad"
                    value="publica"
                    checked={visibilidad === 'publica'}
                    onChange={(e) => setVisibilidad(e.target.value as 'publica' | 'privada')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    <span className="font-medium">Pública</span> - Visible para todos los usuarios
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="visibilidad"
                    value="privada"
                    checked={visibilidad === 'privada'}
                    onChange={(e) => setVisibilidad(e.target.value as 'publica' | 'privada')}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    <span className="font-medium">Privada</span> - Solo visible para participantes autorizados
                  </span>
                </label>
              </div>
            </div>

            {/* Opciones adicionales */}
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={permitirMultiple}
                  onChange={(e) => setPermitirMultiple(e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Permitir selección múltiple
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={requiereVerificacion}
                  onChange={(e) => setRequiereVerificacion(e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500 rounded"
                />
                <span className="ml-3 text-sm text-gray-700">
                  Requiere verificación de identidad
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Información importante */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Información importante:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Una vez publicada, la votación no podrá ser eliminada, solo editada antes de que inicie.</li>
                <li>Los resultados serán públicos automáticamente después del cierre.</li>
                <li>Puedes guardar como borrador para continuar editando más tarde.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </button>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar borrador
            </button>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Crear votación
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
