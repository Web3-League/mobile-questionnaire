import { Stack, Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Écran de chargement pendant la vérification de l'authentification
const SplashScreen = () => (
  <View style={styles.splashContainer}>
    <ActivityIndicator size="large" color="#2563EB" />
    <Text style={styles.splashText}>Chargement...</Text>
  </View>
);

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Vérifier l'authentification au démarrage
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        // Si un token existe, considérer l'utilisateur comme authentifié
        // Dans un environnement de production, vous devriez valider ce token
        setIsAuthenticated(!!token);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'authentification:", error);
        setIsAuthenticated(false);
      } finally {
        // Délai artificiel pour montrer le splash screen (à enlever en production)
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    checkAuth();
  }, []);

  // Afficher le SplashScreen pendant le chargement
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      {/* Cette redirection est la clé - elle redirige automatiquement selon l'état d'authentification */}
      {!isLoading && (
        <>
          {isAuthenticated ? (
            <Redirect href="/" />
          ) : (
            <Redirect href="/login" />
          )}
        </>
      )}

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F9FAFB" },
        }}
      >
        {/* Définir toutes les routes ici, qu'elles soient accessibles ou non */}
        <Stack.Screen name="index" options={{ gestureEnabled: false }} />
        <Stack.Screen name="volontaire" />
        <Stack.Screen name="habitudes-cosmetiques" />
        <Stack.Screen name="login" options={{ gestureEnabled: false }} />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  splashText: {
    marginTop: 16,
    fontSize: 16,
    color: "#4B5563",
  },
});