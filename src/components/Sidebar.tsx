'use client';

import Link from 'next/link';

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-neutral-900 text-white p-6 flex flex-col">
      <h2 className="text-cyan-400 text-2xl font-bold mb-10">Dashboard</h2>
      <nav className="flex flex-col gap-4">
        <Link href="/dashboard" className="hover:text-cyan-300">
          Home
        </Link>
        <Link href="/dashboard/profile" className="hover:text-cyan-300">
          Profile
        </Link>
        <Link href="/dashboard/settings" className="hover:text-cyan-300">
          Settings
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
