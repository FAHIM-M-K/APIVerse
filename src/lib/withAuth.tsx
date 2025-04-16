'use client';

import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const withAuth = <P extends object>(Component: React.FC<P>) => {
  return function ProtectedRoute(props: P) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/auth');
      }
    }, [user, loading, router]);

    if (loading || !user) {
      return <div className="text-white text-center p-8">Checking authentication...</div>;
    }

    return <Component {...props} />;
  };
};

export default withAuth;