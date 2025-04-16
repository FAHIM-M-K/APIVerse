'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Select from 'react-select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import withAuth from '@/lib/withAuth';
import Papa from 'papaparse';

type APIKey = {
  id: string;
  name: string;
  url: string;
  key: string;
};

type PredictionResult = { [key: string]: unknown };

const PredictPage = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const [inputData, setInputData] = useState<{ [key: string]: unknown }[]>([]);
  const [downloadFormat, setDownloadFormat] = useState<'csv' | 'json'>('csv');
  const [includeFullData, setIncludeFullData] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchKeys = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = collection(db, 'users', user.uid, 'apiKeys');
      const snapshot = await getDocs(q);
      const keys = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<APIKey, 'id'>),
      }));
      setApiKeys(keys);
    };

    fetchKeys();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setFileName(selected ? selected.name : null);
  };

  const handlePredict = async () => {
    if (!selectedKey || !file) {
      toast.error('Please select an API key and upload a file.');
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        setLoading(true);
        let parsedInput: { [key: string]: unknown }[] = [];

        if (extension === 'json') {
          parsedInput = JSON.parse(e.target?.result as string);
        } else if (extension === 'csv') {
          const parsed = Papa.parse(e.target?.result as string, {
            header: true,
            skipEmptyLines: true,
          });
          parsedInput = parsed.data as { [key: string]: unknown }[];
        } else {
          toast.error('Unsupported file type.');
          setLoading(false);
          return;
        }

        setInputData(parsedInput);

        const allResults: PredictionResult[] = [];

        for (const record of parsedInput) {
          const payload = { features: record };
          const response = await fetch(selectedKey.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': selectedKey.key,
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
          }

          const result = await response.json();
          allResults.push(result);
        }

        setResults(allResults);
        toast.success('Prediction complete!');

        const merged = includeFullData
          ? parsedInput.map((entry, i) => ({ ...entry, ...allResults[i] }))
          : allResults;

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `predictions-${timestamp}.${downloadFormat}`;

        if (downloadFormat === 'csv') {
          const csv = Papa.unparse(merged);
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          const jsonBlob = new Blob([JSON.stringify(merged, null, 2)], { type: 'application/json' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(jsonBlob);
          link.setAttribute('download', filename);
          link.click();
        }
      } catch (err) {
        toast.error('Failed to process prediction.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 pt-20">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-[#1de9b6] text-center">Predict with Your API</h1>

        <div>
          <label className="block text-white font-semibold mb-2">Select API Key</label>
          <Select
            options={apiKeys.map((key) => ({
              value: key.id,
              label: key.name,
              data: key,
            }))}
            onChange={(option) => setSelectedKey(option?.data || null)}
            className="text-white"
            classNames={{
              control: () => 'bg-black text-white border border-white rounded-none',
              menu: () => 'bg-black text-white border border-white',
              dropdownIndicator: () => 'text-white',
              indicatorSeparator: () => 'bg-white',
            }}
            placeholder="Search or select an API key"
            isSearchable
            styles={{
              control: (base) => ({ ...base, backgroundColor: 'black', borderColor: 'white', borderRadius: 0, color: 'white' }),
              menu: (base) => ({ ...base, backgroundColor: 'black', borderColor: 'white', borderRadius: 0 }),
              dropdownIndicator: (base) => ({ ...base, color: 'white' }),
              input: (base) => ({ ...base, color: 'white' }),
              singleValue: (base) => ({ ...base, color: 'white' }),
              option: (base, { isFocused }) => ({
                ...base,
                backgroundColor: 'black',
                color: isFocused ? '#1de9b6' : 'white',
                padding: '4px 8px',
                borderBottom: '1px solid white',
                '&:last-child': { borderBottom: 'none' },
                '&:hover': { backgroundColor: 'black', color: '#1de9b6' },
              }),
            }}
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="border border-white px-4 py-2 cursor-pointer flex items-center gap-2 bg-white text-black hover:bg-[#1de9b6] transition">
            <span>＋ Upload File</span>
            <input type="file" accept=".json,.csv" onChange={handleFileChange} className="hidden" />
          </label>
          {fileName && <span className="text-sm text-white">{fileName}</span>}
        </div>

        <div className="flex flex-wrap gap-4 pt-2">
          <div className="flex items-center gap-2">
            <label htmlFor="format" className="text-white">Download as:</label>
            <select
              id="format"
              value={downloadFormat}
              onChange={(e) => setDownloadFormat(e.target.value as 'csv' | 'json')}
              className="bg-black text-white border border-white p-1 rounded-none"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={includeFullData}
              onChange={() => setIncludeFullData(!includeFullData)}
            />
            <label className="text-white">
              {includeFullData ? 'Include full input in download' : 'Only include prediction in download'}
            </label>
          </div>
        </div>

        <div className="text-center pt-4">
          <Button
            onClick={handlePredict}
            className="bg-white text-black px-6 py-3 text-lg hover:bg-[#1de9b6] hover:text-black rounded-none"
            disabled={loading}
          >
            {loading ? 'Predicting...' : 'Predict'}
          </Button>
        </div>

        {loading && (
          <div className="text-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1de9b6] mx-auto"></div>
            <p className="mt-2 text-white">Processing predictions...</p>
          </div>
        )}

        {results.length > 0 && !loading && (
          <div className="pt-6 overflow-x-auto">
            <h2 className="text-xl font-semibold text-[#1de9b6] mb-4">Prediction Results</h2>
            <table className="min-w-full text-left border border-white">
              <thead>
                <tr>
                  {Object.keys(includeFullData ? { ...inputData[0], ...results[0] } : results[0]).map((key) => (
                    <th key={key} className="border border-white p-2">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((res, idx) => {
                  const row = includeFullData ? { ...inputData[idx], ...res } : res;
                  return (
                    <tr key={idx}>
                      {Object.values(row).map((val, i) => (
                        <td key={i} className="border border-white p-2">
                          {val !== null && typeof val === 'object' ? JSON.stringify(val) : String(val)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(PredictPage);