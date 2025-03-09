"use client";

import { useState, useEffect } from "react";
import TrackingForm from "../components/TrackingForm";
import {
  api,
  type EbayAccount,
  type TrackingConversion,
} from "../services/api";

export default function TrackingPage() {
  const [accounts, setAccounts] = useState<EbayAccount[]>([]);
  const [conversions, setConversions] = useState<TrackingConversion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    const [accountsResponse, conversionsResponse] = await Promise.all([
      api.getEbayAccounts(),
      api.getTrackingConversions(),
    ]);

    if (accountsResponse.error) {
      setError(accountsResponse.error);
    } else if (accountsResponse.data) {
      setAccounts(accountsResponse.data);
    }

    if (conversionsResponse.error) {
      setError(conversionsResponse.error);
    } else if (conversionsResponse.data) {
      setConversions(conversionsResponse.data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (data: {
    ebay_account: number;
    ebay_order_id: string;
    amazon_tracking_number: string;
  }) => {
    const response = await api.convertTracking(data);
    if (response.error) {
      setError(response.error);
    } else {
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Track Conversions
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Convert Amazon tracking numbers to eBay-compatible tracking.
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
            Convert Tracking
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Enter the eBay order ID and Amazon tracking number to convert.
            </p>
          </div>
          <div className="mt-5">
            <TrackingForm ebayAccounts={accounts} onSubmit={handleSubmit} />
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
                      eBay Order ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Amazon Tracking
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Converted Tracking
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {conversions.map((conversion) => (
                    <tr key={conversion.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {conversion.ebay_order_id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {conversion.amazon_tracking_number}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {conversion.converted_tracking_number || "-"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            conversion.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : conversion.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {conversion.status}
                        </span>
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
