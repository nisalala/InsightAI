import React, { useState, useEffect } from "react";
import axios from "axios";
import { Database, Layers, Table, Activity, Sparkles, ChevronRight, Info, ArrowRight } from "lucide-react";
import Navbar from "../components/NavBar";

const DatabaseOverviewPage = ({ dbSummary, onContinue, activeView, onChatClick }) => {
  const [databaseData, setDatabaseData] = useState(dbSummary || null); // fallback to dbSummary if provided
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const databaseAPI = dbSummary?.connectionString;

  useEffect(() => {
    const fetchData = async () => {
      if (!databaseAPI) return;

      setLoading(true);
      setError("");

      try {
        const res = await axios.post("http://127.0.0.1:5001/generate-insights", {
          database_api: databaseAPI
        });
        setDatabaseData(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to fetch insights");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [databaseAPI]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeView={activeView} onChatClick={onChatClick} />

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
              <Database className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Database Overview</h1>
              <p className="text-gray-600">Automatically generated analysis of your database</p>
            </div>
          </div>
        </div>

        {/* Loading/Error */}
        {loading && <p className="text-gray-600 mb-4">Loading insights...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Layers className="w-5 h-5 text-teal-600" />
              <span className="text-sm font-medium text-gray-600">Total Tables</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{databaseData?.stats?.total_tables || 0}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Table className="w-5 h-5 text-cyan-600" />
              <span className="text-sm font-medium text-gray-600">Total Rows</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{databaseData?.stats?.total_rows?.toLocaleString() || 0}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Columns</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{databaseData?.stats?.total_columns || 0}</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-gray-600">Database Size</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{databaseData?.stats?.size || 'N/A'}</div>
          </div>
        </div>

        {/* Key Insights */}
        {databaseData?.insights && databaseData.insights.length > 0 && (
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-semibold text-gray-900">Key Insights</h2>
            </div>
            <div className="grid gap-3">
              {databaseData.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 bg-white rounded-lg p-4">
                  <ChevronRight className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tables Overview */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Table className="w-5 h-5 text-teal-600" />
              Tables in Your Database
            </h2>
          </div>
          <div className="p-6">
            <div className="grid gap-4">
              {databaseData?.tables && databaseData.tables.map((table, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{table.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{table.description || 'No description available'}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Rows</div>
                      <div className="text-lg font-semibold text-gray-900">{table.row_count?.toLocaleString() || 0}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {table.columns && table.columns.slice(0, 6).map((col, j) => (
                      <span key={j} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {col.name} <span className="text-gray-500">({col.type})</span>
                      </span>
                    ))}
                    {table.columns && table.columns.length > 6 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs">
                        +{table.columns.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggested Queries */}
        {databaseData?.suggested_queries && databaseData.suggested_queries.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Info className="w-5 h-5 text-teal-600" />
                Suggested Queries to Try
              </h2>
            </div>
            <div className="p-6">
              <div className="grid gap-3">
                {databaseData.suggested_queries.map((query, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <ChevronRight className="w-4 h-4 text-teal-600" />
                      <span className="text-gray-700">{query}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-center">
          <button
            onClick={onContinue}
            className="px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            Continue to Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DatabaseOverviewPage;
