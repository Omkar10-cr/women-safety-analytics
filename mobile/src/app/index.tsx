import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Women Safety</Text>

      <Text style={styles.subtitle}>
        Your personal safety companion
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/dashboard" as any)}
      >
        <Text style={styles.buttonText}>Open Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.emergencyButton}
        onPress={() => router.push("/emergency" as any)}
      >
        <Text style={styles.buttonText}>SOS / Emergency</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#ffffff",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 40,
  },

  button: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#208AEF",
    alignItems: "center",
    marginBottom: 15,
  },

  emergencyButton: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#E53935",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});