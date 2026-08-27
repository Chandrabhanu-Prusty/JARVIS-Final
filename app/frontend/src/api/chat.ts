export type ChatResponse = {
  sessionId: string;
  reply: string;
  turnsRetained: number;
};

const API_BASE_URL = import.meta.env.DEV ? "/api" : "http://127.0.0.1:8765/api";

export async function sendChatMessage(sessionId: string, text: string): Promise<ChatResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, text }),
    });
  } catch {
    throw new Error("Backend unavailable. Start app/backend/run-dev.ps1, then try again.");
  }

  if (!response.ok) {
    const body: { detail?: string } = await response.json().catch(() => ({}));
    throw new Error(body.detail ?? "Jarvis could not process that message.");
  }

  return response.json() as Promise<ChatResponse>;
}
