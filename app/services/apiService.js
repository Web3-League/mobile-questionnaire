import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration de base d'axios
const API = axios.create({
  baseURL: 'http://10.0.2.2:8888/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Si l'erreur est 401 (non autorisé) et que ce n'est pas déjà une tentative de rafraîchissement
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Tentative de rafraîchissement du token
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          // Si pas de refresh token, rediriger vers login
          // Dans Expo Router, vous devriez supprimer les tokens et laisser _layout.tsx gérer la redirection
          await AsyncStorage.removeItem('authToken');
          return Promise.reject(error);
        }
        
        const response = await axios.post(
          'https://localhost:8888/api/auth/refresh',
          { refreshToken }
        );
        
        const { token, newRefreshToken } = response.data;
        
        // Sauvegarder les nouveaux tokens
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);
        
        // Relancer la requête originale avec le nouveau token
        API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return API(originalRequest);
      } catch (refreshError) {
        // Si le rafraîchissement échoue, déconnecter l'utilisateur
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// API pour les volontaires
const volontairesApi = {
  // Récupérer tous les volontaires
  getAll: () => {
    return API.get('/volontaires');
  },
  
  // Récupérer un volontaire par ID
  getById: (id) => {
    return API.get(`/volontaires/${id}`);
  },
  
  // Récupérer les détails d'un volontaire
  getDetailsById: (id) => {
    return API.get(`/volontaires/${id}/details`);
  },
  
  // Créer un nouveau volontaire
  create: (volontaireData) => {
    return API.post('/volontaires', volontaireData);
  },
  
  // Créer les détails d'un volontaire
  createDetails: (detailsData) => {
    return API.post('/volontaires/details', detailsData);
  },
  
  // Mettre à jour un volontaire
  update: (id, volontaireData) => {
    return API.put(`/volontaires/${id}`, volontaireData);
  },
  
  // Mettre à jour les détails d'un volontaire
  updateDetails: (id, detailsData) => {
    return API.put(`/volontaires/${id}/details`, detailsData);
  },
  
  // Supprimer un volontaire
  delete: (id) => {
    return API.delete(`/volontaires/${id}`);
  }
};

// API pour les habitudes cosmétiques
const habituesCosmetiquesApi = {
  // Récupérer toutes les habitudes cosmétiques
  getAll: () => {
    return API.get('/volontaires-hc');
  },
  
  // Récupérer les habitudes cosmétiques d'un volontaire
  getByVolontaireId: (id) => {
    return API.get(`/volontaires-hc/volontaire/${id}`);
  },
  
  // Créer des habitudes cosmétiques
// Dans votre apiService.js, modifiez la méthode create
create: (hcData) => {
  // Vous pouvez créer une copie des données pour éviter de les modifier directement
  const data = { ...hcData };
  
  // S'assurer que l'ID est envoyé comme un nombre
  if (data.idVol && typeof data.idVol === 'string') {
    data.idVol = parseInt(data.idVol, 10);
  }
  
  // S'assurer que les chaînes "Oui" et "Non" sont correctement envoyées
  // (si nécessaire, vous pourriez avoir besoin d'ajuster cette partie selon les besoins exacts du backend)
  
  return API.post('/volontaires-hc', data);
},
  
  // Mettre à jour les produits d'un volontaire
  updateProduits: (idVol, produitsData) => {
    return API.patch(`/volontaires-hc/volontaire/${idVol}/produits`, produitsData);
  },
  
  // Mettre à jour un produit d'un volontaire
  updateProduit: (idVol, produitData) => {
    return API.patch(`/volontaires-hc/volontaire/${idVol}/produit`, produitData);
  },
  
  // Supprimer les habitudes cosmétiques d'un volontaire
  delete: (idVol) => {
    return API.delete(`/volontaires-hc/volontaire/${idVol}`);
  }
};

// Exportez vos API
export default {
  volontaires: volontairesApi,
  habituesCosmetiques: habituesCosmetiquesApi,
  
  // Méthode pour gérer la connexion
  login: (email, password) => {
    return API.post('/auth/login', { email, password });
  },
  
  // Méthode pour la déconnexion
  logout: async () => {
    try {
      await API.post('/auth/logout');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('refreshToken');
      return true;
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      return false;
    }
  }
};