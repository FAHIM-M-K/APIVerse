'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Props {
  onSuccess?: () => void; // Optional callback to notify parent if needed
}

const AddKeyForm: React.FC<Props> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    key: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'apiKeys'), formData);
      toast.success('API Key added!');
      setFormData({ name: '', url: '', key: '', description: '' });
      if (onSuccess) onSuccess();
    } catch {
      toast.error('Failed to add API Key.');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#0d0d0d] p-6 rounded-lg border border-white shadow-sm space-y-4"
    >
      <h2 className="text-xl font-semibold text-white">Add New API Key</h2>
      <input
        name="name"
        placeholder="API Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full px-4 py-2 bg-transparent text-white border border-white rounded placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#1de9b6]"
        required
      />
      <input
        name="url"
        placeholder="API URL (Endpoint)"
        value={formData.url}
        onChange={handleChange}
        className="w-full px-4 py-2 bg-transparent text-white border border-white rounded placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#1de9b6]"
        required
      />
      <input
        name="key"
        placeholder="API Key"
        value={formData.key}
        onChange={handleChange}
        className="w-full px-4 py-2 bg-transparent text-white border border-white rounded placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#1de9b6]"
        required
      />
      <textarea
        name="description"
        placeholder="Description (optional)"
        value={formData.description}
        onChange={handleChange}
        className="w-full px-4 py-2 bg-transparent text-white border border-white rounded placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-[#1de9b6] h-24"
      />
      <Button
        type="submit"
        className="w-full py-2 rounded border border-white text-black font-semibold bg-white hover:bg-[#1de9b6] hover:text-black transition duration-300"
      >
        Submit
      </Button>
    </form>
  );
};

export default AddKeyForm;
