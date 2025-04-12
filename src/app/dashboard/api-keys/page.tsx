'use client';

import React from 'react';
import AddKeyForm from './AddKeyForm';
import APIKeyList from './APIKeyList';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { deleteUser } from 'firebase/auth';

const APIKeysPage = () => {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action is irreversible.'
    );

    if (confirmed) {
      const user = auth.currentUser;
      if (user) {
        try {
          await deleteUser(user);
          toast.success('Account deleted successfully.');
          router.push('/');
        } catch (error: any) {
          if (error.code === 'auth/requires-recent-login') {
            toast.error('Please log in again before deleting your account.');
          } else {
            toast.error('Failed to delete account.');
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-[#1de9b6] text-center">My API Keys</h1>
        <AddKeyForm />
        <APIKeyList />

        <div className="pt-8 border-t border-white">
          <h3 className="text-white font-semibold text-lg mb-2">Danger Zone</h3>
          <Button
            onClick={handleDeleteAccount}
            variant="destructive"
            className="px-4 py-2 text-white border border-white hover:bg-red-600 hover:scale-105 hover:shadow-md transition duration-300"
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default APIKeysPage;
