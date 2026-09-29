const API_BASE =
  import.meta.env.VITE_API_URL ||
  `${window.location.protocol}//${window.location.hostname}/attendance_system/PHP`;

export async function apiRequest(action, options = {}) {
  const query = options.query ? `&${new URLSearchParams(options.query)}` : "";
  const response = await fetch(
    `${API_BASE}/api.php?action=${encodeURIComponent(action)}${query}`,
    {
      method: options.method || "GET",
      headers: options.body
        ? { "Content-Type": "application/json" }
        : undefined,
      body: options.body ? JSON.stringify(options.body) : undefined,
    },
  );
  const data = await response
    .json()
    .catch(() => ({ status: "error", message: "Invalid server response." }));
  if (!response.ok || data.status === "error")
    throw new Error(data.message || "Request failed.");
  return data;
}

export { API_BASE };
