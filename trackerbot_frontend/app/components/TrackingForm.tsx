"use client";

import { useState } from "react";

interface TrackingFormProps {
  ebayAccounts: { id: number; account_name: string }[];
  onSubmit: (data: {
    ebay_account: number;
    ebay_order_id: string;
    amazon_tracking_number: string;
  }) => void;
}

export default function TrackingForm({
  ebayAccounts,
  onSubmit,
}: TrackingFormProps) {
  const [ebayAccount, setEbayAccount] = useState("");
  const [ebayOrderId, setEbayOrderId] = useState("");
  const [amazonTracking, setAmazonTracking] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ebay_account: parseInt(ebayAccount),
      ebay_order_id: ebayOrderId,
      amazon_tracking_number: amazonTracking,
    });
    setEbayOrderId("");
    setAmazonTracking("");
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
          htmlFor="ebayOrderId"
          className="block text-sm font-medium text-gray-700"
        >
          eBay Order ID
        </label>
        <input
          type="text"
          id="ebayOrderId"
          value={ebayOrderId}
          onChange={(e) => setEbayOrderId(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="amazonTracking"
          className="block text-sm font-medium text-gray-700"
        >
          Amazon Tracking Number
        </label>
        <input
          type="text"
          id="amazonTracking"
          value={amazonTracking}
          onChange={(e) => setAmazonTracking(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Convert Tracking
      </button>
    </form>
  );
}
