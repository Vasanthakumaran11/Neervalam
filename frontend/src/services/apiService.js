/**
 * Neervalam API Service
 * Centralized client for all FastAPI backend calls.
 * All /api/* requests are proxied to http://localhost:8000 via Vite.
 */

const BASE_URL = '/api';

// ─── Token Storage ────────────────────────────────────────────────────────────
export const TokenStorage = {
  get: () => localStorage.getItem('neervalam_token'),
  set: (token) => localStorage.setItem('neervalam_token', token),
  clear: () => localStorage.removeItem('neervalam_token'),
};

export const UserStorage = {
  get: () => {
    try {
      const raw = localStorage.getItem('neervalam_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  set: (user) => localStorage.setItem('neervalam_user', JSON.stringify(user)),
  clear: () => localStorage.removeItem('neervalam_user'),
};

// ─── Core HTTP Helper ─────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const token = TokenStorage.get();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data?.detail || data?.message || `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
}

// ─── Auth Endpoints ───────────────────────────────────────────────────────────

/**
 * Check if an email or phone number is already registered.
 * Returns { exists, email, phone, role, full_name }
 */
export async function checkUser(emailOrPhone) {
  const isEmail = String(emailOrPhone).includes('@');
  return request('/auth/check-user', {
    method: 'POST',
    body: JSON.stringify(isEmail ? { email: emailOrPhone.trim().toLowerCase() } : { phone: emailOrPhone }),
  });
}

/**
 * Step 1: Request Email/SMS OTP.
 * @param {string} emailOrPhone - User email (e.g. farmer@gmail.com) or phone
 * @param {string} role         - 'farmer' | 'government_official'
 * @param {string} authMode     - 'login' | 'signup'
 * @param {object} signupData   - { full_name, district, iot_hub_id } — only for signup
 */
export async function sendOTP(emailOrPhone, role, authMode = 'login', signupData = {}) {
  const isEmail = String(emailOrPhone).includes('@');
  return request('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({
      ...(isEmail ? { email: emailOrPhone.trim().toLowerCase() } : { phone: emailOrPhone }),
      role,
      auth_mode: authMode,
      ...signupData,
    }),
  });
}

/**
 * Step 2: Verify OTP and receive JWT session token.
 * @param {string} emailOrPhone
 * @param {string} otp
 * @param {string} role
 * @param {string} authMode     - 'login' | 'signup'
 * @param {object} signupData   - { full_name, district, iot_hub_id } — only for signup
 */
export async function verifyOTP(emailOrPhone, otp, role, authMode = 'login', signupData = {}) {
  const isEmail = String(emailOrPhone).includes('@');
  const data = await request('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({
      ...(isEmail ? { email: emailOrPhone.trim().toLowerCase() } : { phone: emailOrPhone }),
      otp: String(otp).trim(),
      role,
      auth_mode: authMode,
      ...signupData,
    }),
  });
  if (data.access_token) {
    TokenStorage.set(data.access_token);
    UserStorage.set(data.user);
  }
  return data;
}

/**
 * Get the current authenticated user profile from the backend.
 */
export async function getMyProfile() {
  return request('/auth/me');
}

// ─── Farmer Endpoints ─────────────────────────────────────────────────────────

/**
 * Fetch full IoT + farm data for a given farmer user.
 * @param {string} userId
 */
export async function getFarmerData(userId) {
  return request(`/users/${userId}`);
}

/**
 * Toggle the irrigation pump state for a farmer.
 * @param {string} userId
 * @param {'ON'|'OFF'} state
 */
export async function togglePump(userId, state) {
  return request(`/users/${userId}/pump`, {
    method: 'POST',
    body: JSON.stringify({ state }),
  });
}

// ─── Groundwater / Government Endpoints ──────────────────────────────────────

/**
 * Fetch district-level groundwater summary.
 */
export async function getGroundwaterSummary() {
  return request('/groundwater/districts/summary');
}

/**
 * Fetch all borewell stations for the map.
 */
export async function getStations(district = null) {
  const query = district ? `?district=${encodeURIComponent(district)}` : '';
  return request(`/groundwater/stations${query}`);
}

// ─── Health Check ─────────────────────────────────────────────────────────────
export async function checkBackendHealth() {
  const res = await fetch('/health');
  return res.ok ? res.json() : null;
}
