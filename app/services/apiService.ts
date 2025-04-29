import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormData } from '../../types';

// Configuration de base d'axios
const API: AxiosInstance = axios.create({
  //baseURL: 'http://10.0.2.2:8888/api', // Utilisé pour Android Emulator
  baseURL: 'http://localhost:8888/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
API.interceptors.request.use(
  async (config: import('axios').InternalAxiosRequestConfig): Promise<import('axios').InternalAxiosRequestConfig> => {
    const token = await AsyncStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
API.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 (non autorisé) et que ce n'est pas déjà une tentative de rafraîchissement
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Tentative de rafraîchissement du token
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) {
          // Si pas de refresh token, rediriger vers login
          await AsyncStorage.removeItem('authToken');
          return Promise.reject(error);
        }

        const response = await axios.post(
          'http://localhost:8888/api/auth/refresh',
          { refreshToken }
        );

        const { token, newRefreshToken } = response.data;

        // Sauvegarder les nouveaux tokens
        await AsyncStorage.setItem('authToken', token);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);

        // Relancer la requête originale avec le nouveau token
        if (API.defaults.headers.common) {
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
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
  getById: (id: string | number) => {
    return API.get(`/volontaires/${id}`);
  },

  // Récupérer les détails d'un volontaire
  getDetailsById: (id: string | number) => {
    return API.get(`/volontaires/${id}/details`);
  },

  // Créer un nouveau volontaire
  create: (volontaireData: any) => {
    return API.post('/volontaires', volontaireData);
  },

  // Créer les détails d'un volontaire
  createDetails: (detailsData: any) => {
    return API.post('/volontaires/details', detailsData);
  },

  // Mettre à jour un volontaire
  update: (id: string | number, volontaireData: any) => {
    return API.put(`/volontaires/${id}`, volontaireData);
  },

  // Mettre à jour les détails d'un volontaire
  updateDetails: (id: string | number, detailsData: any) => {
    return API.put(`/volontaires/${id}/details`, detailsData);
  },

  // Supprimer un volontaire
  delete: (id: string | number) => {
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
  getByVolontaireId: (id: string | number) => {
    return API.get(`/volontaires-hc/volontaire/${id}`);
  },

  // Créer des habitudes cosmétiques
  create: (hcData: any) => {
    // Créer une copie des données pour éviter de les modifier directement
    const data = { ...hcData };
    // S'assurer que l'ID est envoyé comme un nombre
    if (data.idVol && typeof data.idVol === 'string') {
      data.idVol = parseInt(data.idVol, 10);
    }
    // Convertir toutes les valeurs booléennes en "Oui"/"Non" selon l'exemple de la BDD
    Object.keys(data).forEach(key => {
      if (key !== 'idVol' && typeof data[key] === 'boolean') {
        data[key] = data[key] ? "Oui" : "Non";
      }
    });
    // Utiliser une configuration spécifique pour cette requête pour éviter les problèmes d'échappement
    return API.post('/volontaires-hc', data, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Accept': 'application/json'
      }
    });
  },

  // Mettre à jour les produits d'un volontaire
  updateProduits: (idVol: string | number, produitsData: any) => {
    return API.patch(`/volontaires-hc/volontaire/${idVol}/produits`, produitsData);
  },

  // Mettre à jour un produit d'un volontaire
  updateProduit: (idVol: string | number, produitData: any) => {
    return API.patch(`/volontaires-hc/volontaire/${idVol}/produit`, produitData);
  },

  // Supprimer les habitudes cosmétiques d'un volontaire
  delete: (idVol: string | number) => {
    return API.delete(`/volontaires-hc/volontaire/${idVol}`);
  }
};

// Exportez vos API
export default {
  volontaires: volontairesApi,
  habituesCosmetiques: habituesCosmetiquesApi,

  // Méthode pour gérer la connexion
  login: (email: string, password: string) => {
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