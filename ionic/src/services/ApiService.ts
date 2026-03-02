const API_BASE_URL = 'http://localhost:8081';

export interface Item {
  id: number;
  name: string;
  created_at?: string;
}

export const ApiService = {
  // Health check
  async checkHealth(): Promise<{ status: string; database: string }> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.json();
  },

  // Get all items
  async getItems(): Promise<Item[]> {
    const response = await fetch(`${API_BASE_URL}/items`);
    if (!response.ok) {
      throw new Error('Failed to fetch items');
    }
    return response.json();
  },

  // Create a new item
  async createItem(name: string): Promise<Item> {
    const response = await fetch(`${API_BASE_URL}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create item');
    }
    return response.json();
  },

  // Delete an item
  async deleteItem(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/items/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete item');
    }
  },
};
