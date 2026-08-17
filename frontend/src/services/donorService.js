const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'An error occurred during donor operation.');
    error.code = data.code || 'API_ERROR';
    error.status = response.status;
    throw error;
  }
  return data;
}

export const donorService = {
  /**
   * Get Donor Profile Information
   */
  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/donor/profile`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Update Donor Profile (address, preferred radius, emergency contact)
   */
  async updateProfile(profileData) {
    const response = await fetch(`${API_BASE_URL}/donor/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(profileData),
    });
    return handleResponse(response);
  },

  /**
   * Toggle Availability Switch (isAvailable)
   */
  async toggleAvailability(isAvailable) {
    const response = await fetch(`${API_BASE_URL}/donor/availability`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isAvailable }),
    });
    return handleResponse(response);
  },

  /**
   * Get Past Donation History
   */
  async getDonationHistory() {
    const response = await fetch(`${API_BASE_URL}/donor/history`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Get Incoming Emergency Blood Requests (With Search, Filters, Sort, Pagination)
   */
  async getIncomingRequests(params = {}) {
    const urlParams = new URLSearchParams();
    if (params.search) urlParams.append('search', params.search);
    if (params.urgency) urlParams.append('urgency', params.urgency);
    if (params.bloodGroup) urlParams.append('bloodGroup', params.bloodGroup);
    if (params.sortBy) urlParams.append('sortBy', params.sortBy);
    if (params.sortOrder) urlParams.append('sortOrder', params.sortOrder);
    if (params.page) urlParams.append('page', params.page.toString());
    if (params.limit) urlParams.append('limit', params.limit.toString());

    const response = await fetch(`${API_BASE_URL}/donor/requests?${urlParams.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Accept Blood Request & Share Contact Consent (Stage 6)
   */
  async acceptRequest(requestId) {
    const response = await fetch(`${API_BASE_URL}/donor/requests/${requestId}/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Decline Blood Request (Stage 6)
   */
  async declineRequest(requestId) {
    const response = await fetch(`${API_BASE_URL}/donor/requests/${requestId}/decline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Get All Consent Records Granted by Authenticated Donor (Stage 6)
   */
  async getDonorConsents() {
    const response = await fetch(`${API_BASE_URL}/donor/consents`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return handleResponse(response);
  },
};
