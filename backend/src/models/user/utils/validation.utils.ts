/**
 * Valida um CPF usando regex.
 * Aceita CPF nos formatos: 320.377.840-82 ou 32037784082
 * @param cpf - O CPF a ser validado.
 * @returns `true` se o CPF for válido, caso contrário `false`.
 */
export function isValidCpf(cpf: string): boolean {
  const cpfRegex = /^(?:\d{3}\.\d{3}\.\d{3}-\d{2}|\d{11})$/;
  return cpfRegex.test(cpf);
}

/**
 * Valida um RG usando regex.
 * Aceita RG nos formatos: 28.871.873-2, 288718732 ou 276503107
 * @param rg - O RG a ser validado.
 * @returns `true` se o RG for válido, caso contrário `false`.
 */
export function isValidRg(rg: string): boolean {
  // Aceita RG com 7 a 9 dígitos e com formatação ou sem formatação
  const rgRegex = /^(?:\d{2}\.\d{3}\.\d{3}-\d|\d{7,9})$/;
  return rgRegex.test(rg);
}
