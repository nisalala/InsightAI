import React from "react";
import { X, Plus } from "lucide-react";

const Sidebar = ({
  isOpen,
  onClose,
  activities,
  onActivityClick,
  activeActivityId,
  showCloseButton,
  onNewChat,
}) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full z-50 w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        ${isOpen ? "lg:translate-x-0" : "lg:-translate-x-72"}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 z-50">
        <h2 className="text-lg font-semibold text-gray-900">Activities</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onNewChat}
            className="p-2 hover:bg-gray-100 rounded-lg z-50"
            title="Start New Chat"
          >
            <Plus className="w-4 h-4 text-teal-600" />
          </button>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg z-50"
              title="Close Sidebar"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Activity list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 mt-2">
        {activities.length === 0 && (
          <p className="text-sm text-gray-400 text-center mt-4">
            No conversations yet. Start a new chat!
          </p>
        )}
        {activities.map((activity) => (
          <button
            key={activity.id}
            onClick={() => onActivityClick(activity)}
            className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between
              ${activeActivityId === activity.id
                ? "bg-teal-50 text-teal-800 font-medium"
                : "hover:bg-gray-100 text-gray-700"
              }`}
          >
            <span className="truncate">{activity.title || "New Conversation"}</span>
            {activity.reportId && (
              <span className="text-xs text-gray-400 ml-2">Report</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
