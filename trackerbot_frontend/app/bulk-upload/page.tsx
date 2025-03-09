"use client";

import { useState, useEffect } from "react";
import BulkUploadForm from "../components/BulkUploadForm";
import { api, type EbayAccount, type BulkUpload } from "../services/api";

export default function BulkUploadPage() {
  const [accounts, setAccounts] = useState<EbayAccount[]>([]);
  const [uploads, setUploads] = useState<BulkUpload[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    const [accountsResponse, uploadsResponse] = await Promise.all([
      api.getEbayAccounts(),
      api.getBulkUploads(),
    ]);

    if (accountsResponse.error) {
      setError(accountsResponse.error);
    } else if (accountsResponse.data) {
      setAccounts(accountsResponse.data);
    }

    if (uploadsResponse.error) {
      setError(uploadsResponse.error);
    } else if (uploadsResponse.data) {
      setUploads(uploadsResponse.data);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (data: { ebay_account: number; file: File }) => {
    const formData = new FormData();
    formData.append("ebay_account", data.ebay_account.toString());
    formData.append("file", data.file);

    const response = await api.uploadBulkTracking(formData);
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
          <h1 className="text-2xl font-semibold text-gray-900">Bulk Upload</h1>
          <p className="mt-2 text-sm text-gray-700">
            Upload multiple tracking numbers at once using a CSV file.
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
            Upload CSV
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              Upload a CSV file containing eBay order IDs and Amazon tracking
              numbers.
            </p>
          </div>
          <div className="mt-5">
            <BulkUploadForm ebayAccounts={accounts} onSubmit={handleSubmit} />
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
                      Upload Date
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
                      Total Records
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {uploads.map((upload) => (
                    <tr key={upload.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                        {new Date(upload.created_at).toLocaleString()}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            upload.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : upload.status === "failed"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {upload.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {upload.total_records}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-indigo-600 h-2.5 rounded-full"
                              style={{
                                width: `${
                                  upload.total_records > 0
                                    ? (upload.processed_records /
                                        upload.total_records) *
                                      100
                                    : 0
                                }%`,
                              }}
                            ></div>
                          </div>
                          <span className="ml-2">
                            {upload.processed_records} / {upload.total_records}
                          </span>
                        </div>
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
