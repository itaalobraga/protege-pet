const API_URL = import.meta.env.VITE_API_URL;

class ApiService {
  static async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: "Erro desconhecido",
      }));
      throw new Error(error.error || `Erro HTTP: ${response.status}`);
    }
    return response.json();
  }

  static async get(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`);
      return await this.handleResponse(response);
    } catch (error) {
      console.error(`Erro na requisição GET: ${error}`);
      throw error;
    }
  }

  static async delete(endpoint) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error("Erro na requisição DELETE:", error);
      throw error;
    }
  }

  static async post(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error("Erro na requisição POST:", error);
      throw error;
    }
  }

  static async put(endpoint, data) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      return await this.handleResponse(response);
    } catch (error) {
      console.error("Erro na requisição PUT:", error);
      throw error;
    }
  }
}

export default ApiService;
