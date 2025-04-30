import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Dimensions,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "./services/apiService";

// Vérifier si c'est une tablette
const { width } = Dimensions.get("window");
const isTablet = width >= 768;

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    // Validation simple
    if (!email.trim()) {
      setError("Veuillez entrer votre adresse email");
      return;
    }

    if (!password.trim()) {
      setError("Veuillez entrer votre mot de passe");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Appel à l'API pour se connecter
      const response = await api.login(email, password);
      
      // Le backend envoie le token JWT dans la réponse
      if (response.data && response.data.token) {
        // Stocker le token dans AsyncStorage
        await AsyncStorage.setItem("authToken", response.data.token);
        
        // Redirection vers la page d'accueil
        router.replace("/");
      } else {
        // Si le token n'est pas dans la réponse
        setError("Erreur de format de réponse du serveur");
        console.error("Format de réponse inattendu:", response.data);
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
      
      // Afficher un message d'erreur approprié
      if (error.response) {
        // La requête a été faite et le serveur a répondu avec un code d'état
        if (error.response.status === 401) {
          setError("Email ou mot de passe incorrect");
        } else {
          setError("Erreur lors de la connexion. Veuillez réessayer.");
        }
        // Log supplémentaire pour le débogage
        console.error("Détails de l'erreur:", error.response.data);
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        setError("Impossible de se connecter au serveur. Vérifiez votre connexion internet.");
        console.error("Aucune réponse reçue:", error.request);
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        setError("Une erreur est survenue. Veuillez réessayer.");
        console.error("Erreur de configuration:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.innerContainer}>
          <View style={styles.logoContainer}>
            {/* Remplacer par votre logo */}
            <Image
              source={require("../assets/logo.png")} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Gestion des Volontaires</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Connexion</Text>
            
            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez votre email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez votre mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => Alert.alert("Info", "Veuillez contacter votre administrateur pour réinitialiser votre mot de passe.")}
            >
              <Text style={styles.forgotPasswordText}>
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Se connecter</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Votre Entreprise
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  innerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: isTablet ? 120 : 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: isTablet ? 150 : 100,
    height: isTablet ? 150 : 100,
  },
  appName: {
    fontSize: isTablet ? 28 : 24,
    fontWeight: "bold",
    color: "#2563EB",
    marginTop: 16,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 24,
    textAlign: "center",
  },
  errorContainer: {
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: "#B91C1C",
    fontSize: isTablet ? 14 : 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: isTablet ? 16 : 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F3F4F6",
    height: isTablet ? 52 : 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    paddingHorizontal: 12,
    fontSize: isTablet ? 16 : 14,
    color: "#1F2937",
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#2563EB",
    fontSize: isTablet ? 14 : 12,
  },
  loginButton: {
    backgroundColor: "#2563EB",
    height: isTablet ? 52 : 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#93C5FD",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: isTablet ? 16 : 14,
    fontWeight: "600",
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  footerText: {
    color: "#6B7280",
    fontSize: isTablet ? 14 : 12,
  },
});