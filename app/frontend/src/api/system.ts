const API_BASE_URL = import.meta.env.DEV ? "/api" : "http://127.0.0.1:8765/api";

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}
