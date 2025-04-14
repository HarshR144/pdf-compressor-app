'use client';

import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import CompressionStats from '../components/CompressionStats';
import PerformanceChart from '../components/PerformanceChart';

// Define a proper interface for the compression stats
interface DecompressionStats {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  decompressTime: number;
  performance?: {
    gpu_time: number;
    sequential_time: number;
    speedup: number;
  };
}

export default function DecompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decompressedText, setDecompressedText] = useState<string | null>(null);
  // Fix type definition for decompressStats
  const [decompressStats, setDecompressStats] = useState<DecompressionStats | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setDecompressedText(null);
    setDecompressStats(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a compressed file to decompress.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Read the file as base64
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        if (!event.target || typeof event.target.result !== 'string') {
          throw new Error('Failed to read file');
        }
        
        const base64Data = event.target.result.split(',')[1]; // Remove data URL prefix if present
        
        // Check if we're in development mode (with local API) or production (with Colab API)
        const apiUrl = process.env.NODE_ENV === 'development'
          ? '/api/decompress'
          : 'https://colab-api-url-here.com/decompress'; // Replace with your actual Colab endpoint
        
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            compressed_data: base64Data,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to decompress file');
        }

        const result = await response.json();
        setDecompressedText(result.decompressed_text);
        setDecompressStats({
          originalSize: result.original_size,
          compressedSize: result.compressed_size,
          compressionRatio: result.compression_ratio,
          decompressTime: result.performance?.gpu_time || 0,
          performance: result.performance
        });
      };
      
      reader.onerror = () => {
        throw new Error('Failed to read file');
      };
      
      reader.readAsDataURL(file);
    // Fix the catch statement type annotation
    } catch (err) {
      setError((err as Error).message || 'An error occurred during decompression');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadDecompressedText = () => {
    if (!decompressedText) return;
    
    const blob = new Blob([decompressedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file ? `${file.name.replace('.huf', '')}_decompressed.txt` : 'decompressed_text.txt';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
          Decompress File
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h2 className="text-lg font-medium mb-2">Upload Compressed File</h2>
            <FileUpload 
              accept=".huf" 
              onFileSelect={handleFileSelect} 
              label="Upload compressed .huf file" 
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
                : 'bg-green-600 text-white hover:bg-green-700'
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
              'Decompress File'
            )}
          </button>
        </form>

        {decompressStats && (
          <div className="mt-8 space-y-8">
            <CompressionStats
              originalSize={decompressStats.originalSize}
              compressedSize={decompressStats.compressedSize}
              compressionRatio={decompressStats.compressionRatio}
              compressionTime={decompressStats.decompressTime}
              isDecompression={true}
            />
            
            {/* Performance comparison chart */}
            {decompressStats.performance && (
              <PerformanceChart
                gpuTime={decompressStats.performance.gpu_time}
                sequentialTime={decompressStats.performance.sequential_time}
                speedup={decompressStats.performance.speedup}
                operationType="Decompression"
              />
            )}
          </div>
        )}

        {decompressedText && (
          <div className="mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Decompressed Text</h2>
                <button
                  onClick={downloadDecompressedText}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Download Text
                </button>
              </div>
              <div className="mt-4 max-h-96 overflow-y-auto border border-gray-200 rounded p-4 bg-gray-50">
                <pre className="whitespace-pre-wrap">{decompressedText}</pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}