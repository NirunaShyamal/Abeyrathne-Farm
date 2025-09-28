// API service for connecting frontend to backend
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  // Generic HTTP methods
  async get(url) {
    try {
      console.log('Making GET request to:', `${API_BASE_URL}${url}`);
      
      const response = await fetch(`${API_BASE_URL}${url}`);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('GET request failed:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        url: `${API_BASE_URL}${url}`
      });
      throw error;
    }
  }

  async post(url, data) {
    try {
      console.log('Making POST request to:', `${API_BASE_URL}${url}`);
      console.log('Request data:', data);
      
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const result = await response.json();
      console.log('Response data:', result);
      
      if (!response.ok) {
        throw new Error(result.message || 'Request failed');
      }
      
      return result;
    } catch (error) {
      console.error('POST request failed:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        url: `${API_BASE_URL}${url}`,
        data: data
      });
      throw error;
    }
  }

  async put(url, data) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Request failed');
      }
      
      return result;
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  }

  async delete(url) {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Request failed');
      }
      
      return result;
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  }

  // Egg Production API methods
  async getEggProductionRecords() {
    return this.get('/egg-production');
  }

  async getEggProductionRecord(id) {
    return this.get(`/egg-production/${id}`);
  }

  async createEggProductionRecord(data) {
    return this.post('/egg-production', data);
  }

  async updateEggProductionRecord(id, data) {
    return this.put(`/egg-production/${id}`, data);
  }

  async deleteEggProductionRecord(id) {
    return this.delete(`/egg-production/${id}`);
  }

  async getEggProductionSummary() {
    return this.get('/egg-production/summary');
  }

  // Sales Orders API methods
  async getSalesOrders() {
    return this.get('/sales-orders');
  }

  async getSalesOrder(id) {
    return this.get(`/sales-orders/${id}`);
  }

  async createSalesOrder(data) {
    return this.post('/sales-orders', data);
  }

  async updateSalesOrder(id, data) {
    return this.put(`/sales-orders/${id}`, data);
  }

  async deleteSalesOrder(id) {
    return this.delete(`/sales-orders/${id}`);
  }

  async getSalesSummary() {
    return this.get('/sales-orders/summary');
  }

  // Feed Inventory API methods
  async getFeedInventory() {
    return this.get('/feed-inventory');
  }

  async getFeedInventoryItem(id) {
    return this.get(`/feed-inventory/${id}`);
  }

  async createFeedInventoryItem(data) {
    return this.post('/feed-inventory', data);
  }

  async updateFeedInventoryItem(id, data) {
    return this.put(`/feed-inventory/${id}`, data);
  }

  async deleteFeedInventoryItem(id) {
    return this.delete(`/feed-inventory/${id}`);
  }

  async getFeedInventorySummary() {
    return this.get('/feed-inventory/summary');
  }

  // Contact API methods
  async sendContactEmail(data) {
    return this.post('/contact', data);
  }

  async testEmailConfig() {
    return this.get('/contact/test');
  }

  // Task Scheduling API methods
  async getTasks() {
    return this.get('/task-scheduling');
  }

  async getTask(id) {
    return this.get(`/task-scheduling/${id}`);
  }

  async createTask(data) {
    return this.post('/task-scheduling', data);
  }

  async updateTask(id, data) {
    return this.put(`/task-scheduling/${id}`, data);
  }

  async deleteTask(id) {
    return this.delete(`/task-scheduling/${id}`);
  }

  async getTaskSummary() {
    return this.get('/task-scheduling/summary');
  }

  // Egg Production API methods
  async getEggProductionRecords() {
    return this.get('/egg-production');
  }

  async getEggProductionRecord(id) {
    return this.get(`/egg-production/${id}`);
  }

  async createEggProductionRecord(data) {
    return this.post('/egg-production', data);
  }

  async updateEggProductionRecord(id, data) {
    return this.put(`/egg-production/${id}`, data);
  }

  async deleteEggProductionRecord(id) {
    return this.delete(`/egg-production/${id}`);
  }

  async getEggProductionSummary() {
    return this.get('/egg-production/summary');
  }

  // Sales Orders API methods
  async getSalesOrders() {
    return this.get('/sales-orders');
  }

  async getSalesOrder(id) {
    return this.get(`/sales-orders/${id}`);
  }

  async createSalesOrder(data) {
    return this.post('/sales-orders', data);
  }

  async updateSalesOrder(id, data) {
    return this.put(`/sales-orders/${id}`, data);
  }

  async deleteSalesOrder(id) {
    return this.delete(`/sales-orders/${id}`);
  }

  async getSalesSummary() {
    return this.get('/sales-orders/summary');
  }

  // Feed Inventory API methods
  async getFeedInventory() {
    return this.get('/feed-inventory');
  }

  async getFeedInventoryItem(id) {
    return this.get(`/feed-inventory/${id}`);
  }

  async createFeedInventoryItem(data) {
    return this.post('/feed-inventory', data);
  }

  async updateFeedInventoryItem(id, data) {
    return this.put(`/feed-inventory/${id}`, data);
  }

  async deleteFeedInventoryItem(id) {
    return this.delete(`/feed-inventory/${id}`);
  }

  async getFeedInventorySummary() {
    return this.get('/feed-inventory/summary');
  }

  // Financial Records API methods
  async getFinancialRecords() {
    return this.get('/financial-records');
  }

  async getFinancialRecord(id) {
    return this.get(`/financial-records/${id}`);
  }

  async createFinancialRecord(data) {
    return this.post('/financial-records', data);
  }

  async updateFinancialRecord(id, data) {
    return this.put(`/financial-records/${id}`, data);
  }

  async deleteFinancialRecord(id) {
    return this.delete(`/financial-records/${id}`);
  }

  async getFinancialSummary() {
    return this.get('/financial-records/summary');
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
