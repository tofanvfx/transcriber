
import React, { useCallback, useRef } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, selectedFile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onFileSelect(event.target.files[0]);
    }
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onFileSelect(event.dataTransfer.files[0]);
      if (fileInputRef.current) {
         // This is a bit of a hack to make sure the input visually reflects the dropped file
         // though it's not strictly necessary if we only rely on the state.
         fileInputRef.current.files = event.dataTransfer.files;
      }
    }
  }, [onFileSelect]);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <label htmlFor="file-upload" className="block text-sm font-medium text-slate-300">
        Upload Audio/Video File
      </label>
      <label
        htmlFor="file-upload-input"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-600 border-dashed rounded-md cursor-pointer hover:border-sky-500 transition-colors duration-150 ease-in-out"
      >
        <div className="space-y-1 text-center">
          <svg
            className="mx-auto h-12 w-12 text-slate-500"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex text-sm text-slate-400">
            <span className="relative rounded-md font-medium text-sky-400 hover:text-sky-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-slate-800 focus-within:ring-sky-500" onClick={triggerFileInput}>
              Upload a file
            </span>
            <input
              id="file-upload-input"
              name="file-upload-input"
              type="file"
              className="sr-only"
              accept="audio/*,video/*"
              onChange={handleFileChange}
              ref={fileInputRef}
            />
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-slate-500">MP3, WAV, MP4, MOV, etc.</p>
        </div>
      </label>
      {selectedFile && (
        <p className="text-sm text-emerald-400 mt-2">
          Selected: <span className="font-semibold">{selectedFile.name}</span> ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
        </p>
      )}
    </div>
  );
};
