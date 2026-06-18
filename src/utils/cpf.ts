export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function maskCPF(value: string): string {
  const d = onlyDigits(value).slice(0, 11)
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
}

function checkDigit(cpf: string, length: number): number {
  let sum = 0
  for (let i = 0; i < length; i++) {
    sum += Number(cpf[i]) * (length + 1 - i)
  }
  const rest = (sum * 10) % 11
  return rest === 10 ? 0 : rest
}

export function isValidCPF(value: string): boolean {
  const cpf = onlyDigits(value)
  if (cpf.length !== 11) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false
  return (
    checkDigit(cpf, 9) === Number(cpf[9]) &&
    checkDigit(cpf, 10) === Number(cpf[10])
  )
}
