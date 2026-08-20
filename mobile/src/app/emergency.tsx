import { router } from "expo-router";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmergencyScreen() {
  const handleSOS = () => {
    Alert.alert(
      "Emergency SOS",
      "Emergency alert will be sent to your emergency contacts.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "SEND SOS",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "SOS Activated",
              "Your emergency alert has been activated."
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>🚨</Text>

        <Text style={styles.title}>Emergency</Text>

        <Text style={styles.description}>
          If you are in danger, activate SOS to notify your emergency
          contacts and share your current location.
        </Text>

        <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
          <Text style={styles.sosText}>ACTIVATE SOS</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FEF2F2",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  icon: {
    fontSize: 80,
    marginBottom: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#991B1B",
    marginBottom: 16,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    color: "#7F1D1D",
    marginBottom: 40,
  },

  sosButton: {
    width: "100%",
    backgroundColor: "#DC2626",
    paddingVertical: 22,
    borderRadius: 18,
    alignItems: "center",
    elevation: 5,
  },

  sosText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },

  backButton: {
    marginTop: 24,
    padding: 12,
  },

  backText: {
    color: "#991B1B",
    fontSize: 16,
    fontWeight: "600",
  },
});