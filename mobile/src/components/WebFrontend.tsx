import { WebView } from "react-native-webview";
import { ActivityIndicator, StyleSheet, View } from "react-native";

type WebFrontendProps = { path: string };

export default function WebFrontend({ path }: WebFrontendProps) {
  const url = `http://192.168.1.9:3000${path}`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator color="#60a5fa" size="large" />
          </View>
        )}
        javaScriptEnabled
        domStorageEnabled
        allowsBackForwardNavigationGestures
        sharedCookiesEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050507" },
  loading: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#050507",
  },
});
