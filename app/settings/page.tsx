'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useInsightStore } from '@/lib/store';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Database,
  Shield,
  Moon,
  Sun,
  Monitor,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Smartphone
} from 'lucide-react';

interface SettingSection {
  id: string;
  title: string;
  icon: React.ElementType;
  description: string;
}

const settingSections: SettingSection[] = [
  { id: 'profile', title: 'Profile Settings', icon: User, description: 'Manage your account information' },
  { id: 'appearance', title: 'Appearance', icon: Palette, description: 'Customize the look and feel' },
  { id: 'notifications', title: 'Notifications', icon: Bell, description: 'Configure alerts and updates' },
  { id: 'data', title: 'Data Management', icon: Database, description: 'Import, export, and manage data' },
  { id: 'security', title: 'Security', icon: Shield, description: 'Privacy and security settings' },
];

export default function SettingsPage() {
  const { data, forecast, generateData, isLoading } = useInsightStore();
  const [activeSection, setActiveSection] = useState('profile');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    forecast: true,
    updates: true,
  });
  const [privacy, setPrivacy] = useState({
    analytics: true,
    crashReports: false,
    dataSharing: false,
  });

  const handleSaveSettings = () => {
    // Save settings to localStorage or API
    localStorage.setItem('insightflow-settings', JSON.stringify({
      theme,
      notifications,
      privacy,
    }));

    // Show success message (you could add a toast notification here)
    alert('Settings saved successfully!');
  };

  const handleExportData = () => {
    const exportData = {
      data,
      forecast,
      settings: { theme, notifications, privacy },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `insightflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      setTheme('dark');
      setNotifications({ email: true, push: false, forecast: true, updates: true });
      setPrivacy({ analytics: true, crashReports: false, dataSharing: false });
      localStorage.removeItem('insightflow-settings');
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-purple-500/8 to-pink-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Sidebar />

      <main className="flex-1 p-6 overflow-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-zinc-500 text-lg mt-1">Customize your experience and manage your account</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 backdrop-blur-xl border-zinc-700/50">
                <div className="p-4">
                  <h3 className="text-sm font-medium text-zinc-300 mb-4">Settings Menu</h3>
                  <nav className="space-y-1">
                    {settingSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all ${
                          activeSection === section.id
                            ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                            : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                        }`}
                      >
                        <section.icon className="w-4 h-4" />
                        <div>
                          <div className="text-sm font-medium">{section.title}</div>
                          <div className="text-xs text-zinc-500">{section.description}</div>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>
              </Card>
            </motion.div>

            {/* Settings Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-3"
            >
              <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 backdrop-blur-xl border-zinc-700/50">
                <div className="p-6">
                  {/* Profile Settings */}
                  {activeSection === 'profile' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Profile Information</h3>
                          <p className="text-sm text-zinc-500">Update your account details</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            defaultValue="John Doe"
                            className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            defaultValue="john.doe@example.com"
                            className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Company
                          </label>
                          <input
                            type="text"
                            defaultValue="Acme Corp"
                            className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Role
                          </label>
                          <select className="w-full px-3 py-2 bg-zinc-800/50 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                            <option>Data Analyst</option>
                            <option>Business Intelligence</option>
                            <option>Product Manager</option>
                            <option>Executive</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Appearance Settings */}
                  {activeSection === 'appearance' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Palette className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Appearance</h3>
                          <p className="text-sm text-zinc-500">Customize the visual experience</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-zinc-300 mb-3">Theme</h4>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { value: 'light', icon: Sun, label: 'Light' },
                              { value: 'dark', icon: Moon, label: 'Dark' },
                              { value: 'system', icon: Monitor, label: 'System' },
                            ].map((option) => (
                              <button
                                key={option.value}
                                onClick={() => setTheme(option.value as any)}
                                className={`p-4 rounded-lg border transition-all ${
                                  theme === option.value
                                    ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                                    : 'border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:border-zinc-600'
                                }`}
                              >
                                <option.icon className="w-6 h-6 mx-auto mb-2" />
                                <div className="text-sm font-medium">{option.label}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-zinc-300 mb-3">Dashboard Layout</h4>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-zinc-300">Compact Mode</div>
                                <div className="text-xs text-zinc-500">Reduce spacing and padding</div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                              </label>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="text-sm text-zinc-300">Animations</div>
                                <div className="text-xs text-zinc-500">Enable smooth transitions</div>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Notifications Settings */}
                  {activeSection === 'notifications' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                          <Bell className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Notifications</h3>
                          <p className="text-sm text-zinc-500">Manage how you receive updates</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-zinc-300 mb-3">Email Notifications</h4>
                          <div className="space-y-3">
                            {[
                              { key: 'forecast', label: 'Forecast Updates', description: 'Get notified when new forecasts are ready' },
                              { key: 'updates', label: 'Product Updates', description: 'Receive news about new features' },
                              { key: 'email', label: 'Weekly Reports', description: 'Weekly summary of your data' },
                            ].map((item) => (
                              <div key={item.key} className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm text-zinc-300">{item.label}</div>
                                  <div className="text-xs text-zinc-500">{item.description}</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={notifications[item.key as keyof typeof notifications]}
                                    onChange={(e) => setNotifications(prev => ({
                                      ...prev,
                                      [item.key]: e.target.checked
                                    }))}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-zinc-300 mb-3">Push Notifications</h4>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-sm text-zinc-300">Mobile Alerts</div>
                              <div className="text-xs text-zinc-500">Receive notifications on your mobile device</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={notifications.push}
                                onChange={(e) => setNotifications(prev => ({
                                  ...prev,
                                  push: !prev.push
                                }))}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Data Management */}
                  {activeSection === 'data' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                          <Database className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Data Management</h3>
                          <p className="text-sm text-zinc-500">Import, export, and manage your data</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="bg-zinc-800/50 border-zinc-700/50 p-4">
                            <div className="text-center">
                              <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                              <div className="text-sm text-zinc-300 mb-1">Import Data</div>
                              <div className="text-xs text-zinc-500 mb-3">Upload CSV or JSON files</div>
                              <Button size="sm" variant="outline" className="w-full border-zinc-600">
                                Choose File
                              </Button>
                            </div>
                          </Card>

                          <Card className="bg-zinc-800/50 border-zinc-700/50 p-4">
                            <div className="text-center">
                              <Download className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                              <div className="text-sm text-zinc-300 mb-1">Export Data</div>
                              <div className="text-xs text-zinc-500 mb-3">Download your data</div>
                              <Button size="sm" onClick={handleExportData} className="w-full">
                                Export
                              </Button>
                            </div>
                          </Card>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-zinc-300 mb-3">Data Statistics</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-white">{data.length}</div>
                              <div className="text-xs text-zinc-500">Total Records</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-white">{forecast ? 'Yes' : 'No'}</div>
                              <div className="text-xs text-zinc-500">Forecast Ready</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-white">
                                {data.length > 0 ? new Date(data[data.length - 1].date).toLocaleDateString() : 'N/A'}
                              </div>
                              <div className="text-xs text-zinc-500">Last Updated</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-white">
                                {(new Blob([JSON.stringify({ data, forecast })]).size / 1024).toFixed(0)} KB
                              </div>
                              <div className="text-xs text-zinc-500">Data Size</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Security Settings */}
                  {activeSection === 'security' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
                          <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">Security & Privacy</h3>
                          <p className="text-sm text-zinc-500">Manage your privacy and security settings</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-zinc-300 mb-3">Privacy Settings</h4>
                          <div className="space-y-3">
                            {[
                              { key: 'analytics', label: 'Analytics', description: 'Help improve the product with usage data' },
                              { key: 'crashReports', label: 'Crash Reports', description: 'Send anonymous crash reports' },
                              { key: 'dataSharing', label: 'Data Sharing', description: 'Share anonymized insights with community' },
                            ].map((item) => (
                              <div key={item.key} className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm text-zinc-300">{item.label}</div>
                                  <div className="text-xs text-zinc-500">{item.description}</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={privacy[item.key as keyof typeof privacy]}
                                    onChange={(e) => setPrivacy(prev => ({
                                      ...prev,
                                      [item.key]: e.target.checked
                                    }))}
                                    className="sr-only peer"
                                  />
                                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-zinc-700/50 pt-6">
                          <h4 className="text-sm font-medium text-zinc-300 mb-3">Account Security</h4>
                          <div className="space-y-3">
                            <Button variant="outline" className="w-full justify-start border-zinc-600">
                              <Lock className="w-4 h-4 mr-2" />
                              Change Password
                            </Button>
                            <Button variant="outline" className="w-full justify-start border-zinc-600">
                              <Smartphone className="w-4 h-4 mr-2" />
                              Two-Factor Authentication
                            </Button>
                            <Button variant="outline" className="w-full justify-start border-zinc-600">
                              <Mail className="w-4 h-4 mr-2" />
                              Email Verification
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-6 border-t border-zinc-700/50 mt-6">
                    <Button
                      variant="outline"
                      onClick={handleResetSettings}
                      className="border-zinc-600 hover:bg-zinc-800"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset to Default
                    </Button>

                    <div className="flex gap-3">
                      <Button variant="ghost" className="text-zinc-400 hover:text-zinc-200">
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveSettings}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}