// app/(main)/layout.jsx
import Sidebar from "../components/sidebar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
      <Sidebar />
      <div className="lg:pl-72">
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}