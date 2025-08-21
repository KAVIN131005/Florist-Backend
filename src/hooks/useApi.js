import { useAuth } from "./useAuth";

export const useApi = () => {
  const { token } = useAuth();

  const request = async (url, options = {}) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
    if (!res.ok) throw new Error("API Error");
    return res.json();
  };

  return { request };
};
