'use client';

import React from 'react';
import AddKeyForm from './AddKeyForm';
import APIKeyList from './APIKeyList';
import withAuth from '@/lib/withAuth';

function APIKeysPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8 pt-20">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-[#1de9b6] text-center">
          My API Keys
        </h1>
        <AddKeyForm />
        <APIKeyList />
      </div>
    </div>
  );
}

export default withAuth(APIKeysPage);
