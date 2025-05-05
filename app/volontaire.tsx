import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import Icon from "react-native-vector-icons/Feather";

// Importez votre composant VolontaireForm
import VolontaireForm from "../components/VolontaireForm/VolontaireForm";

export default function VolontairePage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string | undefined;

  const handleClose = () => {
    router.back();
  };

  const handleSuccess = (volontaireId: string) => {
    // Naviguer vers les habitudes cosmétiques après création
    router.push(`/habitudes-cosmetiques?idVol=${volontaireId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Icon name="user" size={24} color="#2563EB" style={styles.headerIcon} />
          <Text style={styles.headerTitle}>
            {id ? "Modifier le volontaire" : "Nouveau volontaire"}
          </Text>
        </View>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Icon name="x" size={22} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        <VolontaireForm
          id={id}
          onSubmitSuccess={handleSuccess}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  formContainer: {
    padding: 16,
    paddingBottom: 40,
  },
});

