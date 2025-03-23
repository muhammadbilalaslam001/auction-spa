export const cookieUtils = {
  setToken(token: string, expiresInHours: number = 1): void {
    const expirationDate = new Date();
    expirationDate.setTime(expirationDate.getTime() + expiresInHours * 60 * 60 * 1000);
    document.cookie = `token=${token}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
  },

  getToken(): string | null {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];
    return token || null;
  },

  removeToken(): void {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  },
};
