const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

/** Erro com status HTTP e mensagens vindas do body da API */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    /** Mensagem técnica em inglês (para logs/debug) */
    message: string,
    /** Mensagem amigável em português (para exibir ao usuário) */
    public readonly userMessage?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /** Retorna userMessage se disponível, senão message */
  get displayMessage(): string {
    return this.userMessage ?? this.message;
  }
}

export interface ValidateTokenResponse {
  valid: boolean;
  isActive: boolean;
  message: string;
  token: {
    id: number;
    tokenHash: string;
    tokenGeneratedAt: string;
    tokenActivatedAt: string;
  } | null;
}

export interface ValidateCodeResponse {
  valid: boolean;
  isActive: boolean;
  message: string;
  token: {
    id: number;
    tokenHash: string;
    tokenGeneratedAt: string;
    tokenActivatedAt: string;
  } | null;
}

export interface RegisterUserResponse {
  message: string;
  user: {
    id: string;
    personDocument: string;
    codeVivaTech: string;
    [key: string]: unknown;
  };
  code: string;
  prizeAmountReais: number;
}

async function throwApiError(res: Response, fallback: string): Promise<never> {
  let message = fallback;
  let userMessage: string | undefined;
  try {
    const body = await res.json();
    if (typeof body?.message === 'string' && body.message.trim()) {
      message = body.message;
    }
    if (typeof body?.userMessage === 'string' && body.userMessage.trim()) {
      userMessage = body.userMessage;
    }
  } catch {
    // body não é JSON — mantém fallback
  }
  throw new ApiError(res.status, message, userMessage);
}

export async function validateToken(tokenHash: string): Promise<ValidateTokenResponse> {
  const res = await fetch(`${BASE_URL}/auth/token/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'tenant-id': 'viva' },
    body: JSON.stringify({ tokenHash }),
  });
  if (!res.ok) await throwApiError(res, `Erro ao validar token (${res.status})`);
  return res.json();
}
export async function validateCode(code: string): Promise<ValidateCodeResponse> {
  const res = await fetch(`${BASE_URL}/auth/code/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'tenant-id': 'viva' },
    body: JSON.stringify({ code }),
  });
  if (!res.ok) await throwApiError(res, `Erro ao validar código (${res.status})`);
  return res.json();
}
export async function registerUser(params: {
  documentNumber: string;
  personName: string;
  companyName: string;
  position: string;
}): Promise<RegisterUserResponse> {
  const res = await fetch(`${BASE_URL}/auth/register/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'tenant-id': 'viva' },
    body: JSON.stringify({
      documentNumber: params.documentNumber,
      personName: params.personName,
      metadata: {
        companyName: params.companyName,
        position: params.position,
      },
    }),
  });
  if (!res.ok) await throwApiError(res, `Erro ao cadastrar usuário (${res.status})`);
  return res.json();
}
