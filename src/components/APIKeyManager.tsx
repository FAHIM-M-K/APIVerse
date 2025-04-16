'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  doc,
} from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ApiKey {
  id: string;
  name: string;
  key: string;
}

export default function APIKeyManager() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchApiKeys = async () => {
      if (!user) return;
      const userKeysRef = collection(db, 'users', user.uid, 'apiKeys');
      const snapshot = await getDocs(userKeysRef);
      const keys = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ApiKey[];
      setApiKeys(keys);
    };

    fetchApiKeys();
  }, [user]);

  const generateRandomKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  };

  const handleCreateKey = async () => {
    if (!user || !name.trim()) return;
    const newKey = generateRandomKey();
    const userKeysRef = collection(db, 'users', user.uid, 'apiKeys');
    const docRef = await addDoc(userKeysRef, {
      name,
      key: newKey,
    });
    setApiKeys((prev) => [...prev, { id: docRef.id, name, key: newKey }]);
    setName('');
  };

  const handleDeleteKey = async (id: string) => {
    if (!user) return;
    const keyRef = doc(db, 'users', user.uid, 'apiKeys', id);
    await deleteDoc(keyRef);
    setApiKeys((prev) => prev.filter((key) => key.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter key name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={handleCreateKey}>Generate API Key</Button>
      </div>

      <div className="space-y-2">
        {apiKeys.map((key) => (
          <div key={key.id} className="flex items-center justify-between p-2 border rounded">
            <div>
              <p className="font-medium">{key.name}</p>
              <p className="text-sm text-gray-500">{key.key}</p>
            </div>
            <Button variant="destructive" onClick={() => handleDeleteKey(key.id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
