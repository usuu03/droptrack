"use client";

import { useState } from "react";

interface BulkUploadFormProps {
  ebayAccounts: { id: number; account_name: string }[];
  onSubmit: (data: { ebay_account: number; file: File }) => void;
}

export default function BulkUploadForm({
  ebayAccounts,
  onSubmit,
}: BulkUploadFormProps) {
  const [ebayAccount, setEbayAccount] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      onSubmit({
        ebay_account: parseInt(ebayAccount),
        file: file,
      });
      setFile(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="ebayAccount"
          className="block text-sm font-medium text-gray-700"
        >
          eBay Account
        </label>
        <select
          id="ebayAccount"
          value={ebayAccount}
          onChange={(e) => setEbayAccount(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select an account</option>
          {ebayAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.account_name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="csvFile"
          className="block text-sm font-medium text-gray-700"
        >
          CSV File
        </label>
        <div className="mt-1 flex items-center">
          <input
            type="file"
            id="csvFile"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            required
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          Upload a CSV file with columns: ebay_order_id, tracking_number
        </p>
      </div>
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Upload CSV
      </button>
    </form>
  );
}
