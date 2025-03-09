"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  total_conversions: number;
  successful_conversions: number;
  failed_conversions: number;
  active_accounts: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    total_conversions: 0,
    successful_conversions: 0,
    failed_conversions: 0,
    active_accounts: 0,
  });

  useEffect(() => {
    // TODO: Fetch stats from API
    // For now, using mock data
    setStats({
      total_conversions: 150,
      successful_conversions: 142,
      failed_conversions: 8,
      active_accounts: 3,
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Overview of your tracking conversion statistics and recent activity.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/tracking"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Convert Tracking
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Total Conversions
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {stats.total_conversions}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Successful Conversions
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">
            {stats.successful_conversions}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Failed Conversions
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-red-600">
            {stats.failed_conversions}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Active eBay Accounts
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {stats.active_accounts}
          </dd>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400">
            <Link href="/tracking" className="focus:outline-none">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">
                    Convert Single Tracking
                  </p>
                  <p className="text-sm text-gray-500">
                    Convert an individual Amazon tracking number
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="relative rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm hover:border-gray-400">
            <Link href="/bulk-upload" className="focus:outline-none">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-indigo-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="absolute inset-0" aria-hidden="true" />
                  <p className="text-sm font-medium text-gray-900">
                    Bulk Upload
                  </p>
                  <p className="text-sm text-gray-500">
                    Upload multiple tracking numbers via CSV
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
