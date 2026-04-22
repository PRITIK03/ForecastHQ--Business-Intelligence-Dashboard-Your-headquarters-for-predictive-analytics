'use client';

import { useEffect, useState, useRef } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useInsightStore } from '@/lib/store';
import {
  Database,
  Upload,
  Download,
  Trash2,
  FileText,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  RefreshCw,
  Eye,
  Edit,
  Plus,
  Search
} from 'lucide-react';
import { format } from 'date-fns';

interface Dataset {
  id: string;
  name: string;
  description: string;
  size: number;
  records: number;
  createdAt: Date;
  lastModified: Date;
  status: 'active' | 'inactive' | 'processing';
  type: 'sales' | 'ecommerce' | 'custom';
}

export default function DataManagementPage() {
  const { data, forecast, generateData, isLoading } = useInsightStore();
  const [datasets, setDatasets] = useState<Dataset[]>([
    {
      id: '1',
      name: 'Sales Data 2024',
      description: 'Primary sales dataset with revenue metrics',
      size: 245760, // bytes
      records: data.length,
      createdAt: new Date('2024-01-01'),
      lastModified: new Date(),
      status: 'active',
      type: 'sales'
    },
    {
      id: '2',
      name: 'Forecast Results',
      description: 'Generated forecast data and predictions',
      size: 51200,
      records: forecast?.predictions.length || 0,
      createdAt: new Date(),
      lastModified: new Date(),
      status: 'active',
      type: 'custom'
    }
  ]);

  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDatasets = datasets.filter(dataset =>
    dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dataset.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowUploadModal(false);

          // Add new dataset
          const newDataset: Dataset = {
            id: Date.now().toString(),
            name: file.name.replace(/\.[^/.]+$/, ''),
            description: `Uploaded ${file.name}`,
            size: file.size,
            records: 0, // Would be calculated after processing
            createdAt: new Date(),
            lastModified: new Date(),
            status: 'processing',
            type: 'custom'
          };

          setDatasets(prev => [...prev, newDataset]);

          // Simulate processing completion
          setTimeout(() => {
            setDatasets(prev => prev.map(ds =>
              ds.id === newDataset.id
                ? { ...ds, status: 'active' as const, records: Math.floor(Math.random() * 1000) + 100 }
                : ds
            ));
          }, 2000);

          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleExportDataset = (dataset: Dataset) => {
    let exportData;
    let filename;

    if (dataset.type === 'sales') {
      exportData = data;
      filename = 'sales-data.csv';
    } else {
      exportData = forecast;
      filename = 'forecast-data.json';
    }

    const csvContent = dataset.type === 'sales'
      ? `date,value\n${data.map(d => `${d.date},${d.value}`).join('\n')}`
      : JSON.stringify(exportData, null, 2);

    const blob = new Blob([csvContent], {
      type: dataset.type === 'sales' ? 'text/csv' : 'application/json'
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteDataset = (datasetId: string) => {
    if (confirm('Are you sure you want to delete this dataset? This action cannot be undone.')) {
      setDatasets(prev => prev.filter(ds => ds.id !== datasetId));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-cyan-500/8 to-blue-500/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Sidebar />

      <main className="flex-1 p-6 overflow-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto space-y-6"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent">
                Data Management
              </h1>
              <p className="text-zinc-500 text-lg mt-1">Import, export, and manage your datasets</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowUploadModal(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
              >
                <Plus className="w-4 h-4 mr-2" />
                Upload Data
              </Button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            {[
              {
                title: "Total Datasets",
                value: datasets.length.toString(),
                icon: Database,
                color: "from-blue-500 to-indigo-500"
              },
              {
                title: "Total Records",
                value: datasets.reduce((sum, ds) => sum + ds.records, 0).toLocaleString(),
                icon: BarChart3,
                color: "from-green-500 to-emerald-500"
              },
              {
                title: "Storage Used",
                value: formatFileSize(datasets.reduce((sum, ds) => sum + ds.size, 0)),
                icon: Database,
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Active Datasets",
                value: datasets.filter(ds => ds.status === 'active').length.toString(),
                icon: CheckCircle,
                color: "from-orange-500 to-red-500"
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02, y: -2 }}
              >
                <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 backdrop-blur-xl border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-3`}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                      <p className="text-sm text-zinc-500">{stat.title}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-zinc-900/60 border border-zinc-700 rounded-lg text-zinc-300 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <select className="px-4 py-2 bg-zinc-900/60 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>All Types</option>
              <option>Sales Data</option>
              <option>E-commerce</option>
              <option>Custom</option>
            </select>

            <select className="px-4 py-2 bg-zinc-900/60 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option>All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Processing</option>
            </select>
          </motion.div>

          {/* Datasets Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredDatasets.map((dataset, index) => (
              <motion.div
                key={dataset.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="group"
              >
                <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 backdrop-blur-xl border-zinc-700/50 hover:border-zinc-600/50 transition-all duration-300 h-full">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                        dataset.type === 'sales' ? 'from-blue-500 to-indigo-500' :
                        dataset.type === 'ecommerce' ? 'from-green-500 to-emerald-500' :
                        'from-purple-500 to-pink-500'
                      } p-2`}>
                        <Database className="w-6 h-6 text-white" />
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        dataset.status === 'active' ? 'bg-green-500/20 text-green-400' :
                        dataset.status === 'processing' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-zinc-500/20 text-zinc-400'
                      }`}>
                        {dataset.status}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{dataset.name}</h3>
                        <p className="text-sm text-zinc-500">{dataset.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-zinc-500">Records</p>
                          <p className="text-zinc-300 font-medium">{dataset.records.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-zinc-500">Size</p>
                          <p className="text-zinc-300 font-medium">{formatFileSize(dataset.size)}</p>
                        </div>
                      </div>

                      <div className="text-xs text-zinc-500">
                        Modified {format(dataset.lastModified, 'MMM dd, yyyy')}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedDataset(dataset)}
                        className="flex-1 border-zinc-600 hover:bg-zinc-800"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleExportDataset(dataset)}
                        className="flex-1 border-zinc-600 hover:bg-zinc-800"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="flex-1 text-zinc-400 hover:text-zinc-200"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteDataset(dataset.id)}
                        className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredDatasets.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Database className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-zinc-400 mb-2">No datasets found</h3>
              <p className="text-zinc-500 mb-6">Try adjusting your search or upload new data</p>
              <Button onClick={() => setShowUploadModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Upload Your First Dataset
              </Button>
            </motion.div>
          )}
        </motion.div>
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => !isUploading && setShowUploadModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-md w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Upload Dataset</h3>
              {!isUploading && (
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {!isUploading ? (
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-600 rounded-lg p-8 text-center cursor-pointer hover:border-zinc-500 transition-colors"
                >
                  <Upload className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
                  <p className="text-zinc-300 mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-zinc-500">CSV, JSON, XLSX files supported</p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.json,.xlsx"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 border-zinc-600"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500"
                  >
                    Select File
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-zinc-300 mb-2">Uploading file...</p>
                <div className="w-full bg-zinc-700 rounded-full h-2 mb-2">
                  <motion.div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-zinc-500">{uploadProgress}% complete</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}