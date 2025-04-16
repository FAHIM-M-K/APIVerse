'use client';

import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import withAuth from '@/lib/withAuth';
import { FirebaseError } from 'firebase/app';

const AccountPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');

    if (!confirmed) return;

    try {
      setLoading(true);
      const user = auth.currentUser;
      if (!user) {
        toast.error('User not found.');
        return;
      }

      await user.delete();

      toast.success('Account deleted successfully.');
      router.push('/auth');
    } catch (error: unknown) {
      if (error instanceof FirebaseError && error.code === 'auth/requires-recent-login') {
        toast.error('Please re-login and try again.');
      } else {
        toast.error('Failed to delete account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-20">
      <div className="max-w-xl mx-auto text-center mt-10">
        <h1 className="text-2xl font-bold mb-6 text-[#1de9b6]">Account Settings</h1>
        <div className="bg-red-950 border border-red-700 p-6 rounded-none">
          <h2 className="text-xl font-semibold mb-4 text-red-300">Danger Zone</h2>
          <p className="mb-4 text-red-400">Deleting your account is permanent and cannot be undone.</p>
          <Button
            variant="destructive"
            className="bg-white text-black hover:bg-red-600 rounded-none px-6 py-3 text-lg"
            onClick={handleDeleteAccount}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete Account'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default withAuth(AccountPage);
