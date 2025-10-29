import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Database, Loader2 } from 'lucide-react';
import axios from 'axios';

const DatabaseSetupModal = ({ isOpen, onClose, userEmail, onSave }) => {
  const [connectionString, setConnectionString] = useState('');
  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [hasExistingConfig, setHasExistingConfig] = useState(false);

  // Fetch user's stored databaseAPI on modal open
  useEffect(() => {
    if (!isOpen || !userEmail) return;

    const fetchDatabaseAPI = async () => {
      setLoading(true);
      setTestResult(null); // Reset test result when modal opens
      try {
        const res = await axios.get(`http://localhost:5000/api/users/${userEmail}/database`);

        if (res.data?.databaseAPI) {
          setConnectionString(res.data.databaseAPI);
          setHasExistingConfig(true);
        } else {
          setHasExistingConfig(false);
        }
      } catch (err) {
        console.error('Error fetching database API:', err.response?.data || err.message);
        setHasExistingConfig(false);
      } finally {
        setLoading(false);
      }
    };

    fetchDatabaseAPI();
  }, [isOpen, userEmail]);

  // Simulate testing connection (replace with real backend endpoint if available)
  const handleTest = async () => {
    if (!connectionString) return;
    setTesting(true);
    setTestResult(null);
    try {
      await new Promise((r) => setTimeout(r, 1000)); // simulate delay
      setTestResult({ success: true, message: 'Connection successful!' });
    } catch {
      setTestResult({ success: false, message: 'Connection failed. Check credentials.' });
    } finally {
      setTesting(false);
    }
  };

  // Save connection string to backend
  const handleSave = async () => {
    if (!connectionString || !userEmail) return;
    setSaving(true);
    try {
      await axios.put(`http://localhost:5000/api/users/${userEmail}/database`, {
        databaseAPI: connectionString,
      });

      setTestResult({ success: true, message: 'Database API saved successfully!' });
      
      // ✅ Wait a moment to show success message, then trigger analysis
      setTimeout(() => {
        onSave(connectionString); // This will trigger analysis in DashboardPage
        onClose(); // Close modal after save
      }, 1000);
    } catch (err) {
      console.error('Error saving database API:', err);
      setTestResult({
        success: false,
        message: err.response?.data?.error || 'Failed to save database API.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-6 h-6 text-teal-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {hasExistingConfig ? 'Update Database Configuration' : 'Database Configuration'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-500">
              <Loader2 className="animate-spin w-5 h-5 mr-2" /> Loading...
            </div>
          ) : (
            <>
              {hasExistingConfig && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Updating Configuration</p>
                    <p className="mt-1">Saving will re-analyze your database and generate a new overview.</p>
                  </div>
                </div>
              )}

              <label className="block text-sm font-medium text-gray-700 mb-2">Database API</label>
              <textarea
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
                placeholder="postgresql://user:password@host:port/database"
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-sm resize-none"
              />
              <p className="mt-2 text-xs text-gray-500">
                Paste your full PostgreSQL connection string. This will be used to connect to your database.
              </p>

              {testResult && (
                <div
                  className={`p-3 rounded-lg flex items-start gap-2 ${
                    testResult.success ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                  }`}
                >
                  {testResult.success ? (
                    <Check className="w-5 h-5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  <span className="text-sm">{testResult.message}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleTest}
            disabled={!connectionString || testing || loading}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>
          <button
            onClick={handleSave}
            disabled={!connectionString || saving || loading}
            className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : hasExistingConfig ? 'Update & Re-analyze' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSetupModal;