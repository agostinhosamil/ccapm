export const config = {
  get apiUrl() {
    return String(import.meta.env.VITE_API_BASE_URL);
  },
};
