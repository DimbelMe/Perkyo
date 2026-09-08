const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ? JSON.stringify(data.error) : `Request failed: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}