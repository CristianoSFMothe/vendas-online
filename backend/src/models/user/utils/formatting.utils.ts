/**
 * Formata um CPF para o formato: 320.377.840-82
 * @param cpf - O CPF a ser formatado.
 * @returns O CPF formatado.
 */
export function formatCpf(cpf: string): string {
  const cleanCpf = cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
  return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

/**
 * Formata um RG para o formato: 28.871.873-2 ou 27.650.310-7
 * @param rg - O RG a ser formatado.
 * @returns O RG formatado.
 */
export function formatRg(rg: string): string {
  const cleanRg = rg.replace(/\D/g, ''); // Remove todos os caracteres não numéricos

  // Formata RG com base no comprimento
  if (cleanRg.length === 9) {
    return cleanRg.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4');
  } else if (cleanRg.length === 8) {
    return cleanRg.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
  } else {
    return cleanRg; // Retorna o RG sem formatação se o comprimento não corresponder
  }
}
