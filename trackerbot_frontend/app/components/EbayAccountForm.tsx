"use client";

import { useState } from "react";

interface EbayAccountFormProps {
  onSubmit: (data: { account_name: string; auth_token: string }) => void;
}

export default function EbayAccountForm({ onSubmit }: EbayAccountFormProps) {
  const [accountName, setAccountName] = useState("");
  const [authToken, setAuthToken] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ account_name: accountName, auth_token: authToken });
    setAccountName("");
    setAuthToken("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="accountName"
          className="block text-sm font-medium text-gray-700"
        >
          Account Name
        </label>
        <input
          type="text"
          id="accountName"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="authToken"
          className="block text-sm font-medium text-gray-700"
        >
          eBay Auth Token
        </label>
        <input
          type="password"
          id="authToken"
          value={authToken}
          onChange={(e) => setAuthToken(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Add eBay Account
      </button>
    </form>
  );
}
