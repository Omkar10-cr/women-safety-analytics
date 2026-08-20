import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Linking,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "http://192.168.1.9:5000";

type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

type LocationData = {
  latitude: number;
  longitude: number;
  address?: string;
};

type NearbyPlace = {
  name?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  distance?: number;
};

type DashboardData = {
  safetyScore: number;
  riskLevel: RiskLevel;
  location: LocationData | null;
  policeStation: NearbyPlace | null;
  safePlace: NearbyPlace | null;
  hospital: NearbyPlace | null;
};

const DEFAULT_DATA: DashboardData = {
  safetyScore: 82,
  riskLevel: "LOW",
  location: null,
  policeStation: null,
  safePlace: null,
  hospital: null,
};

function getRiskColor(level: RiskLevel) {
  switch (level) {
    case "CRITICAL":
      return "#991B1B";
    case "HIGH":
      return "#DC2626";
    case "MEDIUM":
      return "#D97706";
    default:
      return "#15803D";
  }
}

function getRiskLabel(score: number): RiskLevel {
  if (score <= 25) return "CRITICAL";
  if (score <= 50) return "HIGH";
  if (score <= 70) return "MEDIUM";
  return "LOW";
}

function formatDistance(distance?: number) {
  if (distance === undefined || distance === null) return "--";

  if (distance < 1000) {
    return `${Math.round(distance)} m`;
  }

  return `${(distance / 1000).toFixed(1)} km`;
}

export default function DashboardScreen() {
  const [data, setData] = useState<DashboardData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sosLoading, setSosLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);

  const riskColor = useMemo(
    () => getRiskColor(data.riskLevel),
    [data.riskLevel]
  );

  const loadDashboard = useCallback(async () => {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setLocationPermission(false);
        setLoading(false);
        return;
      }

      setLocationPermission(true);

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const latitude = currentLocation.coords.latitude;
      const longitude = currentLocation.coords.longitude;

      let address = "";

      try {
        const geocoded = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (geocoded.length > 0) {
          const item = geocoded[0];

          address = [
            item.name,
            item.street,
            item.city,
            item.region,
          ]
            .filter(Boolean)
            .join(", ");
        }
      } catch {
        address = "Current location";
      }

      const location: LocationData = {
        latitude,
        longitude,
        address,
      };

      let safetyScore = DEFAULT_DATA.safetyScore;
      let riskLevel: RiskLevel = getRiskLabel(safetyScore);

      let policeStation: NearbyPlace | null = null;
      let safePlace: NearbyPlace | null = null;
      let hospital: NearbyPlace | null = null;

      /*
       * Risk score
       */
      try {
        const riskResponse = await fetch(
          `${API_URL}/api/risk/score?latitude=${latitude}&longitude=${longitude}`
        );

        if (riskResponse.ok) {
          const riskJson = await riskResponse.json();

          const possibleScore =
            riskJson?.safety_score ??
            riskJson?.score ??
            riskJson?.data?.safety_score ??
            riskJson?.data?.score;

          if (typeof possibleScore === "number") {
            safetyScore = Math.max(0, Math.min(100, possibleScore));
            riskLevel =
              riskJson?.data?.risk_level?.toUpperCase?.() ||
              riskJson?.risk_level?.toUpperCase?.() ||
              getRiskLabel(safetyScore);
          }
        }
      } catch {
        // Keep local fallback score.
      }

      /*
       * Nearby emergency services
       */
      try {
        const nearbyResponse = await fetch(
          `${API_URL}/api/nearby?latitude=${latitude}&longitude=${longitude}`
        );

        if (nearbyResponse.ok) {
          const nearbyJson = await nearbyResponse.json();

          policeStation =
            nearbyJson?.nearest_police_station ||
            nearbyJson?.police_station ||
            nearbyJson?.police_stations?.[0] ||
            null;

          safePlace =
            nearbyJson?.safe_place ||
            nearbyJson?.safe_places?.[0] ||
            null;

          hospital =
            nearbyJson?.nearest_hospital ||
            nearbyJson?.hospital ||
            nearbyJson?.hospitals?.[0] ||
            null;
        }
      } catch {
        // Nearby service unavailable; dashboard still works.
      }

      setData({
        safetyScore,
        riskLevel,
        location,
        policeStation,
        safePlace,
        hospital,
      });
    } catch (error) {
      console.log("Dashboard error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const handleSOS = async () => {
    if (sosLoading) return;

    try {
      setSosLoading(true);

      let currentLocation = data.location;

      if (!currentLocation) {
        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      }

      /*
       * Send panic event to backend.
       */
      try {
        await fetch(`${API_URL}/api/reports`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "SOS",
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            message: "Emergency SOS activated from mobile application",
          }),
        });
      } catch {
        // Continue to emergency UI even if backend is unavailable.
      }

      Alert.alert(
        "SOS Activated",
        "Your emergency request has been triggered. Stay calm and move toward a safe location.",
        [
          {
            text: "OK",
          },
          {
            text: "Call Emergency",
            onPress: () => {
              Linking.openURL("tel:112").catch(() => {
                Alert.alert(
                  "Unable to call",
                  "Please call 112 manually."
                );
              });
            },
          },
        ]
      );
    } catch {
      Alert.alert(
        "SOS Error",
        "Unable to obtain your current location. Please call emergency services manually."
      );
    } finally {
      setSosLoading(false);
    }
  };

  const openMap = () => {
    router.push("/map" as any);
  };

  const openEmergency = () => {
    router.push("/emergency");
  };

  const openContacts = () => {
    router.push("/contacts" as any);
  };

  const openRiskAnalytics = () => {
    router.push("/risk-analytics" as any);
  };

  const openProfile = () => {
    router.push("/profile" as any);
  };

  const openPoliceDirections = () => {
    if (!data.policeStation) {
      openMap();
      return;
    }

    const latitude = data.policeStation.latitude;
    const longitude = data.policeStation.longitude;

    if (latitude === undefined || longitude === undefined) {
      openMap();
      return;
    }

    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?daddr=${latitude},${longitude}`
        : `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    Linking.openURL(url).catch(() => {
      openMap();
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingScreen}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#F7F8F4"
        />

        <View style={styles.loadingLogo}>
          <Text style={styles.loadingLogoText}>WS</Text>
        </View>

        <ActivityIndicator
          size="large"
          color="#8B2635"
          style={{ marginTop: 20 }}
        />

        <Text style={styles.loadingTitle}>
          Preparing your safety dashboard
        </Text>

        <Text style={styles.loadingSubtitle}>
          Checking your location and nearby safety services...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F7F8F4"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#8B2635"
          />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>WOMEN SAFETY ANALYTICS</Text>

            <Text style={styles.greeting}>
              You&apos;re protected.
            </Text>

            <Text style={styles.headerSubtitle}>
              Your safety overview for today
            </Text>
          </View>

          <Pressable
            style={styles.profileButton}
            onPress={openProfile}
          >
            <Text style={styles.profileIcon}>●</Text>
          </Pressable>
        </View>

        {/* GPS STATUS */}
        <View style={styles.gpsStatus}>
          <View style={styles.gpsDot} />

          <Text style={styles.gpsText}>
            {locationPermission
              ? "GPS ACTIVE"
              : "LOCATION PERMISSION REQUIRED"}
          </Text>

          <Text style={styles.gpsTime}>LIVE</Text>
        </View>

        {/* SAFETY SCORE */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <View>
              <Text style={styles.cardEyebrow}>
                CURRENT SAFETY STATUS
              </Text>

              <Text style={styles.scoreTitle}>
                Safety Score
              </Text>
            </View>

            <View
              style={[
                styles.riskBadge,
                {
                  backgroundColor: `${riskColor}15`,
                },
              ]}
            >
              <View
                style={[
                  styles.riskDot,
                  { backgroundColor: riskColor },
                ]}
              />

              <Text
                style={[
                  styles.riskBadgeText,
                  { color: riskColor },
                ]}
              >
                {data.riskLevel}
              </Text>
            </View>
          </View>

          <View style={styles.scoreRow}>
            <Text
              style={[
                styles.scoreNumber,
                { color: riskColor },
              ]}
            >
              {Math.round(data.safetyScore)}
            </Text>

            <Text style={styles.scoreOutOf}>/100</Text>
          </View>

          <View style={styles.scoreTrack}>
            <View
              style={[
                styles.scoreProgress,
                {
                  width: `${Math.max(
                    2,
                    Math.min(100, data.safetyScore)
                  )}%`,
                  backgroundColor: riskColor,
                },
              ]}
            />
          </View>

          <View style={styles.scoreFooter}>
            <Text style={styles.scoreDescription}>
              {data.riskLevel === "LOW"
                ? "You're currently in a low-risk area."
                : data.riskLevel === "MEDIUM"
                ? "Stay alert and monitor your surroundings."
                : data.riskLevel === "HIGH"
                ? "Consider moving toward a safer location."
                : "Move to a safe location and contact emergency services."}
            </Text>

            <Text style={styles.scoreUpdated}>
              Updated just now
            </Text>
          </View>
        </View>

        {/* SOS */}
        <Pressable
          onPress={handleSOS}
          disabled={sosLoading}
          style={({ pressed }) => [
            styles.sosCard,
            pressed && styles.pressed,
          ]}
        >
          <View style={styles.sosLeft}>
            <View style={styles.sosIconCircle}>
              {sosLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.sosIcon}>SOS</Text>
              )}
            </View>

            <View style={styles.sosTextContainer}>
              <Text style={styles.sosTitle}>
                {sosLoading
                  ? "ACTIVATING..."
                  : "EMERGENCY SOS"}
              </Text>

              <Text style={styles.sosSubtitle}>
                Tap to send your location and request help
              </Text>
            </View>
          </View>

          <Text style={styles.sosArrow}>›</Text>
        </Pressable>

        {/* LOCATION */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>
              LIVE LOCATION
            </Text>

            <Text style={styles.sectionTitle}>
              Where you are
            </Text>
          </View>

          <Pressable onPress={openMap}>
            <Text style={styles.viewLink}>OPEN MAP</Text>
          </Pressable>
        </View>

        <View style={styles.locationCard}>
          <View style={styles.locationIcon}>
            <Text style={styles.locationPin}>●</Text>
          </View>

          <View style={styles.locationContent}>
            <Text style={styles.locationTitle}>
              {data.location?.address || "Current device location"}
            </Text>

            {data.location ? (
              <Text style={styles.coordinates}>
                {data.location.latitude.toFixed(5)},{" "}
                {data.location.longitude.toFixed(5)}
              </Text>
            ) : (
              <Text style={styles.coordinates}>
                Location unavailable
              </Text>
            )}
          </View>

          <View style={styles.livePill}>
            <Text style={styles.livePillText}>LIVE</Text>
          </View>
        </View>

        {/* QUICK ACTIONS */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>
              QUICK ACTIONS
            </Text>

            <Text style={styles.sectionTitle}>
              Safety tools
            </Text>
          </View>
        </View>

        <View style={styles.actionGrid}>
          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressed,
            ]}
            onPress={openEmergency}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: "#FCE8E8" },
              ]}
            >
              <Text style={styles.actionEmoji}>🚨</Text>
            </View>

            <Text style={styles.actionTitle}>
              Emergency
            </Text>

            <Text style={styles.actionDescription}>
              Emergency response
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressed,
            ]}
            onPress={openContacts}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: "#EEE9F7" },
              ]}
            >
              <Text style={styles.actionEmoji}>👥</Text>
            </View>

            <Text style={styles.actionTitle}>
              Contacts
            </Text>

            <Text style={styles.actionDescription}>
              Trusted people
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressed,
            ]}
            onPress={openMap}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: "#E5F2EC" },
              ]}
            >
              <Text style={styles.actionEmoji}>📍</Text>
            </View>

            <Text style={styles.actionTitle}>
              Safety Map
            </Text>

            <Text style={styles.actionDescription}>
              Safe places nearby
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionCard,
              pressed && styles.pressed,
            ]}
            onPress={openRiskAnalytics}
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: "#F7EEE0" },
              ]}
            >
              <Text style={styles.actionEmoji}>📊</Text>
            </View>

            <Text style={styles.actionTitle}>
              Analytics
            </Text>

            <Text style={styles.actionDescription}>
              Risk insights
            </Text>
          </Pressable>
        </View>

        {/* NEAREST POLICE */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>
              EMERGENCY SERVICES
            </Text>

            <Text style={styles.sectionTitle}>
              Nearest police station
            </Text>
          </View>
        </View>

        <View style={styles.policeCard}>
          <View style={styles.policeIcon}>
            <Text style={styles.policeEmoji}>👮</Text>
          </View>

          <View style={styles.policeContent}>
            <Text style={styles.policeName}>
              {data.policeStation?.name ||
                "Police station search"}
            </Text>

            <Text style={styles.policeAddress}>
              {data.policeStation?.address ||
                "Nearby emergency service"}
            </Text>

            <Text style={styles.policeDistance}>
              {formatDistance(
                data.policeStation?.distance
              )}{" "}
              away
            </Text>
          </View>

          <Pressable
            style={styles.directionButton}
            onPress={openPoliceDirections}
          >
            <Text style={styles.directionText}>→</Text>
          </Pressable>
        </View>

        {/* SAFE ROUTE */}
        <View style={styles.safeRouteCard}>
          <View style={styles.safeRouteTop}>
            <View style={styles.safeRouteIcon}>
              <Text style={styles.safeRouteIconText}>
                ✓
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.safeRouteEyebrow}>
                RECOMMENDED
              </Text>

              <Text style={styles.safeRouteTitle}>
                Guided escape path
              </Text>
            </View>
          </View>

          <Text style={styles.safeRouteDescription}>
            Find a safer route using your current location
            and nearby emergency services.
          </Text>

          <Pressable
            style={styles.safeRouteButton}
            onPress={openMap}
          >
            <Text style={styles.safeRouteButtonText}>
              VIEW SAFE ROUTE
            </Text>

            <Text style={styles.safeRouteArrow}>→</Text>
          </Pressable>
        </View>

        {/* SAFETY ACTIVITY */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>
              ACTIVITY
            </Text>

            <Text style={styles.sectionTitle}>
              Safety activity
            </Text>
          </View>

          <Pressable onPress={openRiskAnalytics}>
            <Text style={styles.viewLink}>VIEW ALL</Text>
          </Pressable>
        </View>

        <View style={styles.activityCard}>
          <ActivityRow
            icon="✓"
            title="GPS location active"
            description="Your location is being monitored"
            time="Now"
            color="#15803D"
          />

          <View style={styles.activityDivider} />

          <ActivityRow
            icon="●"
            title={`Safety score ${Math.round(
              data.safetyScore
            )}/100`}
            description={`${data.riskLevel} risk level detected`}
            time="Now"
            color={riskColor}
          />

          <View style={styles.activityDivider} />

          <ActivityRow
            icon="⌖"
            title="Nearby services checked"
            description="Emergency services available"
            time="Now"
            color="#6B7280"
          />
        </View>

        {/* EMERGENCY CTA */}
        <Pressable
          style={({ pressed }) => [
            styles.bottomEmergency,
            pressed && styles.pressed,
          ]}
          onPress={openEmergency}
        >
          <View>
            <Text style={styles.bottomEmergencyEyebrow}>
              NEED HELP?
            </Text>

            <Text style={styles.bottomEmergencyTitle}>
              Open emergency center
            </Text>
          </View>

          <Text style={styles.bottomEmergencyArrow}>
            →
          </Text>
        </Pressable>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>
            WOMEN SAFETY ANALYTICS
          </Text>

          <Text style={styles.footerText}>
            Stay aware. Stay connected. Stay safe.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ActivityRow({
  icon,
  title,
  description,
  time,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  time: string;
  color: string;
}) {
  return (
    <View style={styles.activityRow}>
      <View
        style={[
          styles.activityIcon,
          { backgroundColor: `${color}15` },
        ]}
      >
        <Text
          style={[
            styles.activityIconText,
            { color },
          ]}
        >
          {icon}
        </Text>
      </View>

      <View style={styles.activityContent}>
        <Text style={styles.activityTitle}>
          {title}
        </Text>

        <Text style={styles.activityDescription}>
          {description}
        </Text>
      </View>

      <Text style={styles.activityTime}>
        {time}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8F4",
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: "#F7F8F4",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  loadingLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#8B2635",
    alignItems: "center",
    justifyContent: "center",
  },

  loadingLogoText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1,
  },

  loadingTitle: {
    marginTop: 26,
    fontSize: 20,
    fontWeight: "800",
    color: "#171717",
    textAlign: "center",
  },

  loadingSubtitle: {
    marginTop: 8,
    color: "#777777",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.6,
    color: "#8B2635",
    marginBottom: 7,
  },

  greeting: {
    fontSize: 30,
    lineHeight: 35,
    fontWeight: "800",
    color: "#171717",
    letterSpacing: -0.7,
  },

  headerSubtitle: {
    marginTop: 5,
    fontSize: 13,
    color: "#777777",
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E6E6E1",
  },

  profileIcon: {
    fontSize: 22,
    color: "#8B2635",
  },

  gpsStatus: {
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EAF5EE",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    marginBottom: 14,
  },

  gpsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#15803D",
    marginRight: 8,
  },

  gpsText: {
    flex: 1,
    fontSize: 10,
    fontWeight: "800",
    color: "#166534",
    letterSpacing: 0.8,
  },

  gpsTime: {
    fontSize: 9,
    fontWeight: "800",
    color: "#15803D",
  },

  scoreCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E8E8E2",
    marginBottom: 14,
  },

  scoreHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  cardEyebrow: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: "#999999",
  },

  scoreTitle: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "800",
    color: "#171717",
  },

  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  riskDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  riskBadgeText: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  scoreRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 14,
  },

  scoreNumber: {
    fontSize: 64,
    lineHeight: 70,
    fontWeight: "900",
    letterSpacing: -3,
  },

  scoreOutOf: {
    marginLeft: 5,
    fontSize: 16,
    color: "#999999",
    fontWeight: "700",
  },

  scoreTrack: {
    height: 8,
    borderRadius: 8,
    backgroundColor: "#ECEDE8",
    overflow: "hidden",
    marginTop: 10,
  },

  scoreProgress: {
    height: "100%",
    borderRadius: 8,
  },

  scoreFooter: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  scoreDescription: {
    flex: 1,
    fontSize: 12,
    color: "#666666",
    lineHeight: 18,
    paddingRight: 10,
  },

  scoreUpdated: {
    fontSize: 9,
    color: "#AAAAAA",
  },

  sosCard: {
    minHeight: 86,
    borderRadius: 20,
    backgroundColor: "#8B2635",
    paddingHorizontal: 17,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
    shadowColor: "#8B2635",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 15,
    elevation: 5,
  },

  sosLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  sosIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  sosIcon: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
  },

  sosTextContainer: {
    flex: 1,
  },

  sosTitle: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  sosSubtitle: {
    color: "rgba(255,255,255,0.76)",
    fontSize: 11,
    lineHeight: 16,
    marginTop: 4,
  },

  sosArrow: {
    color: "#FFFFFF",
    fontSize: 31,
    fontWeight: "300",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12,
  },

  sectionEyebrow: {
    color: "#8B2635",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.4,
  },

  sectionTitle: {
    marginTop: 3,
    color: "#171717",
    fontSize: 19,
    fontWeight: "800",
  },

  viewLink: {
    color: "#8B2635",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 0.8,
  },

  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E8E8E2",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },

  locationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F7E8EA",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  locationPin: {
    color: "#8B2635",
    fontSize: 20,
  },

  locationContent: {
    flex: 1,
  },

  locationTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#262626",
    lineHeight: 18,
  },

  coordinates: {
    marginTop: 3,
    fontSize: 10,
    color: "#888888",
  },

  livePill: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "#EAF5EE",
  },

  livePillText: {
    color: "#15803D",
    fontSize: 8,
    fontWeight: "900",
  },

  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 26,
  },

  actionCard: {
    width: (width - 52) / 2,
    minHeight: 132,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E8E8E2",
    marginBottom: 10,
  },

  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 11,
  },

  actionEmoji: {
    fontSize: 18,
  },

  actionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#202020",
  },

  actionDescription: {
    marginTop: 4,
    fontSize: 10,
    color: "#888888",
    lineHeight: 15,
  },

  policeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E8E8E2",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 13,
  },

  policeIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#EEF0F6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  policeEmoji: {
    fontSize: 22,
  },

  policeContent: {
    flex: 1,
  },

  policeName: {
    color: "#202020",
    fontSize: 13,
    fontWeight: "800",
  },

  policeAddress: {
    color: "#888888",
    fontSize: 10,
    marginTop: 3,
  },

  policeDistance: {
    color: "#8B2635",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 5,
  },

  directionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8B2635",
    alignItems: "center",
    justifyContent: "center",
  },

  directionText: {
    color: "#FFFFFF",
    fontSize: 22,
  },

  safeRouteCard: {
    backgroundColor: "#E9F4ED",
    borderRadius: 21,
    padding: 18,
    marginBottom: 27,
  },

  safeRouteTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  safeRouteIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  safeRouteIconText: {
    color: "#15803D",
    fontSize: 22,
    fontWeight: "900",
  },

  safeRouteEyebrow: {
    color: "#15803D",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  safeRouteTitle: {
    color: "#18351F",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 2,
  },

  safeRouteDescription: {
    color: "#54705B",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 13,
  },

  safeRouteButton: {
    height: 44,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    marginTop: 15,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  safeRouteButtonText: {
    color: "#15803D",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.7,
  },

  safeRouteArrow: {
    color: "#15803D",
    fontSize: 20,
  },

  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#E8E8E2",
    paddingHorizontal: 15,
    marginBottom: 16,
  },

  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },

  activityIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },

  activityIconText: {
    fontSize: 15,
    fontWeight: "900",
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#252525",
  },

  activityDescription: {
    fontSize: 10,
    color: "#929292",
    marginTop: 3,
  },

  activityTime: {
    fontSize: 9,
    color: "#AAAAAA",
  },

  activityDivider: {
    height: 1,
    backgroundColor: "#EEEEEA",
  },

  bottomEmergency: {
    backgroundColor: "#202020",
    borderRadius: 19,
    minHeight: 76,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  bottomEmergencyEyebrow: {
    color: "#CFA3AA",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  bottomEmergencyTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginTop: 4,
  },

  bottomEmergencyArrow: {
    color: "#FFFFFF",
    fontSize: 26,
  },

  footer: {
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 10,
  },

  footerBrand: {
    color: "#8B2635",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  footerText: {
    color: "#AAAAAA",
    fontSize: 9,
    marginTop: 5,
  },

  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.99 }],
  },
});

