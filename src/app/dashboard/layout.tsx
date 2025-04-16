import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar with subtle border */}
      <aside className="w-64 bg-[#111] border-r border-white/10">
        <Sidebar />
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-6 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
