'use client';

import { useState } from 'react';
import { 
  Save, 
  Settings, 
  Shield, 
  Database, 
  Mail, 
  Bell, 
  Globe,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Download,
  Upload,
  Trash2
} from 'lucide-react';

export default function AdminConfiguracionPage() {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // Estados de configuración
  const [nombreSistema, setNombreSistema] = useState('VoteChain');
  const [descripcionSistema, setDescripcionSistema] = useState('Sistema de votación digital segura');
  const [emailAdmin, setEmailAdmin] = useState('admin@votechain.com');
  const [urlPublica, setUrlPublica] = useState('https://votechain.example.com');
  const [idiomaPredeterminado, setIdiomaPredeterminado] = useState('es');
  const [zonaHoraria, setZonaHoraria] = useState('America/Bogota');
  
  // Configuración de seguridad
  const [require2FA, setRequire2FA] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(30);
  const [passwordMinLength, setPasswordMinLength] = useState(8);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(3);
  const [encryptionEnabled, setEncryptionEnabled] = useState(true);
  
  // Configuración de blockchain
  const [blockchainNetwork, setBlockchainNetwork] = useState('ethereum');
  const [gasLimit, setGasLimit] = useState(500000);
  const [confirmationsRequired, setConfirmationsRequired] = useState(6);
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  
  // Configuración de notificaciones
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [adminAlerts, setAdminAlerts] = useState(true);
  
  const handleSave = async () => {
    setSaving(true);
    
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí iría la lógica real de guardado
      console.log('Configuración guardada');
      
      // Mostrar mensaje de éxito
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      // Simular backup
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Backup iniciado exitosamente');    } catch {
      alert('Error al iniciar backup');
    }
  };

  const handleRestore = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.sql';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Simular restauración
        alert(`Restaurando desde: ${file.name}`);
      }
    };
    input.click();
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'seguridad', label: 'Seguridad', icon: Shield },
    { id: 'blockchain', label: 'Blockchain', icon: Database },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'backup', label: 'Backup', icon: Download }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
          <p className="text-gray-600 mt-1">
            Administra la configuración global de VoteChain
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Guardando...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Guardar cambios
            </>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Contenido de tabs */}
      <div className="space-y-6">
        {/* Tab General */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Configuración general</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del sistema
                  </label>
                  <input
                    type="text"
                    value={nombreSistema}
                    onChange={(e) => setNombreSistema(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email del administrador
                  </label>
                  <input
                    type="email"
                    value={emailAdmin}
                    onChange={(e) => setEmailAdmin(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción del sistema
                  </label>
                  <textarea
                    rows={3}
                    value={descripcionSistema}
                    onChange={(e) => setDescripcionSistema(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL pública
                  </label>
                  <input
                    type="url"
                    value={urlPublica}
                    onChange={(e) => setUrlPublica(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zona horaria
                  </label>
                  <select
                    value={zonaHoraria}
                    onChange={(e) => setZonaHoraria(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="America/Bogota">América/Bogotá (COT)</option>
                    <option value="America/Mexico_City">América/Ciudad de México (CST)</option>
                    <option value="America/New_York">América/Nueva York (EST)</option>
                    <option value="Europe/Madrid">Europa/Madrid (CET)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idioma predeterminado
                  </label>
                  <select
                    value={idiomaPredeterminado}
                    onChange={(e) => setIdiomaPredeterminado(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="pt">Português</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Seguridad */}
        {activeTab === 'seguridad' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Configuración de seguridad
              </h3>
              
              <div className="space-y-6">
                {/* Autenticación */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-4">Autenticación</h4>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={require2FA}
                        onChange={(e) => setRequire2FA(e.target.checked)}
                        className="text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        Requerir autenticación de dos factores (2FA)
                      </span>
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tiempo de sesión (minutos)
                        </label>
                        <input
                          type="number"
                          value={sessionTimeout}
                          onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Longitud mínima de contraseña
                        </label>
                        <input
                          type="number"
                          value={passwordMinLength}
                          onChange={(e) => setPasswordMinLength(parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Máximo intentos de login
                        </label>
                        <input
                          type="number"
                          value={maxLoginAttempts}
                          onChange={(e) => setMaxLoginAttempts(parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Encriptación */}
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-4">Encriptación</h4>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={encryptionEnabled}
                      onChange={(e) => setEncryptionEnabled(e.target.checked)}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Habilitar encriptación de datos sensibles
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Blockchain */}
        {activeTab === 'blockchain' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Configuración de Blockchain
              </h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Red blockchain
                    </label>
                    <select
                      value={blockchainNetwork}
                      onChange={(e) => setBlockchainNetwork(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="ethereum">Ethereum</option>
                      <option value="polygon">Polygon</option>
                      <option value="binance">Binance Smart Chain</option>
                      <option value="avalanche">Avalanche</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Límite de gas
                    </label>
                    <input
                      type="number"
                      value={gasLimit}
                      onChange={(e) => setGasLimit(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmaciones requeridas
                    </label>
                    <input
                      type="number"
                      value={confirmationsRequired}
                      onChange={(e) => setConfirmationsRequired(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">Estado de la conexión</p>
                      <p className="text-sm text-blue-700">Conectado a {blockchainNetwork} - Último bloque: #18,234,567</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Notificaciones */}
        {activeTab === 'notificaciones' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Configuración de notificaciones
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-4">Canales de notificación</h4>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={emailNotifications}
                        onChange={(e) => setEmailNotifications(e.target.checked)}
                        className="text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <Mail className="w-4 h-4 ml-3 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-700">Notificaciones por email</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={smsNotifications}
                        onChange={(e) => setSmsNotifications(e.target.checked)}
                        className="text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <Smartphone className="w-4 h-4 ml-3 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-700">Notificaciones por SMS</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={pushNotifications}
                        onChange={(e) => setPushNotifications(e.target.checked)}
                        className="text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <Globe className="w-4 h-4 ml-3 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-700">Notificaciones push</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={adminAlerts}
                        onChange={(e) => setAdminAlerts(e.target.checked)}
                        className="text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <AlertTriangle className="w-4 h-4 ml-3 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-700">Alertas de administrador</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Backup */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                <Download className="w-5 h-5 mr-2" />
                Gestión de backups
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-4">Configuración automática</h4>
                  <div className="space-y-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={autoBackup}
                        onChange={(e) => setAutoBackup(e.target.checked)}
                        className="text-blue-600 focus:ring-blue-500 rounded"
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        Habilitar backups automáticos
                      </span>
                    </label>

                    {autoBackup && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Frecuencia de backup
                        </label>
                        <select
                          value={backupFrequency}
                          onChange={(e) => setBackupFrequency(e.target.value)}
                          className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="hourly">Cada hora</option>
                          <option value="daily">Diario</option>
                          <option value="weekly">Semanal</option>
                          <option value="monthly">Mensual</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-4">Acciones manuales</h4>
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={handleBackup}
                      className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Crear backup ahora
                    </button>

                    <button
                      onClick={handleRestore}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Restaurar desde archivo
                    </button>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-800 mb-4">Historial de backups</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-gray-900">backup_2025-06-12_10-30.sql</p>
                          <p className="text-xs text-gray-500">12 Jun 2025, 10:30 AM - 2.3 GB</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 text-sm">Descargar</button>
                          <button className="text-red-600 hover:text-red-700 text-sm">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-gray-900">backup_2025-06-11_10-30.sql</p>
                          <p className="text-xs text-gray-500">11 Jun 2025, 10:30 AM - 2.2 GB</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 text-sm">Descargar</button>
                          <button className="text-red-600 hover:text-red-700 text-sm">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Advertencia importante */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Advertencia importante:</p>
            <p>Los cambios en la configuración pueden afectar el funcionamiento del sistema. Asegúrate de entender las implicaciones antes de guardar.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
