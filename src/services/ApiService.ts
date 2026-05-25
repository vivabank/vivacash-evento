const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export interface RegisterEventPayload {
    documentNumber: string;
    personName: string;
    metadata: {
        companyName: string;
        position: string;
    };
}

export async function registerEvent(payload: RegisterEventPayload): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/register/event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Erro ao registrar: ${response.status}`);
    }
}
