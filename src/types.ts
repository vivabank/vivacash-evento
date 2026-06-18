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

export interface StepFinalProps {
  formData: FormData | null
  /** Chamado quando o usuário quer voltar ao formulário (ex: CPF já cadastrado) */
  onBackToForm: () => void
}
