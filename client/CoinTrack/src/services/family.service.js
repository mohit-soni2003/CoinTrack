const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

async function apiFetch(path, token) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
  
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers
  });
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Request failed');
  }
  
  return res.json();
}

export async function getFamilyDetails(token) {
  return apiFetch('/api/family/details', token);
}

export async function getFamilyMembers(token) {
  return apiFetch('/api/family/members', token);
}

export async function getMemberProfile(token, memberId) {
  return apiFetch(`/api/family/members/${memberId}`, token);
}

export async function getFamilyBalance(token) {
  return apiFetch('/api/family/balance', token);
}
