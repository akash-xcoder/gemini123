import React, { useRef } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.add('border-green-600', 'bg-green-100');
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-green-600', 'bg-green-100');
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-green-600', 'bg-green-100');
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-8"
      onClick={handleAreaClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="w-full border-4 border-dashed border-gray-300 rounded-2xl p-10 text-center transition-colors duration-300 hover:border-green-500 hover:bg-green-50">
        <UploadIcon className="mx-auto h-16 w-16 text-gray-400" />
        <h3 className="mt-4 text-2xl font-semibold text-gray-700">Drop your leaf image here</h3>
        <p className="text-gray-500">or click to browse</p>
        <p className="text-xs text-gray-400 mt-2">Supports: JPG, PNG, WEBP</p>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};
