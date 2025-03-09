const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    const error = await response.json();
    return { error: error.message || "An error occurred" };
  }
  const data = await response.json();
  return { data };
}

export interface EbayAccount {
  id: number;
  account_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TrackingConversion {
  id: number;
  ebay_account: number;
  ebay_order_id: string;
  amazon_tracking_number: string;
  converted_tracking_number: string | null;
  original_carrier: string;
  converted_carrier: string | null;
  status: string;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface BulkUpload {
  id: number;
  ebay_account: number;
  total_records: number;
  processed_records: number;
  successful_records: number;
  failed_records: number;
  status: string;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export const api = {
  // eBay Accounts
  async getEbayAccounts(): Promise<ApiResponse<EbayAccount[]>> {
    const response = await fetch(`${API_BASE_URL}/ebay-accounts/`, {
      credentials: "include",
    });
    return handleResponse<EbayAccount[]>(response);
  },

  async createEbayAccount(data: {
    account_name: string;
    auth_token: string;
  }): Promise<ApiResponse<EbayAccount>> {
    const response = await fetch(`${API_BASE_URL}/ebay-accounts/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return handleResponse<EbayAccount>(response);
  },

  // Tracking Conversions
  async convertTracking(data: {
    ebay_account: number;
    ebay_order_id: string;
    amazon_tracking_number: string;
  }): Promise<ApiResponse<TrackingConversion>> {
    const response = await fetch(
      `${API_BASE_URL}/tracking-conversions/convert_tracking/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      }
    );
    return handleResponse<TrackingConversion>(response);
  },

  async getTrackingConversions(): Promise<ApiResponse<TrackingConversion[]>> {
    const response = await fetch(`${API_BASE_URL}/tracking-conversions/`, {
      credentials: "include",
    });
    return handleResponse<TrackingConversion[]>(response);
  },

  // Bulk Uploads
  async uploadBulkTracking(data: FormData): Promise<ApiResponse<BulkUpload>> {
    const response = await fetch(`${API_BASE_URL}/bulk-uploads/upload_csv/`, {
      method: "POST",
      credentials: "include",
      body: data,
    });
    return handleResponse<BulkUpload>(response);
  },

  async getBulkUploads(): Promise<ApiResponse<BulkUpload[]>> {
    const response = await fetch(`${API_BASE_URL}/bulk-uploads/`, {
      credentials: "include",
    });
    return handleResponse<BulkUpload[]>(response);
  },
};
