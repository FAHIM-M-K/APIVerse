// src/components/APIKeyManager.tsx
'use client';

import { useEffect, useState } from 'react';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';

interface APIKey {
  id?: string;
  keyValue: string;
  description: string;
}

export default function APIKeyManager() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [description, setDescription] = useState('');
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchAPIKeys = async () => {
    if (!user) return;
    try {
      const q = query(collection(db, 'apikeys'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const keys: APIKey[] = [];
      querySnapshot.forEach((docSnap) => {
        keys.push({ id: docSnap.id, ...docSnap.data() } as APIKey);
      });
      setApiKeys(keys);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAPIKeys();
  }, [user]);

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const docRef = await addDoc(collection(db, 'apikeys'), {
        userId: user.uid,
        keyValue: apiKey,
        description,
      });
      // Refresh list after successful addition.
      setApiKey('');
      setDescription('');
      fetchAPIKeys();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'apikeys', id));
      fetchAPIKeys();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-black p-6 rounded-lg shadow-lg text-white">
      <h2 className="text-2xl font-bold text-turquoise mb-4">Manage Your API Keys</h2>
      
      {error && <p className="text-red-500 mb-4">{error}</p>}
      
      <form onSubmit={handleAddKey} className="mb-6">
        <input
          type="text"
          placeholder="API Key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded mb-2 text-white"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded mb-2 text-white"
          required
        />
        <button type="submit" className="w-full py-2 bg-turquoise text-black font-bold rounded hover:opacity-90">
          Add API Key
        </button>
      </form>

      <div>
        {apiKeys.length === 0 ? (
          <p className="text-gray-400">No API keys added yet.</p>
        ) : (
          <ul>
            {apiKeys.map((key) => (
              <li key={key.id} className="flex justify-between items-center border-b border-gray-700 py-2">
                <div>
                  <p className="font-bold">{key.description}</p>
                  <p className="text-sm text-gray-400">{key.keyValue}</p>
                </div>
                <button 
                  onClick={() => key.id && handleDeleteKey(key.id)}
                  className="bg-red-600 px-3 py-1 rounded hover:opacity-90"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
