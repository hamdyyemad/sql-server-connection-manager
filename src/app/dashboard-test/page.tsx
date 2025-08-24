"use client";
import { useState } from "react";

export default function DashboardTest() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDashboard = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "/api/v1/dashboard?server=localhost&mock=true"
      );
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard Test</h1>

      <div className="space-x-4 mb-6">
        <button
          onClick={testDashboard}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Dashboard API
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

      <div className="mt-6 space-y-4">
        <h2 className="text-lg font-semibold">Test Links:</h2>
        <div className="space-y-2">
          <a
            href="/dashboard?server=localhost&mock=true"
            className="block text-blue-600 hover:underline"
          >
            Dashboard with Mock Data
          </a>
          <a href="/dashboard" className="block text-blue-600 hover:underline">
            Dashboard (should show connection selector)
          </a>
          <a href="/" className="block text-blue-600 hover:underline">
            Home Page
          </a>
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Database Setup Guide</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Current Status:</strong> Dashboard is working with sample data</p>
            <p><strong>To use real database data:</strong></p>
            <ol className="list-decimal list-inside space-y-1 ml-4">
              <li>Install SQL Server (Express or Developer edition)</li>
              <li>Create a user: <code className="bg-gray-200 px-1 rounded">testuser</code> with password: <code className="bg-gray-200 px-1 rounded">Admin</code></li>
              <li>Run: <code className="bg-gray-200 px-1 rounded">node scripts/setup-dashboard-database.js</code></li>
              <li>Or use SQL script: <code className="bg-gray-200 px-1 rounded">create-dashboard-tables.sql</code></li>
            </ol>
            <p className="mt-2">
              <a 
                href="/DASHBOARD_DATABASE_SETUP.md" 
                className="text-blue-600 hover:underline"
                target="_blank"
              >
                View complete setup guide →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
