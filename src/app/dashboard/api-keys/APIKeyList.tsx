'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
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
    const unsubscribe = onSnapshot(collection(db, 'apiKeys'), snapshot => {
      const data = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      })) as APIKey[];
      setKeys(data);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'apiKeys', id));
      toast.success('API Key deleted');
    } catch {
      toast.error('Failed to delete API Key');
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">Your API Keys</h2>
      <div className="space-y-4">
        {keys.length > 0 ? (
          keys.map(key => (
            <div
              key={key.id}
              className="p-4 rounded-lg border border-white bg-transparent flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <h3 className="text-lg font-bold text-white">{key.name}</h3>
                <a
                  href={key.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1de9b6] hover:underline"
                >
                  {key.url}
                </a>
                {key.description && (
                  <p className="text-sm text-white/70 mt-1">{key.description}</p>
                )}
              </div>
              <div className="space-x-2 mt-4 md:mt-0">
                {/* Edit button removed as per your request */}
                <Button
                  variant="destructive"
                  className="text-sm border-white text-white hover:bg-[#1de9b6] hover:text-black"
                  onClick={() => handleDelete(key.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center">No API keys found.</p>
        )}
      </div>
    </div>
  );
};

export default APIKeyList;
