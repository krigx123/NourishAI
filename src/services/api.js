const API_BASE_URL = 'http://localhost:5000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('nourishai_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Auth API
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  updateProfile: async (profileData) => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/users/dashboard`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  exportData: async () => {
    const response = await fetch(`${API_BASE_URL}/users/export`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  deleteAccount: async () => {
    const response = await fetch(`${API_BASE_URL}/users/account`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }
};

// Meals API
export const mealsAPI = {
  logMeal: async (mealData) => {
    const response = await fetch(`${API_BASE_URL}/meals/log`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(mealData)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  getTodayMeals: async () => {
    const response = await fetch(`${API_BASE_URL}/meals/today`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  getHistory: async () => {
    const response = await fetch(`${API_BASE_URL}/meals/history`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  getRecentMeals: async () => {
    const response = await fetch(`${API_BASE_URL}/meals/recent`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  addFavorite: async (foodName, nutritionData) => {
    const response = await fetch(`${API_BASE_URL}/meals/favorites`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ foodName, nutritionData })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  getFavorites: async () => {
    const response = await fetch(`${API_BASE_URL}/meals/favorites`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  logWater: async (glasses = 1) => {
    const response = await fetch(`${API_BASE_URL}/meals/water`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ glasses })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  },

  getTodayWater: async () => {
    const response = await fetch(`${API_BASE_URL}/meals/water/today`, {
      headers: getAuthHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }
};

// Food Recognition API (LogMeal)
export const foodAPI = {
  recognizeImage: async (imageBase64) => {
    const response = await fetch(`${API_BASE_URL}/food/recognize`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ imageBase64 })
    });
    const data = await response.json();
    if (!response.ok) {
      if (data.useFallback) {
        return { success: false, useFallback: true, error: data.error };
      }
      throw new Error(data.error);
    }
    return data;
  },

  analyzeImage: async (imageBase64) => {
    const response = await fetch(`${API_BASE_URL}/food/analyze-image`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ imageBase64 })
    });
    const data = await response.json();
    if (!response.ok) {
      if (data.useFallback) {
        return { success: false, useFallback: true, error: data.error };
      }
      throw new Error(data.error);
    }
    return data;
  }
};

// Gemini AI API - Expert Nutritionist Verification
export const geminiAPI = {
  verifyNutrition: async (foodName) => {
    const response = await fetch(`${API_BASE_URL}/gemini/verify-nutrition`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ foodName })
    });
    const data = await response.json();
    if (!response.ok) {
      if (data.useFallback) {
        return { success: false, useFallback: true, error: data.error };
      }
      throw new Error(data.error);
    }
    return data;
  }
};

// Vision API - Food Detection using Google Cloud Vision
export const visionAPI = {
  detectFood: async (imageBase64) => {
    const response = await fetch(`${API_BASE_URL}/vision/detect`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ imageBase64 })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }
};

// Groq API - Nutrition Analysis using LLM
export const groqAPI = {
  analyzeNutrition: async (foodLabels, visionData = {}) => {
    const response = await fetch(`${API_BASE_URL}/groq/analyze`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        foodLabels,
        primaryMeal: visionData.primaryMeal,
        alternatives: visionData.alternatives || [],
        detectionNote: visionData.detectionNote || '',
        isIndianMeal: visionData.isIndianMeal || false
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }
};

export default { authAPI, userAPI, mealsAPI, foodAPI, geminiAPI, visionAPI, groqAPI };

