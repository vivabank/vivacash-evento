const BASE_URL = import.meta.env.VITE_API_BASE_URL as string

export interface ValidateTokenResponse {
  valid: boolean
  isActive: boolean
  message: string
  token: {
    id: number
    tokenHash: string
    tokenGeneratedAt: string
    tokenActivatedAt: string
  } | null
}

export interface RegisterUserResponse {
  message: string
  user: {
    id: string
    personDocument: string
    codeVivaTech: string
    [key: string]: unknown
  }
  code: string
  prizeAmountReais: number
}

export async function validateToken(tokenHash: string): Promise<ValidateTokenResponse> {
  const res = await fetch(`${BASE_URL}/auth/token/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokenHash }),
  })
  if (!res.ok) throw new Error(`Erro ao validar token (${res.status})`)
  return res.json()
}

export async function registerUser(params: {
  documentNumber: string
  personName: string
  companyName: string
  position: string
}): Promise<RegisterUserResponse> {
  const res = await fetch(`${BASE_URL}/auth/register/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      documentNumber: params.documentNumber,
      personName: params.personName,
      metadata: {
        companyName: params.companyName,
        position: params.position,
      },
    }),
  })
  if (!res.ok) throw new Error(`Erro ao cadastrar usuário (${res.status})`)
  return res.json()
}
