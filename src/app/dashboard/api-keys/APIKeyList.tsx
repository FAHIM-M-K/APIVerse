'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type APIKey = {
  id: string;
  name: string;
  url: string;
  key: string;
  description?: string;
};

const APIKeyList = () => {
  const [keys, setKeys] = useState<APIKey[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      setKeys([]);
      return;
    }

    const q = collection(db, 'users', user.uid, 'apiKeys');

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const userKeys = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<APIKey, 'id'>),
        }));
        setKeys(userKeys);
      },
      (error) => {
        console.error('Snapshot listener error:', error);
        setKeys([]);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'users', auth.currentUser!.uid, 'apiKeys', id));
      toast.success('API Key deleted');
    } catch {
      toast.error('Failed to delete API Key');
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">Your API Keys</h2>
      <div className="bg-black border-t border-white">
        {keys.length > 0 ? (
          <>
            <div className="grid grid-cols-4 gap-4 p-2 text-white font-semibold border-b border-white">
              <span>Name</span>
              <span>URL</span>
              <span>Description</span>
              <span>Action</span>
            </div>
            {keys.map(key => (
              <div
                key={key.id}
                className="grid grid-cols-4 gap-4 p-2 border-b border-white text-white"
              >
                <span className="break-all">{key.name}</span>
                <a
                  href={key.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1de9b6] hover:underline break-all"
                >
                  {key.url}
                </a>
                <span className="break-all">{key.description || 'N/A'}</span>
                <Button
                  variant="destructive"
                  className="bg-white text-black text-sm py-1 px-2 rounded-none hover:bg-red-600"
                  onClick={() => handleDelete(key.id)}
                >
                  Delete
                </Button>
              </div>
            ))}
          </>
        ) : (
          <p className="text-white text-center p-2">No API keys found.</p>
        )}
      </div>
    </div>
  );
};

export default APIKeyList;
