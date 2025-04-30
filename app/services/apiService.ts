import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Importation de la bibliothèque de gestion des cookies
import Cookies from 'js-cookie';

// Configuration de base d'axios
const API: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8888', // Sans /api car les endpoints incluent déjà /api
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Important: Activation des cookies pour les requêtes cross-origin
  withCredentials: true
});

// Fonction pour définir le token via cookie
const setAuthToken = (token: string) => {
  if (token) {
    // Stocke le token dans un cookie
    Cookies.set('authToken', token, { 
      expires: 1, // 1 jour
      path: '/',
      secure: window.location.protocol === 'https:',
      sameSite: 'lax'
    });
    
    // Aussi dans les en-têtes par défaut (pour les requêtes immédiates)
    API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log("Token défini dans cookie et en-têtes");
  } else {
    // Supprime le cookie
    Cookies.remove('authToken');
    delete API.defaults.headers.common['Authorization'];
    console.log("Token supprimé des cookies et en-têtes");
  }
};

// Vérifier si un token existe déjà dans les cookies au démarrage
(() => {
  try {
    const token = Cookies.get('authToken');
    if (token) {
      console.log("Token trouvé dans les cookies au démarrage");
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du token des cookies:", error);
  }
})();

// Intercepteur pour ajouter le token d'authentification à chaque requête
API.interceptors.request.use(
  async (config: any) => {
    // Vérifier si le token est déjà défini dans les en-têtes
    if (!config.headers.Authorization) {
      // Essayer de récupérer depuis les cookies d'abord
      const cookieToken = Cookies.get('authToken');
      
      if (cookieToken) {
        config.headers.Authorization = `Bearer ${cookieToken}`;
        console.log("Token ajouté à la requête depuis cookie");
      } else {
        // Fallback sur AsyncStorage (pour compatibilité mobile)
        const storageToken = await AsyncStorage.getItem('authToken');
        if (storageToken && config.headers) {
          config.headers.Authorization = `Bearer ${storageToken}`;
          console.log("Token ajouté à la requête depuis AsyncStorage");
        }
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

// Exportez vos API
export default {
  volontaires: volontairesApi,
  habituesCosmetiques: habituesCosmetiquesApi,
  setAuthToken, // Exporter la fonction setAuthToken

  // Méthode pour gérer la connexion
  login: (login: string, password: string) => {
    return API.post('/api/auth/login', { 
      login: login,
      motDePasse: password
    }).then(response => {
      // Si la réponse contient un token, le stocker dans un cookie
      if (response.data && response.data.token) {
        setAuthToken(response.data.token);
        
        // Aussi dans AsyncStorage pour la compatibilité mobile
        AsyncStorage.setItem('authToken', response.data.token);
      }
      return response;
    });
  },

  // Méthode pour la déconnexion
  logout: async () => {
    try {
      await API.post('/api/auth/logout');
      // Supprimer des deux stockages
      Cookies.remove('authToken');
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