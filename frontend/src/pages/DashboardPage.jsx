import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import Sidebar from "../components/SideBar";
import DatabaseSetupPrompt from "../components/DatabaseSetupPrompt";
import DatabaseSetupModal from "../components/DatabaseSetupModal";
import Canvas from "../components/Canvas";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import DatabaseOverviewPage from "../pages/DatabaseOverview";
import { Database, Loader2 } from "lucide-react";
import { supabase } from "../supabaseClient";
import axios from "axios";

const DashboardPage = () => {
  // fetch user
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: currentUser }, error } = await supabase.auth.getUser();

      if (error || !currentUser) {
        console.error("Failed to get Supabase user:", error);
        return;
      }

      console.log("Supabase user:", currentUser);
      setUser(currentUser);

      // Sync with backend using email
      try {
        const res = await axios.post("http://localhost:5000/api/users/sync", {
          email: currentUser.email,
          name: currentUser.user_metadata?.full_name || currentUser.email,
        });
        console.log("Backend user synced:", res.data);
      } catch (err) {
        console.error("Failed to sync user with backend:", err);
      }
    };

    getUser();
  }, []);

  // DB config
  const [dbConfig, setDbConfig] = useState(() => {
    const stored = localStorage.getItem("dbConfig");
    return stored ? JSON.parse(stored) : null;
  });
  const [dbSummary, setDbSummary] = useState(null);
  const [analyzingDatabase, setAnalyzingDatabase] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);
  const [loadingDb, setLoadingDb] = useState(true);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : false
  );
  const [canvasExpanded, setCanvasExpanded] = useState(false);
  const [activeView, setActiveView] = useState("chat");

  // Chat & activity state
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        'Hello! I can help you generate reports and insights from your database. Try asking something like "Show me sales trends for last quarter".',
    },
  ]);
  const [activities, setActivities] = useState([]);
  const [openReports, setOpenReports] = useState([]);
  const [activeReportId, setActiveReportId] = useState(null);
  const [activeActivityId, setActiveActivityId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔥 NEW: Function to analyze database
  const analyzeDatabase = (connectionString) => {
    setAnalyzingDatabase(true);

    // Simulate API call - replace with real API call
    setTimeout(() => {
      const mockSummary = {
        connectionString, // ✅ Store connection string
        stats: {
          total_tables: 12,
          total_rows: 45630,
          total_columns: 87,
          size: "2.4 GB",
        },
        insights: [
          'Your database contains 12 tables with a total of 45,630 rows',
          'The largest table is "orders" with 15,234 rows',
          'Most recent data entry was 2 hours ago',
          'Database is well-structured with proper foreign key relationships'
        ],
        tables: [
          {
            name: "users",
            row_count: 1234,
            description: "User accounts and profile information",
            columns: [
              { name: "id", type: "uuid" },
              { name: "email", type: "varchar" },
              { name: "name", type: "varchar" },
              { name: "created_at", type: "timestamp" },
            ],
          },
          {
            name: "orders",
            row_count: 15234,
            description: "Customer orders and transactions",
            columns: [
              { name: "id", type: "uuid" },
              { name: "user_id", type: "uuid" },
              { name: "total", type: "decimal" },
              { name: "status", type: "varchar" },
              { name: "created_at", type: "timestamp" },
            ],
          },
          {
            name: "products",
            row_count: 567,
            description: "Product catalog and inventory",
            columns: [
              { name: "id", type: "uuid" },
              { name: "name", type: "varchar" },
              { name: "price", type: "decimal" },
              { name: "stock", type: "integer" },
            ],
          },
        ],
        suggested_queries: [
          "Show me total revenue by month",
          "What are the top 10 best-selling products?",
          "How many new users signed up this week?",
          "Show me order trends over the last quarter",
        ],
      };

      setDbSummary(mockSummary);
      setAnalyzingDatabase(false);
      setActiveView("overview");
    }, 3000);
  };

  // 🔥 Fetch DB config on mount
  useEffect(() => {
    const fetchDbConfig = async () => {
      if (!user?.email) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/users/${user.email}/database`);
        
        if (res.data?.databaseAPI) {
          const config = { connectionString: res.data.databaseAPI };
          setDbConfig(config);
          localStorage.setItem("dbConfig", JSON.stringify(config));
          
          // ✅ Trigger analysis if we have a connection string
          analyzeDatabase(res.data.databaseAPI);
        } else {
          setShowDbModal(true);
        }
      } catch (error) {
        console.error("Failed to fetch DB API from backend:", error);
        setShowDbModal(true);
      } finally {
        setLoadingDb(false);
      }
    };

    fetchDbConfig();
  }, [user]);

  // 💾 Save DB config and start analysis
  // 💾 Save DB config and start analysis
const handleSaveDbConfig = async (connectionString) => {
  if (!connectionString || !user?.email) return;

  try {
    // Save to backend (already done in modal, but we can skip this duplicate call)
    // The modal already saves it, so we just need to handle the analysis
    
    const config = { connectionString };
    setDbConfig(config);
    localStorage.setItem("dbConfig", JSON.stringify(config));

    // ✅ Always trigger analysis when config is saved/updated
    analyzeDatabase(connectionString);
  } catch (err) {
    console.error("Failed to process database configuration:", err);
    alert("Failed to analyze database");
  }
};

  // 💬 Send chat messages
  const handleSendMessage = (message) => {
    if (!message.trim()) return;

    setLoading(true);
    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const reportId = Date.now().toString();
      const mockReport = {
        id: reportId,
        title: message.includes("chart") ? "Sales Chart" : "Sales Analysis Report",
        type: message.includes("chart") ? "chart" : "table",
        data: {
          columns: ["Product", "Revenue", "Units Sold", "Growth"],
          rows: [
            ["Product A", "$45,230", "1,234", "+12%"],
            ["Product B", "$38,920", "987", "+8%"],
            ["Product C", "$52,100", "1,456", "+15%"],
            ["Product D", "$29,840", "745", "-3%"],
          ],
        },
        insights: [
          "Product C shows highest growth at 15%",
          "Overall revenue up 8% compared to previous period",
          "Product D requires attention due to negative growth",
        ],
      };

      let newActivityId = activeActivityId;
      if (!activeActivityId) {
        newActivityId = Date.now().toString();
        const activity = {
          id: newActivityId,
          title: message,
          timestamp: new Date().toISOString(),
          cached: false,
          reportId,
        };
        setActivities((prev) => [activity, ...prev]);
        setActiveActivityId(newActivityId);
      }

      setOpenReports((prev) => [...prev, mockReport]);
      setActiveReportId(reportId);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I have generated the report based on your query. The results are displayed in the canvas on the right.",
        },
      ]);

      setLoading(false);
      setCanvasExpanded(false);
      setSidebarOpen(false);
    }, 1500);
  };

  // 📜 Handle activity click
  const handleActivityClick = (activity) => {
    const existingReport = openReports.find((r) => r.id === activity.reportId);
    if (existingReport) setActiveReportId(activity.reportId);
    setActiveActivityId(activity.id);
    setSidebarOpen(false);
    setCanvasExpanded(false);
    setActiveView("chat");
  };

  const currentReport = openReports.find((r) => r.id === activeReportId);

  // 🆕 New chat
  const handleNewChat = () => {
    setActiveActivityId(null);
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! Let's start a new conversation. You can ask me anything like 'Show me monthly revenue trends'",
      },
    ]);
    setOpenReports([]);
    setActiveReportId(null);
    setCanvasExpanded(false);
    setSidebarOpen(false);
  };

  // ⚙️ Conditional Rendering

  // Loading DB config
  if (loadingDb) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  // Analyzing database
  if (analyzingDatabase) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <div className="relative mb-8">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
              <Database className="w-10 h-10 text-teal-600 animate-pulse" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Analyzing Your Database</h2>
          <p className="text-gray-600 mb-6">
            Our AI is scanning your database structure, analyzing tables, and generating insights...
          </p>
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
            <span className="text-sm text-gray-600">This may take a few moments</span>
          </div>
        </div>
      </div>
    );
  }

  // Database overview
  if (activeView === "overview" && dbSummary) {
    return (
      <DatabaseOverviewPage
        dbSummary={dbSummary}
        onContinue={() => setActiveView("chat")}
        activeView={activeView}
        onChatClick={() => setActiveView("chat")}
      />
    );
  }

  // No DB config - show setup prompt
  if (!dbConfig) {
    return (
      <div className="h-screen flex flex-col">
        <Navbar onMenuToggle={() => {}} onSettingsClick={() => setShowDbModal(true)} />
        <DatabaseSetupPrompt onSetup={() => setShowDbModal(true)} />
        <DatabaseSetupModal
          isOpen={showDbModal}
          onClose={() => setShowDbModal(false)}
          onSave={handleSaveDbConfig}
          userEmail={user?.email}
        />
      </div>
    );
  }

  // Normal dashboard
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <div className={`transition-all duration-300 ${sidebarOpen ? "lg:ml-72" : "lg:ml-0"}`}>
        <Navbar
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onSettingsClick={() => setShowDbModal(true)}
          onOverviewClick={() => setActiveView("overview")}
          onChatClick={() => setActiveView("chat")}
          hasOverview={dbSummary !== null} // ✅ Will be true after analysis
          activeView={activeView}
        />
      </div>

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activities={activities}
        onActivityClick={handleActivityClick}
        activeActivityId={activeActivityId}
        showCloseButton={true}
        onNewChat={handleNewChat}
      />

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Section */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            sidebarOpen ? "lg:ml-72" : "lg:ml-0"
          }`}
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="bg-gray-100 px-4 py-3 rounded-lg animate-pulse">
                  Typing...
                </div>
              </div>
            )}
          </div>
          <ChatInput onSend={handleSendMessage} disabled={loading} />
        </div>

        {/* Canvas */}
        {openReports.length > 0 && (
          <Canvas
            report={currentReport}
            allReports={openReports}
            activeReportId={activeReportId}
            isExpanded={canvasExpanded}
            onToggleExpand={() => setCanvasExpanded(!canvasExpanded)}
            onReportChange={(id) => setActiveReportId(id)}
            onCloseReport={(id) => {
              setOpenReports((prev) => prev.filter((r) => r.id !== id));
              if (id === activeReportId) setActiveReportId(null);
            }}
          />
        )}
      </div>

      {/* DB Setup Modal */}
      <DatabaseSetupModal
        isOpen={showDbModal}
        onClose={() => setShowDbModal(false)}
        onSave={handleSaveDbConfig}
        userEmail={user?.email}
      />
    </div>
  );
};

export default DashboardPage;