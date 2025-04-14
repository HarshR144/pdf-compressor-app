'use client'

import React, { useState } from 'react';
import FileUpload from './FileUpload';
import CompressionStats from './CompressionStats';
import PerformanceChart from './PerformanceChart';

// Define a proper interface for the compression result
interface CompressionResult {
  compressed_data: string;
  original_size: number;
  compressed_size: number;
  compression_ratio: number;
  compression_time?: number; // Optional if not always provided
  performance?: {
    gpu_time: number;
    sequential_time: number;
    speedup: number;
  };
}

const CompressForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compressionResult, setCompressionResult] = useState<CompressionResult | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setCompressionResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a PDF file to compress.');
      return;
    }

    // Check file size - limit to 10MB for this demo
    // if (file.size > 10 * 1024 * 1024) {
    //   setError('File size exceeds 10MB limit.');
    //   return;
    // }

    setIsLoading(true);
    setError(null);

    try {
      // Check if we're in development mode (with local API) or production (with Colab API)
      const apiUrl = process.env.NODE_ENV === 'development'
        ? '/api/compress'
        : 'https://colab-api-url-here.com/compress'; // Replace with your actual Colab endpoint
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to compress PDF');
      }

      const result = await response.json();
      console.log(result);
      setCompressionResult(result);
      
      // Automatically download the compressed file
      if (result.compressed_data) {
        const blob = base64ToBlob(result.compressed_data, 'application/octet-stream');
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.replace('.pdf', '')}_compressed.huf`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      setError((err as Error).message || 'An error occurred during compression');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-lg font-medium mb-2">Upload PDF Document</h2>
          <FileUpload 
            accept=".pdf" 
            onFileSelect={handleFileSelect} 
            label="Upload PDF file (MAX 10MB)" 
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!file || isLoading}
          className={`w-full py-3 px-6 rounded-md font-medium ${
            !file || isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Compress PDF'
          )}
        </button>
      </form>

      {compressionResult && (
        <div className="mt-8 space-y-8">
          <CompressionStats
            originalSize={compressionResult.original_size}
            compressedSize={compressionResult.compressed_size}
            compressionRatio={compressionResult.compression_ratio}
            compressionTime={compressionResult.performance?.gpu_time}
          />
          
          {/* Performance comparison chart */}
          {compressionResult.performance && (
            <PerformanceChart
              gpuTime={compressionResult.performance.gpu_time}
              sequentialTime={compressionResult.performance.sequential_time}
              speedup={compressionResult.performance.speedup}
              operationType="Compression"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CompressForm;