// 'use client';
// import Link from 'next/link';
// import { useAuth } from '@/lib/AuthContext';
// import { useRouter } from 'next/navigation';
// import { Button } from './ui/button';

// const Header = () => {
//   const { user, logout } = useAuth();
//   const router = useRouter();

//   return (
//     <header className="bg-black text-white px-6 py-4 flex justify-between items-center border-b border-white">
//       <Link href="/" className="text-[#1de9b6] text-2xl font-bold">
//         APIVerse
//       </Link>

//       <nav className="flex space-x-4 items-center">
//         <Link href="/" className="hover:text-[#1de9b6] transition">Home</Link>
//         <Link href="/dashboard" className="hover:text-[#1de9b6] transition">Dashboard</Link>

//         {user ? (
//           <Button
//             onClick={logout}
//             className="bg-transparent border border-white text-white hover:bg-[#1de9b6] hover:text-black"
//           >
//             Logout
//           </Button>
//         ) : (
//           <Button
//             onClick={() => router.push('/auth')}
//             className="bg-transparent border border-white text-white hover:bg-[#1de9b6] hover:text-black"
//           >
//             Login
//           </Button>
//         )}
//       </nav>
//     </header>
//   );
// };

// export default Header;

'use client';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';

const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="bg-black text-white px-3 py-4 fixed top-0 left-0 w-full z-10 border-b border-white"> 
      <div className="flex justify-between items-center">
        <Link href="/" className="text-[#1de9b6] text-3xl font-bold ml-1"> 
          APIVerse
        </Link>

        <nav className="flex space-x-6 items-center">
          <Link href="/" className="text-lg hover:text-[#1de9b6] transition">Home</Link>
          <Link href="/dashboard" className="text-lg hover:text-[#1de9b6] transition">Dashboard</Link>

          {user ? (
            <Button
              onClick={logout}
              className="bg-white text-black py-6 px-4 rounded-none hover:bg-[#1de9b6] hover:text-black transition" 
            >
              Logout
            </Button>
          ) : (
            <Button
              onClick={() => router.push('/auth')}
              className="bg-white text-black py-6 px-4 rounded-none hover:bg-[#1de9b6] hover:text-black transition" 
            >
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;