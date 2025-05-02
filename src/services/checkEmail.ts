export function checkEmail(email: string) {
  const padrao = /^[\w.-]+@[\w.-]+\.\w+$/;
  return padrao.test(email);
}
