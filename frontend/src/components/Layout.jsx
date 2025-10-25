// src/components/Layout.jsx
import Navbar from "./NavBar"
import Sidebar from "./SideBar";

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
