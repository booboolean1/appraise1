'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db, storage } from '@/lib/firebase'; // Import db and storage
import { ref, uploadBytes } from 'firebase/storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // Import uuid
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, File, DollarSign, User } from 'lucide-react';

interface FileUploadProps {
  onUploadSuccess: (fileId: string) => void;
}

export function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [expectedValue, setExpectedValue] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !expectedValue || !fullName || !user) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const fileId = uuidv4(); // Generate a unique ID for the file and report
      const storageRef = ref(storage, `${user.uid}/${fileId}.pdf`);

      // 1. Upload the file directly to Firebase Storage
      const metadata = {
        customMetadata: {
          expectedValue: expectedValue.replace(/[^0-9]/g, ''),
          fullName: fullName,
          email: user.email || '',
        }
      };
      await uploadBytes(storageRef, file, metadata);

      // 2. Create the initial document in Firestore
      const reportRef = doc(db, 'reports', fileId);
      await setDoc(reportRef, {
        uid: user.uid,
        name: file.name,
        status: 'processing',
        timestamp: serverTimestamp(),
        expectedValue: Number(expectedValue.replace(/[^0-9]/g, '')),
        fullName: fullName,
      });

      onUploadSuccess(fileId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-lg p-3 text-center">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="file-upload" className="flex items-center gap-2 text-gray-300">
          <File className="w-4 h-4 text-orange-400" />
          Appraisal Report PDF
        </Label>
        <Input
          id="file-upload"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="bg-gray-800/50 border-gray-600/50"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fullName" className="flex items-center gap-2 text-gray-300">
          <User className="w-4 h-4 text-orange-400" />
          Your Full Name
        </Label>
        <Input
          id="fullName"
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="bg-gray-800/50 border-gray-600/50"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expectedValue" className="flex items-center gap-2 text-gray-300">
          <DollarSign className="w-4 h-4 text-orange-400" />
          Expected Property Value
        </Label>
        <Input
          id="expectedValue"
          type="number"
          placeholder="e.g., 500000"
          value={expectedValue}
          onChange={(e) => setExpectedValue(e.target.value)}
          className="bg-gray-800/50 border-gray-600/50"
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3"
        disabled={loading}
      >
        <Upload className="w-4 h-4 mr-2" />
        {loading ? 'Uploading...' : 'Upload and Analyze'}
      </Button>
    </form>
  );
}