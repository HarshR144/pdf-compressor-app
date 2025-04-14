// components/PerformanceChart.tsx
'use client'

import React from 'react';
import { Bar } from 'recharts';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceComparisonProps {
  gpuTime: number;
  sequentialTime: number;
  speedup: number;
  operationType: 'Compression' | 'Decompression';
}

const PerformanceChart: React.FC<PerformanceComparisonProps> = ({ 
  gpuTime, 
  sequentialTime, 
  speedup,
  operationType
}) => {
  // Format times to milliseconds with 2 decimal places
  const gpuTimeMs = (gpuTime * 1000).toFixed(2);
  const sequentialTimeMs = (sequentialTime * 1000).toFixed(2);
  
  const data = [
    { name: 'GPU-Accelerated', time: parseFloat(gpuTimeMs) },
    { name: 'Sequential (CPU)', time: parseFloat(sequentialTimeMs) },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{operationType} Performance Comparison</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">GPU Time</p>
          <p className="text-xl font-semibold">{gpuTimeMs} ms</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">Sequential Time</p>
          <p className="text-xl font-semibold">{sequentialTimeMs} ms</p>
        </div>
        <div className="bg-green-50 p-4 rounded-md">
          <p className="text-sm text-gray-600">Speedup</p>
          <p className="text-xl font-semibold">{speedup.toFixed(2)}x</p>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
            <Tooltip formatter={(value) => [`${value} ms`, 'Execution Time']} />
            <Legend />
            <Bar dataKey="time" name="Execution Time (ms)" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceChart;