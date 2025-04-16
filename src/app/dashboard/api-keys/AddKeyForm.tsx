'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AddKeyForm = () => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    const user = auth.currentUser;

    if (!user) {
      toast.error('User not logged in');
      return;
    }

    if (!name || !url || !key) {
      toast.error('Name, URL, and Key are required');
      return;
    }

    try {
      await addDoc(collection(db, 'users', user.uid, 'apiKeys'), {
        name,
        url,
        key,
        description,
        uid: user.uid,
        createdAt: new Date(),
      });
      toast.success('API Key added successfully');
      setName('');
      setUrl('');
      setKey('');
      setDescription('');
    } catch (error) {
      console.error(error);
      toast.error('Failed to add API Key');
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="API Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border bg-black text-white"
      />
      <input
        type="text"
        placeholder="API URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 border bg-black text-white"
      />
      <input
        type="text"
        placeholder="API Key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        className="w-full p-2 border bg-black text-white"
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 border bg-black text-white"
      />
      <Button onClick={handleAdd} className="bg-white hover:bg-[#1de9b6] text-black py-6 px-9 rounded-none">
        Add API Key
      </Button>
    </div>
  );
};

export default AddKeyForm;
