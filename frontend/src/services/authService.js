const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/**
 * Helper to handle fetch responses with standardized error parsing
 */
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.message || 'Invalid email or password.');
    error.code = data.code || 'API_ERROR';
    error.errors = data.errors || [];
    error.status = response.status;
    throw error;
  }
  return data;
}

async function safeFetch(url, options) {
  try {
    const response = await fetch(url, options);
    return await handleResponse(response);
  } catch (err) {
    if (err.name === 'TypeError' && (err.message.includes('Failed to fetch') || err.message.includes('NetworkError'))) {
      // Try fallback proxy path if absolute URL failed
      if (url.startsWith('http://localhost:5000/api')) {
        const proxyUrl = url.replace('http://localhost:5000/api', '/api');
        try {
          const fallbackRes = await fetch(proxyUrl, options);
          return await handleResponse(fallbackRes);
        } catch (fallbackErr) {
          throw new Error('Unable to connect to LifePulse server. Please verify backend server is running on http://localhost:5000.');
        }
      }
      throw new Error('Unable to connect to LifePulse server. Please verify backend server is running on http://localhost:5000.');
    }
    throw err;
  }
}

export const authService = {
  /**
   * Register a new Donor or Hospital user
   */
  async register(userData) {
    return safeFetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Login with email and password
   */
  async login(credentials) {
    return safeFetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Logout user and clear httpOnly cookie
   */
  async logout() {
    return safeFetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  },

  /**
   * Fetch current authenticated user (Session restoration on page load)
   */
  async getMe() {
    return safeFetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
  },
};
