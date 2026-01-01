const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Login failed');
  }
  const data = await res.json();
  // store token and user
  if (data.token) localStorage.setItem('ct_token', data.token);
  if (data.user) localStorage.setItem('ct_user', JSON.stringify(data.user));
  return data;
}

export async function registerMember(payload) {
  const res = await fetch(`${API_BASE}/api/auth/member/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Register failed');
  }
  const data = await res.json();
  if (data.token) localStorage.setItem('ct_token', data.token);
  if (data.member) localStorage.setItem('ct_user', JSON.stringify(data.member));
  return data;
}

export async function registerAdmin(payload) {
  const res = await fetch(`${API_BASE}/api/auth/admin/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Register failed');
  }
  const data = await res.json();
  if (data.token) localStorage.setItem('ct_token', data.token);
  if (data.admin) localStorage.setItem('ct_user', JSON.stringify(data.admin));
  return data;
}

export function logout() {
  localStorage.removeItem('ct_token');
  localStorage.removeItem('ct_user');
}

export function getToken() {
  return localStorage.getItem('ct_token');
}

export function getUser() {
  try { return JSON.parse(localStorage.getItem('ct_user')); } catch { return null; }
}

// helper to call protected endpoints
export async function apiFetch(path, opts = {}) {
  const headers = opts.headers || {};
  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...opts, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Request failed');
  }
  return res.json().catch(() => ({}));
}
