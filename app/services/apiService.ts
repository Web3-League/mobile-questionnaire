import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Remove js-cookie import as it's not compatible with React Native

// Configuration de base d'axios
const API: AxiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:8888',
  //baseURL: 'http://192.168.1.36:8888',
  timeout: 30000, // Increase timeout to 30 seconds for testing
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Fonction pour définir le token - modified to only use AsyncStorage
const setAuthToken = async (token: string) => {
  if (token) {
    // Store token in AsyncStorage
    await AsyncStorage.setItem('authToken', token);
    
    // Also set in default headers for immediate requests
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log("Token défini dans AsyncStorage et en-têtes");
  } else {
    // Remove token from AsyncStorage
    await AsyncStorage.removeItem('authToken');
    delete API.defaults.headers.common['Authorization'];
    console.log("Token supprimé de AsyncStorage et en-têtes");
  }
};

// Check if a token already exists in AsyncStorage on startup
(async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      console.log("Token trouvé dans AsyncStorage au démarrage");
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du token depuis AsyncStorage:", error);
  }
})();

// Intercepteur pour ajouter le token d'authentification à chaque requête
API.interceptors.request.use(
  async (config: any) => {
    // Vérifier si le token est déjà défini dans les en-têtes
    if (!config.headers.Authorization) {
      // Récupérer depuis AsyncStorage
      const token = await AsyncStorage.getItem('authToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token ajouté à la requête depuis AsyncStorage");
      }
    }
    
    console.log(`Requête vers ${config.url}`);
    return config;
  },
  (error) => {
    console.error("Erreur dans l'intercepteur de requête:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
API.interceptors.response.use(
  response => response,
  error => {
    console.log('API Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    } else if (error.request) {
      console.log('No response received:', error.request);
    }
    return Promise.reject(error);
  }
);

// API pour les volontaires
const volontairesApi = {
  // Récupérer tous les volontaires
  getAll: () => {
    return API.get('/api/volontaires');
  },

  // Récupérer un volontaire par ID
  getById: (id: string | number) => {
    return API.get(`/api/volontaires/${id}`);
  },

  // Récupérer les détails d'un volontaire
  getDetailsById: (id: string | number) => {
    return API.get(`/api/volontaires/${id}/details`);
  },

  // Créer un nouveau volontaire
  create: (volontaireData: any) => {
    return API.post('/api/volontaires', volontaireData);
  },

  // Créer les détails d'un volontaire
  createDetails: (detailsData: any) => {
    return API.post('/api/volontaires/details', detailsData);
  },

  // Mettre à jour un volontaire
  update: (id: string | number, volontaireData: any) => {
    return API.put(`/api/volontaires/${id}`, volontaireData);
  },

  // Mettre à jour les détails d'un volontaire
  updateDetails: (id: string | number, detailsData: any) => {
    return API.put(`/api/volontaires/${id}/details`, detailsData);
  },

  // Supprimer un volontaire
  delete: (id: string | number) => {
    return API.delete(`/api/volontaires/${id}`);
  }
};

// API pour les habitudes cosmétiques
const habituesCosmetiquesApi = {
  // Récupérer toutes les habitudes cosmétiques
  getAll: () => {
    return API.get('/api/volontaires-hc');
  },

  // Récupérer les habitudes cosmétiques d'un volontaire
  getByVolontaireId: (id: string | number) => {
    return API.get(`/api/volontaires-hc/volontaire/${id}`);
  },

  create: (hcData: any) => {
    // Créer une copie des données pour éviter de les modifier directement
    const data = { ...hcData };

    // S'assurer que l'ID est envoyé comme un nombre
    if (data.idVol && typeof data.idVol === 'string') {
      data.idVol = parseInt(data.idVol, 10);
    }

    // Convertir toutes les valeurs booléennes selon différentes possibilités
    Object.keys(data).forEach(key => {
      if (key !== 'idVol' && typeof data[key] === 'boolean') {
        // Essayons avec "oui"/"non" en minuscules
        data[key] = data[key] ? 'oui' : 'non';
      }
    });

    return API.post('/api/volontaires-hc', data);
  },

  // Mettre à jour les produits d'un volontaire
  updateProduits: (idVol: string | number, produitsData: any) => {
    return API.patch(`/api/volontaires-hc/volontaire/${idVol}/produits`, produitsData);
  },

  // Mettre à jour un produit d'un volontaire
  updateProduit: (idVol: string | number, produitData: any) => {
    return API.patch(`/api/volontaires-hc/volontaire/${idVol}/produit`, produitData);
  },

  // Supprimer les habitudes cosmétiques d'un volontaire
  delete: (idVol: string | number) => {
    return API.delete(`/api/volontaires-hc/volontaire/${idVol}`);
  }
};

// Add a connection test function
const testConnection = async () => {
  try {
    console.log('Testing API connection...');
    const response = await axios.get('http://10.0.2.2:8888/api/health', { 
      timeout: 5000 
    });
    console.log('Connection successful:', response.data);
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Connection test failed:', error.message);
    } else {
      console.error('Connection test failed:', error);
    }
    if (typeof error === 'object' && error !== null && 'response' in error) {
      // Type assertion to access error.response safely
      const err = error as { response: any };
      console.log('Response received with error status:', err.response.status);
    } else if (typeof error === 'object' && error !== null && 'request' in error) {
      const err = error as { request: any };
      console.log('No response received from server');
    }
    return false;
  }
};

// Exportez vos API
export default {
  volontaires: volontairesApi,
  habituesCosmetiques: habituesCosmetiquesApi,
  setAuthToken, // Exporter la fonction setAuthToken
  testConnection, // Export the test function

  // Méthode pour gérer la connexion
  login: async (login: string, password: string) => {
    try {
      console.log(`Tentative de connexion avec: ${login}`);
      const response = await API.post('/api/auth/login', { 
        login: login,
        motDePasse: password
      });
      
      // Si la réponse contient un token, le stocker
      if (response.data && response.data.token) {
        await setAuthToken(response.data.token);
      }
      return response;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      if (typeof error === 'object' && error !== null && 'response' in error) {
        console.error('Réponse d\'erreur:', (error as any).response.data);
      } else if (typeof error === 'object' && error !== null && 'request' in error) {
        console.error('Aucune réponse reçue:', (error as any).request);
      } else if (typeof error === 'object' && error !== null && 'message' in error) {
        console.error('Erreur de configuration:', (error as any).message);
      } else {
        console.error('Erreur inconnue:', error);
      }
      throw error;
    }
  },

  // Méthode pour la déconnexion
  logout: async () => {
    try {
      await API.post('/api/auth/logout');
      // Supprimer le token
      await AsyncStorage.removeItem('authToken');
      delete API.defaults.headers.common['Authorization'];
      return true;
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      return false;
    }
  },

  // Méthode pour tester le token
  validateToken: async () => {
    try {
      const response = await API.get('/api/auth/validate');
      return { valid: true, message: response.data };
    } catch (error) {
      let message = '';
      if (typeof error === 'object' && error !== null) {
        if ('response' in error && (error as any).response?.data) {
          message = (error as any).response.data;
        } else if ('message' in error) {
          message = (error as any).message;
        } else {
          message = 'Une erreur inconnue est survenue.';
        }
      } else {
        message = String(error);
      }
      return { valid: false, message };
    }
  }
};