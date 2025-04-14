import React from 'react';

interface CompressionStatsProps {
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  compressionTime?: number;
  isDecompression?: boolean;
}

const CompressionStats: React.FC<CompressionStatsProps> = ({
  originalSize,
  compressedSize,
  compressionRatio,
  compressionTime
}) => {
  const formatSize = (size: number) => {
    if (size < 1024) return `${size} bytes`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Compression Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Original Size:</p>
          <p className="text-lg font-medium">{formatSize(originalSize)}</p>
        </div>
        <div>
          <p className="text-gray-600">Compressed Size:</p>
          <p className="text-lg font-medium">{formatSize(compressedSize)}</p>
        </div>
        <div>
          <p className="text-gray-600">Compression Ratio:</p>
          <p className="text-lg font-medium">{compressionRatio.toFixed(2)}x</p>
        </div>
        <div>
          <p className="text-gray-600">Space Saved:</p>
          <p className="text-lg font-medium">
            {(100 * (1 - compressedSize / originalSize)).toFixed(2)}%
          </p>
        </div>
        {compressionTime !== undefined && (
          <div className="col-span-2">
            <p className="text-gray-600">Processing Time:</p>
            <p className="text-lg font-medium">{compressionTime.toFixed(2)} seconds</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompressionStats;
