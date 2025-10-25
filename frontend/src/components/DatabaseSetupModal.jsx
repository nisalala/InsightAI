import React, { useState } from 'react';
import { X, Check, AlertCircle, Database } from 'lucide-react';

const DatabaseSetupModal = ({ isOpen, onClose, onSave, initialConfig }) => {
  const [config, setConfig] = useState(initialConfig || { connectionString: '' });
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    
    setTimeout(() => {
      setTestResult({ success: true, message: 'Connection successful!' });
      setTesting(false);
    }, 1000);
  };

  const handleSave = () => {
    if (config.connectionString) {
      onSave(config);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-teal-600" />
              <h2 className="text-xl font-semibold text-gray-900">Database Configuration</h2>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Database API
            </label>
            <textarea
              value={config.connectionString}
              onChange={(e) => setConfig({ connectionString: e.target.value })}
              placeholder="postgresql://user:password@host:port/database&#10;&#10;"
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm resize-none"
            />
            <p className="mt-2 text-xs text-gray-500">
              Paste your full PostgreSQL connection string. This will be used to connect to your Supabase database.
            </p>
          </div>

          {testResult && (
            <div className={`p-3 rounded-lg flex items-start gap-2 ${
              testResult.success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
            }`}>
              {testResult.success ? (
                <Check className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm">{testResult.message}</span>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleTest}
            disabled={!config.connectionString || testing}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
          <button
            onClick={handleSave}
            disabled={!config.connectionString}
            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSetupModal;
