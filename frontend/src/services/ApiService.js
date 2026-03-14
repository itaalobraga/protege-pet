const API_URL = import.meta.env.VITE_API_URL;

function isNetworkError(error) {
  const msg = (error?.message || "").toLowerCase();
  return (
    msg.includes("failed to fetch") ||
    msg.includes("network") ||
    msg.includes("networkerror")
  );
}

class ApiService {
  static async handleResponse(response, endpoint = "") {
    if (!response.ok) {
      if (response.status === 401 && !endpoint.includes("/auth/login")) {
        window.dispatchEvent(new CustomEvent("auth:401"));
      }
      const error = await response.json().catch(() => ({
        error: "Erro desconhecido",
      }));
      throw new Error(error.error || `Erro HTTP: ${response.status}`);
    }
    return response.json().catch(() => null);
  }

  static normalizeError(error) {
    if (isNetworkError(error)) {
      return new Error("Não foi possível conectar ao servidor.");
    }
    return error;
  }

  static async get(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        credentials: "include",
      });
      return await this.handleResponse(response, endpoint);
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  static async delete(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
        credentials: "include",
      });
      return await this.handleResponse(response, endpoint);
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  static async post(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await this.handleResponse(response, endpoint);
    } catch (error) {
      throw this.normalizeError(error);
    }
  }

  static async put(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await this.handleResponse(response, endpoint);
    } catch (error) {
      throw this.normalizeError(error);
    }
  }
}

export default ApiService;
