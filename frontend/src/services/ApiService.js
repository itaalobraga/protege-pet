const API_URL = import.meta.env.VITE_API_URL;

class ApiService {
  static async resolver(response) {
    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: "Erro desconhecido" }));
      const err = new Error(body.error || `Erro HTTP: ${response.status}`);
      err.status = response.status;
      throw err;
    }
    return response.json().catch(() => null);
  }

  static async get(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      credentials: "include",
    });
    return this.resolver(response);
  }

  static async delete(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "DELETE",
      credentials: "include",
    });
    return this.resolver(response);
  }

  static async post(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.resolver(response);
  }

  static async put(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return this.resolver(response);
  }
}

export default ApiService;
