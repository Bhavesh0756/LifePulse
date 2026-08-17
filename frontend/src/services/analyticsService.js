const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'An error occurred fetching analytics.');
    error.code = data.code || 'API_ERROR';
    error.status = response.status;
    throw error;
  }
  return data;
}

export const analyticsService = {
  /**
   * Fetch Overview Analytics
   */
  async getOverviewAnalytics(filters = {}) {
    const params = new URLSearchParams();
    if (filters.range) params.append('range', filters.range);
    if (filters.bloodGroup && filters.bloodGroup !== 'ALL') params.append('bloodGroup', filters.bloodGroup);
    if (filters.city && filters.city !== 'ALL') params.append('city', filters.city);
    if (filters.hospitalId && filters.hospitalId !== 'ALL') params.append('hospitalId', filters.hospitalId);
    if (filters.customStart) params.append('customStart', filters.customStart);
    if (filters.customEnd) params.append('customEnd', filters.customEnd);

    const response = await fetch(`${API_BASE_URL}/admin/analytics/overview?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return handleResponse(response);
  },

  /**
   * Fetch Time-Series Trends Analytics
   */
  async getTrendsAnalytics(filters = {}) {
    const params = new URLSearchParams();
    if (filters.range) params.append('range', filters.range);
    if (filters.bloodGroup && filters.bloodGroup !== 'ALL') params.append('bloodGroup', filters.bloodGroup);
    if (filters.city && filters.city !== 'ALL') params.append('city', filters.city);
    if (filters.hospitalId && filters.hospitalId !== 'ALL') params.append('hospitalId', filters.hospitalId);

    const response = await fetch(`${API_BASE_URL}/admin/analytics/trends?${params.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return handleResponse(response);
  },
};
