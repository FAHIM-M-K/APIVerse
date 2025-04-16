'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'My API Keys', href: '/dashboard/api-keys' },
    { label: 'Predict', href: '/dashboard/predict' },
    { label: 'Account', href: '/dashboard/account' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-black text-white pt-10 px-6 border-r border-white fixed">
      <div className="space-y-2">
        {navItems.map(({ label, href }) => (
          <div key={label}>
            <Link
              href={href}
              className={clsx(
                'block py-2 px-4 transition duration-200 w-full no-underline',
                pathname === href ? 'bg-[#1de9b6] text-black font-semibold' : 'hover:bg-[#4A4A4A] text-white'
              )}
            >
              {label}
            </Link>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
