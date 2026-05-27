export interface FormData {
  nome: string
  cpf: string
  empresa: string
  cargo: string
}

export interface StepProps {
  onNext: () => void
}

export interface StepFormProps {
  onNext: (data: FormData) => void
}
