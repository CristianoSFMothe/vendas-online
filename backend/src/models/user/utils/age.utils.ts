export function calculateAge(dateOfBirth: string): number {
  const [day, month, year] = dateOfBirth.split('/').map(Number);
  const today = new Date();
  let age = today.getFullYear() - year;

  // Verifica se o aniversário já passou no ano atual
  const hasPassedBirthday =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);

  if (!hasPassedBirthday) {
    age--;
  }

  return age;
}
