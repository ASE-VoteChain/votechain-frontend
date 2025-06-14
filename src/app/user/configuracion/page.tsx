'use client';

import { useState } from 'react';
import { 
  Lock, 
  Shield, 
  Bell, 
  UserCheck, 
  Eye, 
  EyeOff, 
  Key, 
  Save, 
  Info,
  Globe,
  Users,
  UserLock,
  RefreshCw
} from 'lucide-react';

export default function ConfiguracionPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState('app');
  
  const [notifications, setNotifications] = useState({
    newVotations: true,
    results: true,
    emailConfirmations: false,
    reminders: true
  });
  
  const [visibility, setVisibility] = useState('public');
  const [activeSection, setActiveSection] = useState('seguridad');

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    
    let score = 0;
    if (password.length >= 8) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;
    
    if (score <= 25) return { strength: score, label: 'Débil', color: 'bg-red-500' };
    if (score <= 50) return { strength: score, label: 'Media', color: 'bg-yellow-500' };
    if (score <= 75) return { strength: score, label: 'Buena', color: 'bg-blue-500' };
    return { strength: score, label: 'Fuerte', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const menuItems = [
    { id: 'seguridad', label: 'Seguridad', icon: Lock },
    { id: 'verificacion', label: 'Verificación en dos pasos', icon: Shield },
    { id: 'notificaciones', label: 'Notificaciones', icon: Bell },
    { id: 'privacidad', label: 'Privacidad', icon: UserCheck }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <Lock className="inline w-8 h-8 text-blue-600 mr-3" />
          Configuración de cuenta
        </h1>
        <div className="text-sm text-gray-500">
          <span>Inicio</span>
          <span className="mx-2">/</span>
          <span className="font-medium text-gray-900">Configuración</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Menú lateral */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <RefreshCw className="w-5 h-5 mr-2" />
              Menú de configuración
            </h3>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenido principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sección Seguridad */}
          {activeSection === 'seguridad' && (
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Lock className="w-5 h-5 text-blue-600 mr-2" />
                  Seguridad
                </h2>
              </div>
              <div className="p-6">
                <form className="space-y-6">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña actual
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ingrese su contraseña actual"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-2">
                        Nueva contraseña
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          id="new-password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ingrese nueva contraseña"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p className="mt-2 text-sm text-gray-500 flex items-center">
                        <Info className="w-4 h-4 mr-1" />
                        La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas y números.
                      </p>
                    </div>

                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar nueva contraseña
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirm-password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Confirme nueva contraseña"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {newPassword && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Fortaleza de contraseña</span>
                        <span className={`text-sm font-medium ${
                          passwordStrength.strength <= 25 ? 'text-red-600' :
                          passwordStrength.strength <= 50 ? 'text-yellow-600' :
                          passwordStrength.strength <= 75 ? 'text-blue-600' : 'text-green-600'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Key className="w-4 h-4 mr-2" />
                      Cambiar contraseña
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Sección Verificación en dos pasos */}
          {activeSection === 'verificacion' && (
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  Verificación en dos pasos
                </h2>
              </div>
              <div className="p-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <Info className="w-5 h-5 text-blue-500 mr-2" />
                    <div>
                      <strong className="text-blue-800">Recomendado:</strong>
                      <span className="text-blue-700"> La verificación en dos pasos añade una capa extra de seguridad a tu cuenta.</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg mb-6">
                  <div>
                    <h3 className="font-semibold text-blue-900">Estado de verificación en dos pasos</h3>
                    <p className="text-blue-700">Protege tu cuenta con una capa adicional de seguridad</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={twoFactorEnabled}
                      onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label htmlFor="verification-method" className="block text-sm font-medium text-gray-700 mb-2">
                    Método de verificación
                  </label>
                  <select
                    id="verification-method"
                    value={verificationMethod}
                    onChange={(e) => setVerificationMethod(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="app">Aplicación de autenticación</option>
                    <option value="sms">SMS</option>
                    <option value="email">Correo electrónico</option>
                  </select>
                </div>

                <div className="flex justify-end mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sección Notificaciones */}
          {activeSection === 'notificaciones' && (
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Bell className="w-5 h-5 text-blue-600 mr-2" />
                  Notificaciones
                </h2>
              </div>
              <div className="p-6 space-y-6">
                {[
                  {
                    key: 'newVotations',
                    label: 'Recibir notificaciones de nuevas votaciones',
                    description: 'Te notificaremos cuando se cree una nueva votación en la que puedas participar.',
                    icon: Bell
                  },
                  {
                    key: 'results',
                    label: 'Recibir notificaciones de resultados',
                    description: 'Te notificaremos cuando finalice una votación en la que hayas participado.',
                    icon: Info
                  },
                  {
                    key: 'emailConfirmations',
                    label: 'Confirmaciones por correo electrónico',
                    description: 'Recibirás un correo electrónico de confirmación cada vez que emitas un voto.',
                    icon: Bell
                  },
                  {
                    key: 'reminders',
                    label: 'Recordatorios de votaciones pendientes',
                    description: 'Te enviaremos recordatorios de votaciones que aún no hayas completado.',
                    icon: Bell
                  }
                ].map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <div key={notification.key} className="p-4 rounded-lg hover:bg-blue-50 transition-colors">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={notification.key}
                            type="checkbox"
                            checked={notifications[notification.key as keyof typeof notifications]}
                            onChange={(e) => setNotifications(prev => ({
                              ...prev,
                              [notification.key]: e.target.checked
                            }))}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                        </div>
                        <div className="ml-3">
                          <label htmlFor={notification.key} className="font-medium text-gray-900 cursor-pointer">
                            {notification.label}
                          </label>
                          <p className="text-sm text-gray-500 flex items-center mt-1">
                            <Icon className="w-4 h-4 mr-1 text-blue-500" />
                            {notification.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-end">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Save className="w-4 h-4 mr-2" />
                    Actualizar preferencias
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Sección Privacidad */}
          {activeSection === 'privacidad' && (
            <div className="bg-white rounded-lg shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <UserCheck className="w-5 h-5 text-blue-600 mr-2" />
                  Privacidad
                </h2>
              </div>
              <div className="p-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center">
                    <Info className="w-5 h-5 text-yellow-500 mr-2" />
                    <div>
                      <strong className="text-yellow-800">Importante:</strong>
                      <span className="text-yellow-700"> La configuración de privacidad puede afectar cómo se muestra tu información en el sistema.</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Visibilidad de perfil
                  </label>
                  <div className="space-y-4">
                    {[
                      {
                        value: 'public',
                        label: 'Público',
                        description: 'Tu nombre y participación en votaciones serán visibles para todos los usuarios.',
                        icon: Globe
                      },
                      {
                        value: 'limited',
                        label: 'Limitado',
                        description: 'Solo se mostrará tu participación en votaciones sin revelar tu nombre.',
                        icon: Users
                      },
                      {
                        value: 'private',
                        label: 'Privado',
                        description: 'Tu información solo será visible para administradores del sistema.',
                        icon: UserLock
                      }
                    ].map((option) => {
                      const Icon = option.icon;
                      return (
                        <div key={option.value} className="p-4 rounded-lg hover:bg-blue-50 transition-colors">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id={option.value}
                                name="visibility"
                                type="radio"
                                value={option.value}
                                checked={visibility === option.value}
                                onChange={(e) => setVisibility(e.target.value)}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                              />
                            </div>
                            <div className="ml-3">
                              <label htmlFor={option.value} className="font-medium text-gray-900 cursor-pointer flex items-center">
                                <Icon className="w-4 h-4 mr-2 text-blue-500" />
                                {option.label}
                              </label>
                              <p className="text-sm text-gray-500 mt-1">
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6">
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Restablecer
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Save className="w-4 h-4 mr-2" />
                    Guardar cambios
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
