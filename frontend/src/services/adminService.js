const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'An error occurred during admin operation.');
    error.code = data.code || 'API_ERROR';
    error.status = response.status;
    throw error;
  }
  return data;
}

export const adminService = {
  /**
   * Get System Dashboard Metrics
   */
  async getMetrics() {
    const response = await fetch(`${API_BASE_URL}/admin/metrics`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Get Hospital Accounts for Review (With Search, Status, Sort, Pagination)
   */
  async getHospitals(statusOrParams = 'all', searchArg = '') {
    const params = new URLSearchParams();
    if (typeof statusOrParams === 'object' && statusOrParams !== null) {
      const { status, search, sortBy, sortOrder, page, limit } = statusOrParams;
      if (status && status !== 'all') params.append('status', status);
      if (search) params.append('search', search);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
    } else {
      if (statusOrParams && statusOrParams !== 'all') params.append('status', statusOrParams);
      if (searchArg) params.append('search', searchArg);
    }

    const response = await fetch(`${API_BASE_URL}/admin/hospitals?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Approve or Reject Hospital Verification
   */
  async verifyHospital(hospitalId, action, notes = '') {
    const response = await fetch(`${API_BASE_URL}/admin/hospitals/${hospitalId}/verify`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ action, notes }),
    });
    return handleResponse(response);
  },

  /**
   * Get Platform Users Directory (With Search, Role, Status, Sort, Pagination)
   */
  async getUsers(roleOrParams = 'all', searchArg = '', statusArg = 'all') {
    const params = new URLSearchParams();
    if (typeof roleOrParams === 'object' && roleOrParams !== null) {
      const { role, search, status, sortBy, sortOrder, page, limit } = roleOrParams;
      if (role && role !== 'all') params.append('role', role);
      if (status && status !== 'all') params.append('status', status);
      if (search) params.append('search', search);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
    } else {
      if (roleOrParams && roleOrParams !== 'all') params.append('role', roleOrParams);
      if (statusArg && statusArg !== 'all') params.append('status', statusArg);
      if (searchArg) params.append('search', searchArg);
    }

    const response = await fetch(`${API_BASE_URL}/admin/users?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Toggle User Active Status (Suspend / Activate)
   */
  async toggleUserStatus(userId, isActive) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ isActive }),
    });
    return handleResponse(response);
  },

  /**
   * Update User Role (Protected Admin Action)
   */
  async updateUserRole(userId, role) {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ role }),
    });
    return handleResponse(response);
  },

  /**
   * Get System-Wide Blood Requests (With Search, Filters, Sort, Pagination)
   */
  async getAllRequests(statusOrParams = 'all', urgencyArg = 'all', bloodGroupArg = 'all', searchArg = '') {
    const params = new URLSearchParams();
    if (typeof statusOrParams === 'object' && statusOrParams !== null) {
      const { status, urgency, bloodGroup, city, search, sortBy, sortOrder, page, limit } = statusOrParams;
      if (status && status !== 'all') params.append('status', status);
      if (urgency && urgency !== 'all') params.append('urgency', urgency);
      if (bloodGroup && bloodGroup !== 'all') params.append('bloodGroup', bloodGroup);
      if (city && city !== 'all') params.append('city', city);
      if (search) params.append('search', search);
      if (sortBy) params.append('sortBy', sortBy);
      if (sortOrder) params.append('sortOrder', sortOrder);
      if (page) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
    } else {
      if (statusOrParams && statusOrParams !== 'all') params.append('status', statusOrParams);
      if (urgencyArg && urgencyArg !== 'all') params.append('urgency', urgencyArg);
      if (bloodGroupArg && bloodGroupArg !== 'all') params.append('bloodGroup', bloodGroupArg);
      if (searchArg) params.append('search', searchArg);
    }

    const response = await fetch(`${API_BASE_URL}/admin/requests?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Cancel an Active Blood Request (Admin Governance Control)
   */
  async cancelRequest(requestId, reason = '') {
    const response = await fetch(`${API_BASE_URL}/admin/requests/${requestId}/cancel`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ reason }),
    });
    return handleResponse(response);
  },
};
