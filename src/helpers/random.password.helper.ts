export const randomPassword = () => {
  const chars: string =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const passwordSize: number = 10;
  let password: string = '';
  for (let i = 0; i < passwordSize; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};
