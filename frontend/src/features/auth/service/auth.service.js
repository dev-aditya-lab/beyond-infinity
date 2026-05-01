const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

class AuthService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Required for HttpOnly cookies
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // Handle backend error format
        const error = new Error(data.message || `HTTP error! status: ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Auth service error:', error);
      throw error;
    }
  }

  // Send OTP - works for both login and signup
  async sendOTP(email, name = '', role = 'employee', avatar = '') {
    // Validate inputs according to backend rules
    if (!this.isValidEmail(email)) {
      throw new Error('Invalid email format');
    }
    if (name && (name.length < 2 || name.length > 50)) {
      throw new Error('Name must be between 2-50 characters');
    }
    if (role && !['admin', 'employee'].includes(role)) {
      throw new Error('Role must be admin or employee');
    }
    if (avatar && !this.isValidUrl(avatar)) {
      throw new Error('Avatar must be a valid URL');
    }

    const payload = { email };
    
    // Add optional fields only if provided
    if (name.trim()) payload.name = name.trim();
    if (role && ['admin', 'employee'].includes(role)) payload.role = role;
    if (avatar && this.isValidUrl(avatar)) payload.avatar = avatar;

    return this.request('/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Verify OTP and login
  async verifyOTP(email, otp) {
    // Validate OTP according to backend rules
    if (!this.isValidOTP(otp)) {
      throw new Error('OTP must be exactly 6 numeric digits');
    }

    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  }

  // Get current user
  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Logout
  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Validation helpers
  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  isValidOTP(otp) {
    return /^\d{6}$/.test(otp);
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }

  // Check if user is authenticated (has valid token)
  async isAuthenticated() {
    try {
      await this.getCurrentUser();
      return true;
    } catch (error) {
      return false;
    }
  }

  // Handle rate limiting
  async checkRateLimit(email) {
    try {
      const response = await this.request('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      return response;
    } catch (error) {
      if (error.status === 429) {
        throw new Error(`Rate limited. ${error.data?.retryAfter ? `Wait ${error.data.retryAfter} seconds` : 'Try again later'}`);
      }
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;
