import React from 'react';
import { BarChart3, Download, Maximize2, Minimize2, Sparkles, ChevronRight, X } from 'lucide-react';

const Canvas = ({ report, isExpanded, onToggleExpand, allReports, activeReportId, onReportChange, onCloseReport }) => {
  return (
    <div className={`
      flex flex-col bg-white border-l border-gray-200
      ${isExpanded ? 'fixed inset-0 z-50' : 'w-1/2 flex-shrink-0'}
      transition-all duration-300
    `}>
      {/* Tabs header */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex items-center overflow-x-auto">
          {allReports && allReports.map((rep) => (
            <button
              key={rep.id}
              onClick={() => onReportChange(rep.id)}
              className={`
                group relative px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-2 border-r border-gray-200
                ${activeReportId === rep.id 
                  ? 'bg-white text-gray-900 border-b-2 border-b-teal-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
                transition-colors
              `}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="max-w-32 truncate">{rep.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseReport(rep.id);
                }}
                className="ml-1 p-0.5 hover:bg-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Report toolbar */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-white">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-teal-600" />
          {report?.title || 'Report'}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Download functionality coming soon!')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Download Report"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={onToggleExpand}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title={isExpanded ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isExpanded ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Report content */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {report?.type === 'chart' && (
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <img 
              src={report.chartUrl || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="400"%3E%3Crect fill="%23f3f4f6" width="800" height="400"/%3E%3Ctext x="400" y="200" text-anchor="middle" fill="%239ca3af" font-size="20"%3EChart Placeholder%3C/text%3E%3C/svg%3E'} 
              alt="Chart"
              className="w-full h-auto"
            />
          </div>
        )}
        
        {report?.type === 'table' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {report.data.columns.map((col, i) => (
                      <th key={i} className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {report.data.rows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      {row.map((cell, j) => (
                        <td key={j} className="px-4 py-3 text-sm text-gray-700">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {report?.type === 'text' && (
          <div className="prose max-w-none">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              <p className="text-gray-700 whitespace-pre-wrap">{report.content}</p>
            </div>
          </div>
        )}

        {report?.insights && (
          <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <h4 className="font-medium text-teal-900 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Key Insights
            </h4>
            <ul className="space-y-1 text-sm text-teal-800">
              {report.insights.map((insight, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;
