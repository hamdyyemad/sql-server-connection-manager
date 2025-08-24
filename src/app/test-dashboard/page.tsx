"use client";
import { useState } from "react";

export default function TestDashboard() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testMockData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/dashboard?server=localhost&mock=true', {
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const testRealData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/dashboard?server=localhost', {
        headers: {
          'Authorization': 'Bearer test-token',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard API Test</h1>
      
      <div className="space-x-4 mb-6">
        <button
          onClick={testMockData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Mock Data
        </button>
        <button
          onClick={testRealData}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Test Real Data (Fallback to Mock)
        </button>
      </div>

      {loading && (
        <div className="mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading...</span>
        </div>
      )}

      {result && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Test Dashboard Page:</h2>
        <a 
          href="/dashboard?server=localhost&mock=true" 
          className="text-blue-600 hover:underline"
        >
          Go to Dashboard with Mock Data
        </a>
      </div>
    </div>
  );
}
