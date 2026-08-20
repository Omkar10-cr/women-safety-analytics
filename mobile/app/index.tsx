import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Women Safety</Text>

      <Text style={styles.subtitle}>
        Your safety companion
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/login" as any)}
      >
        <Text style={styles.buttonText}>Sign in</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/signup" as any)}
      >
        <Text style={styles.buttonText}>Create account</Text>
      </Pressable>

      <Pressable
        style={styles.sosButton}
        onPress={() => router.push("/emergency" as any)}
      >
        <Text style={styles.sosText}>
          SOS
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#080B12",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 32,
    fontWeight: "900",
  },

  subtitle: {
    color: "#94A3B8",
    fontSize: 15,
    marginTop: 8,
    marginBottom: 40,
  },

  button: {
    width: "100%",
    backgroundColor: "#1E293B",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  sosButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 8,
    borderColor: "#7F1D1D",
  },

  sosText: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "900",
  },
});