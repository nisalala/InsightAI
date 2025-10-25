import React from "react";
import { Database } from "lucide-react";

const DatabaseSetupPrompt = ({ onSetup }) => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-slate-100 p-8">
      <div className="max-w-md text-center">
        <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Database className="w-10 h-10 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Connect Your Database</h2>
        <p className="text-gray-600 mb-6">
          To start generating reports and insights, connect your PostgreSQL database using a connection string.
        </p>
        <button
          onClick={onSetup}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium inline-flex items-center gap-2"
        >
          <Database className="w-5 h-5" />
          Configure Database
        </button>
        <p className="text-xs text-gray-500 mt-4">
          Your credentials are stored locally and never shared
        </p>
      </div>
    </div>
  );
};

export default DatabaseSetupPrompt;
