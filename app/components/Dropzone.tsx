'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
  maxFiles?: number;
}

export default function Dropzone({
  onFilesAdded,
  maxFiles = 5
}: DropzoneProps) {
  const [rejectedFiles, setRejectedFiles] = useState<any[]>([]);
  
  const onDrop = useCallback((acceptedFiles: File[], rejected: any[]) => {
    if (acceptedFiles?.length) {
      onFilesAdded(acceptedFiles);
    }
    
    setRejectedFiles(rejected);
  }, [onFilesAdded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    maxFiles
  });

  return (
    <div className="mt-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer
          ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
      >
        <input {...getInputProps()} />
        <div>
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 14v20c0 4.418 3.582 8 8 8h16c4.418 0 8-3.582 8-8V14c0-4.418-3.582-8-8-8H16c-4.418 0-8 3.582-8 8z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M24 14v20M14 24h20"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? 'ファイルをドロップしてください'
              : 'クリックまたはドラッグ＆ドロップでファイルをアップロード'}
          </p>
        </div>
      </div>

      {rejectedFiles.length > 0 && (
        <div className="mt-2 text-red-500 text-sm">
          {rejectedFiles.map(({ file, errors }) => (
            <div key={file.name}>
              {`${file.name}: ${errors.map((e: any) => e.message).join(', ')}`}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
