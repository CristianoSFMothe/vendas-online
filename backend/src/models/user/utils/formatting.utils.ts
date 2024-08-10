/**
 * Formata um CPF para o formato: 320.377.840-82
 * @param cpf - O CPF a ser formatado.
 * @returns O CPF formatado.
 */
export function formatCpf(cpf: string): string {
  const cleanCpf = cpf.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
  return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
