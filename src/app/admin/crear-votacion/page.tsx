'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Plus, Trash2, Calendar, Info } from 'lucide-react';
import votacionService, {
  CreateVotacionRequest,
  VotacionOpcion
} from '../../../lib/votacionService';

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
  const [ubicacion, setUbicacion] = useState('');
  const [organizador, setOrganizador] = useState('');
  const [prioridad, setPrioridad] = useState<'ALTA' | 'MEDIA' | 'BAJA'>('ALTA');
  const [requisitos, setRequisitos] = useState('');

  const tiposVotacion = [
    { value: 'eleccion', label: 'Elección de representantes' },
    { value: 'consulta', label: 'Consulta ciudadana' },
    { value: 'presupuesto', label: 'Asignación de presupuesto' },
    { value: 'propuesta', label: 'Aprobación de propuestas' },
    { value: 'referendum', label: 'Referéndum' }
  ];

  const categorias = [
    'GENERAL',
    'INSTITUCIONAL',
    'POLITICA',
    'EDUCATIVA',
    'COMUNITARIA',
    'EMPRESARIAL',
    'OTRA'
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

    // validaciones básicas
    if (!titulo.trim()) return alert('El título es obligatorio');
    if (!descripcion.trim()) return alert('La descripción es obligatoria');
    if (!tipo) return alert('Selecciona un tipo de votación');

    if (!saveAsDraft) {
      if (!fechaInicio || !fechaCierre) return alert('Las fechas de inicio y cierre son obligatorias');
      if (new Date(fechaCierre) <= new Date(fechaInicio)) {
        return alert('La fecha de cierre debe ser posterior a la de inicio');
      }
    }

    const opcionesValidas = opciones.filter(op => op.texto.trim());
    if (opcionesValidas.length < 2) return alert('Debe haber al menos 2 opciones válidas');

    // formatear las opciones para el servicio
    const opcionesFormateadas: VotacionOpcion[] = opcionesValidas.map((op, idx) => ({
      titulo: op.texto.trim(),
      descripcion: '',
      orden: idx
    }));

    // construir payload
    const payload: CreateVotacionRequest = {
      titulo,
      descripcion,
      categoria: (categoria as CreateVotacionRequest['categoria']) || 'OTRA',
      estado: saveAsDraft ? 'PROXIMA' : 'CREADA',
      prioridad,
      fechaInicio: `${fechaInicio}T${horaInicio || '00:00'}:00Z`,
      fechaFin:    `${fechaCierre}T${horaCierre || '00:00'}:00Z`,
      ubicacion,
      organizador,
      requisitos,
      opciones: opcionesFormateadas
    };

    try {
      const newVotacion = await votacionService.createVotacion(payload);
      console.log('✅ Votación creada:', newVotacion);
      router.push('/admin/votaciones');
    } catch (err: any) {
      alert(err.message || 'Ocurrió un error al crear la votación.');
      console.error(err);
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Título *</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-black"
                placeholder="Ej. Elección de delegados"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción *</label>
              <textarea
                rows={3}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-black"
                placeholder="Breve explicación..."
              />
            </div>

            {/* Tipo y categoría */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                <select
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-black"
                >
                  <option value="">Seleccionar...</option>
                  {tiposVotacion.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-black"
                >
                  <option value="">Seleccionar...</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Organizador / Ubicación */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organizador</label>
                <input
                  type="text"
                  value={organizador}
                  onChange={(e) => setOrganizador(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                <input
                  type="text"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-black"
                />
              </div>
            </div>

            {/* Prioridad / Requisitos */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                <select
                  value={prioridad}
                  onChange={(e) => setPrioridad(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg text-black"
                >
                  <option value="ALTA">Alta</option>
                  <option value="MEDIA">Media</option>
                  <option value="BAJA">Baja</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requisitos</label>
                <textarea
                  rows={2}
                  value={requisitos}
                  onChange={(e) => setRequisitos(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-black"
                  placeholder="Ej. Ser mayor de edad..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Fechas y horarios */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Calendar className="w-5 h-5 mr-2" /> Fechas y horarios
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Inicio</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-black"
                />
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-black"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cierre</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={fechaCierre}
                  onChange={(e) => setFechaCierre(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-black"
                />
                <input
                  type="time"
                  value={horaCierre}
                  onChange={(e) => setHoraCierre(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Opciones de votación */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Opciones de votación</h2>
          <div className="space-y-4">
            {opciones.map((op, idx) => (
              <div key={op.id} className="flex items-center space-x-3">
                <span className="w-6 text-gray-500">#{idx + 1}</span>
                <input
                  type="text"
                  value={op.texto}
                  onChange={(e) => actualizarOpcion(op.id, e.target.value)}
                  placeholder={`Opción ${idx + 1}`}
                  className="flex-1 px-3 py-2 border rounded-lg text-black"
                />
                {opciones.length > 2 && (
                  <button
                    type="button"
                    onClick={() => eliminarOpcion(op.id)}
                    className="text-red-600 hover:bg-red-100 rounded px-2 py-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={agregarOpcion}
              className="inline-flex items-center text-blue-600 hover:underline text-sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Añadir opción
            </button>
          </div>
        </div>

        {/* Configuración adicional */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuración</h2>
          <div className="space-y-4">
            <label className="flex items-center text-black">
              <input
                type="checkbox"
                checked={permitirMultiple}
                onChange={(e) => setPermitirMultiple(e.target.checked)}
                className="mr-2 "
              />
              Permitir selección múltiple
            </label>
            <label className="flex items-center text-black">
              <input
                type="checkbox"
                checked={requiereVerificacion}
                onChange={(e) => setRequiereVerificacion(e.target.checked)}
                className="mr-2"
              />
              Requiere verificación de identidad
            </label>
          </div>
        </div>

        {/* Información importante */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <Info className="w-5 h-5 text-blue-600 mr-3" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Información importante:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Una vez publicada, la votación no podrá eliminarse, solo editarse antes de iniciar.</li>
                <li>Los resultados serán públicos después del cierre.</li>
                <li>Puedes guardar como borrador para continuar más tarde.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between items-center pt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center px-4 py-2 text-gray-700 border rounded-lg"
          >
            <X className="w-4 h-4 mr-2" /> Cancelar
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-gray-100 border rounded-lg disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" /> Guardar borrador
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Crear votación</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
