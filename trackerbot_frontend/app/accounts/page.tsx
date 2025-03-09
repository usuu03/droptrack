"use client";

import { useState, useEffect } from "react";
import EbayAccountForm from "../components/EbayAccountForm";
import { api, type EbayAccount } from "../services/api";

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<EbayAccount[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = async () => {
    const response = await api.getEbayAccounts();
    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setAccounts(response.data);
    }
  };

  useEffect(() => {
    loadAccounts();
  }, []);

  const handleSubmit = async (data: {
    account_name: string;
    auth_token: string;
  }) => {
    const response = await api.createEbayAccount(data);
    if (response.error) {
      setError(response.error);
    } else {
      loadAccounts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            eBay Accounts
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your eBay accounts for tracking number conversion.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Add eBay Account
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>Add a new eBay account to manage tracking number conversions.</p>
          </div>
          <div className="mt-5">
            <EbayAccountForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Account Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Created At
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {accounts.map((account) => (
                    <tr key={account.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {account.account_name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            account.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {account.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {new Date(account.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
