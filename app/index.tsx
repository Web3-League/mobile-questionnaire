import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import Icon from "react-native-vector-icons/Feather";

// Vérifier si c'est une tablette
const { width, height } = Dimensions.get("window");
const isTablet = width >= 768;

export default function HomeScreen() {
  const router = useRouter();
  const [isLandscape, setIsLandscape] = useState(width > height);

  // Surveiller les changements d'orientation
  useEffect(() => {
    const updateOrientation = () => {
      const { width, height } = Dimensions.get("window");
      setIsLandscape(width > height);
    };

    Dimensions.addEventListener("change", updateOrientation);

    return () => {
      // Pour les versions récentes de React Native
      // Dimensions.removeEventListener("change", updateOrientation);
    };
  }, []);

  const goToVolontaireForm = () => {
    router.push("/volontaire");
  };

  const goToHabitudesForm = () => {
    router.push("/habitudes-cosmetiques");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gestion des Volontaires</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Bienvenue dans l'application de gestion des volontaires</Text>
        
        {/* Always use row layout for cards */}
        <View style={styles.cardsRowContainer}>

          {/* Carte pour le formulaire Volontaire */}
          <TouchableOpacity style={styles.card} onPress={goToVolontaireForm}>
            <View style={[styles.cardIconContainer, { backgroundColor: "#E0F2FE" }]}>
              <Icon name="user" size={28} color="#0284C7" />
            </View>
            <Text style={styles.cardTitle}>Infos volontaire</Text>
            <Text style={styles.cardDescription}>
              Accédez au formulaire d'informations des volontaires
            </Text>
          </TouchableOpacity>

          {/* Carte pour le formulaire Habitudes Cosmétiques */}
          <TouchableOpacity style={styles.card} onPress={goToHabitudesForm}>
            <View style={[styles.cardIconContainer, { backgroundColor: "#EDE9FE" }]}>
              <Icon name="list" size={28} color="#7C3AED" />
            </View>
            <Text style={styles.cardTitle}>Habitudes cosmétiques</Text>
            <Text style={styles.cardDescription}>
              Accédez au formulaire d'habitudes cosmétiques
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: {
    fontSize: isTablet ? 24 : 20,
    fontWeight: "600",
    color: "#1F2937",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: isTablet ? 18 : 16,
    color: "#4B5563",
    marginBottom: 24,
  },
  cardsContainer: {
    flex: 1,
    marginTop: 16,
  },
  cardsRowContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    // Make each card take up roughly half the width
    width: '48%',
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: isTablet ? 15 : 14,
    color: "#6B7280",
    lineHeight: 22,
  },
});