const API_URL = 'http://localhost:5000/api';

export const api = {
    async get(endpoint: string) {
        const token = localStorage.getItem('atlas_token');
        const response = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Something went wrong');
        }
        return response.json();
    },

    async post(endpoint: string, data: any) {
        const token = localStorage.getItem('atlas_token');
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Something went wrong');
        }
        return response.json();
    },
};
