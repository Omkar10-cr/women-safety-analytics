"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ExternalLink,
  Loader2,
  MapPin,
  Navigation,
  RefreshCw,
  ShieldCheck,
  Siren,
} from "lucide-react";

type LocationData = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

type NearbyPlace = {
  name: string;
  type?: string;
  latitude: number;
  longitude: number;
  distance_km: number;
};

type NearbyResponse = {
  success: boolean;

  current_location?: {
    name?: string;
    address?: string;
    latitude: number;
    longitude: number;
  };

  police_station?: NearbyPlace | null;

  safe_place?: NearbyPlace | null;

  police_station_count?: number;

  search_radius_km?: number;

  message?: string;
};

const API_URL = "/api/backend";

export default function LocationCard() {
  const [location, setLocation] =
    useState<LocationData | null>(null);

  const [locationName, setLocationName] = useState(
    "Finding your location..."
  );

  const [locationAddress, setLocationAddress] =
    useState("");

  const [policeStation, setPoliceStation] =
    useState<NearbyPlace | null>(null);

  const [safePlace, setSafePlace] =
    useState<NearbyPlace | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [nearbyLoading, setNearbyLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [nearbyError, setNearbyError] =
    useState("");

  const [lastUpdated, setLastUpdated] =
    useState<Date | null>(null);

  const watchIdRef =
    useRef<number | null>(null);

  const lastApiCallRef =
    useRef(0);

  /*
   * ============================================================
   * FETCH NEARBY PLACES
   * ============================================================
   */

  const fetchNearbyPlaces = useCallback(
    async (
      latitude: number,
      longitude: number
    ) => {
      setNearbyLoading(true);
      setNearbyError("");

      try {
        const url =
          `${API_URL}/nearby` +
          `?latitude=${encodeURIComponent(latitude)}` +
          `&longitude=${encodeURIComponent(longitude)}`;

        console.log(
          "🌐 Calling Next.js proxy:",
          url
        );

        const response = await fetch(url, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          cache: "no-store",
        });

        console.log(
          "🌐 Nearby HTTP status:",
          response.status
        );

        const data: NearbyResponse =
          await response.json();

        console.log(
          "📍 Nearby response:",
          data
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Nearby API returned ${response.status}`
          );
        }

        if (!data.success) {
          throw new Error(
            data.message ||
              "Unable to find nearby places"
          );
        }

        /*
         * CURRENT LOCATION
         */

        if (data.current_location) {
          setLocationName(
            data.current_location.name ||
              "Current location"
          );

          setLocationAddress(
            data.current_location.address ||
              ""
          );
        }

        /*
         * POLICE STATION
         */

        setPoliceStation(
          data.police_station || null
        );

        /*
         * SAFE PLACE
         */

        setSafePlace(
          data.safe_place || null
        );

        setLastUpdated(
          new Date()
        );

        console.log(
          "🚔 Police station:",
          data.police_station
        );

        console.log(
          "🏥 Safe place:",
          data.safe_place
        );
      } catch (error) {
        console.error(
          "❌ Nearby API error:",
          error
        );

        const message =
          error instanceof Error
            ? error.message
            : "Unable to connect to nearby service.";

        setNearbyError(message);
      } finally {
        setNearbyLoading(false);
      }
    },
    []
  );

  /*
   * ============================================================
   * GPS SUCCESS
   * ============================================================
   */

  const handlePosition = useCallback(
    async (
      position: GeolocationPosition
    ) => {
      const latitude =
        position.coords.latitude;

      const longitude =
        position.coords.longitude;

      const accuracy =
        position.coords.accuracy;

      console.log(
        "================================"
      );

      console.log(
        "📍 REAL GPS LOCATION"
      );

      console.log(
        "Latitude:",
        latitude
      );

      console.log(
        "Longitude:",
        longitude
      );

      console.log(
        "Accuracy:",
        accuracy,
        "meters"
      );

      console.log(
        "================================"
      );

      setLocation({
        latitude,
        longitude,
        accuracy,
      });

      setError("");

      /*
       * Prevent excessive API requests.
       */

      const now = Date.now();

      if (
        now - lastApiCallRef.current <
        10000
      ) {
        setLoading(false);
        return;
      }

      lastApiCallRef.current =
        now;

      await fetchNearbyPlaces(
        latitude,
        longitude
      );

      setLoading(false);
    },
    [fetchNearbyPlaces]
  );

  /*
   * ============================================================
   * GPS ERROR
   * ============================================================
   */

  const handlePositionError =
    useCallback(
      (
        positionError: GeolocationPositionError
      ) => {
        console.error(
          "❌ GPS error:",
          positionError
        );

        setLoading(false);

        if (
          positionError.code ===
          positionError.PERMISSION_DENIED
        ) {
          setError(
            "Location permission was denied. Allow location access in your browser."
          );
        } else if (
          positionError.code ===
          positionError.POSITION_UNAVAILABLE
        ) {
          setError(
            "Your device could not determine your current GPS position."
          );
        } else if (
          positionError.code ===
          positionError.TIMEOUT
        ) {
          setError(
            "GPS request timed out. Please try again."
          );
        } else {
          setError(
            "Unable to get your current location."
          );
        }
      },
      []
    );

  /*
   * ============================================================
   * START GPS
   * ============================================================
   */

  const startLocationTracking =
    useCallback(() => {
      if (
        typeof window ===
        "undefined"
      ) {
        return;
      }

      if (
        !navigator.geolocation
      ) {
        setLoading(false);

        setError(
          "Geolocation is not supported by this browser."
        );

        return;
      }

      console.log(
        "📡 Starting real GPS tracking..."
      );

      setLoading(true);
      setError("");

      /*
       * Immediate GPS request
       */

      navigator.geolocation.getCurrentPosition(
        handlePosition,
        handlePositionError,
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );

      /*
       * Clear previous watcher
       */

      if (
        watchIdRef.current !== null
      ) {
        navigator.geolocation.clearWatch(
          watchIdRef.current
        );
      }

      /*
       * Continuous GPS tracking
       */

      watchIdRef.current =
        navigator.geolocation.watchPosition(
          handlePosition,
          handlePositionError,
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 5000,
          }
        );
    }, [
      handlePosition,
      handlePositionError,
    ]);

  /*
   * ============================================================
   * START ON LOAD
   * ============================================================
   */

  useEffect(() => {
    const timer = window.setTimeout(() => {
      startLocationTracking();
    }, 0);

    return () => {
      window.clearTimeout(timer);
      if (
        watchIdRef.current !== null
      ) {
        navigator.geolocation.clearWatch(
          watchIdRef.current
        );

        watchIdRef.current = null;
      }
    };
  }, [
    startLocationTracking,
  ]);

  /*
   * ============================================================
   * REFRESH
   * ============================================================
   */

  const refreshLocation = () => {
    lastApiCallRef.current = 0;

    setPoliceStation(null);
    setSafePlace(null);
    setNearbyError("");

    startLocationTracking();
  };

  /*
   * ============================================================
   * GOOGLE MAPS
   * ============================================================
   */

  const openCurrentLocation = () => {
    if (!location) {
      return;
    }

    const url =
      "https://www.google.com/maps/search/?api=1&query=" +
      `${location.latitude},${location.longitude}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const openPlace = (
    place: NearbyPlace
  ) => {
    const url =
      "https://www.google.com/maps/search/?api=1&query=" +
      `${place.latitude},${place.longitude}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /*
   * ============================================================
   * FORMAT DISTANCE
   * ============================================================
   */

  const formatDistance = (
    distanceKm: number
  ) => {
    if (
      !Number.isFinite(
        distanceKm
      )
    ) {
      return "Distance unavailable";
    }

    if (
      distanceKm < 1
    ) {
      return (
        Math.round(
          distanceKm * 1000
        ) + " m away"
      );
    }

    return (
      distanceKm.toFixed(2) +
      " km away"
    );
  };

  /*
   * ============================================================
   * FORMAT COORDINATES
   * ============================================================
   */

  const formatCoordinates =
    () => {
      if (!location) {
        return "Waiting for GPS...";
      }

      return (
        location.latitude.toFixed(
          5
        ) +
        ", " +
        location.longitude.toFixed(
          5
        )
      );
    };

  /*
   * ============================================================
   * GPS ACCURACY
   * ============================================================
   */

  const formatAccuracy =
    () => {
      if (!location) {
        return "Unknown";
      }

      return (
        "±" +
        Math.round(
          location.accuracy
        ) +
        " m"
      );
    };

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.04] p-6 backdrop-blur-2xl">

      {/* HEADER */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-500/10">
            <Navigation className="h-6 w-6 text-blue-400" />
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-300/60">
              Live GPS
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Your Current Location
            </h2>

            <p className="mt-1 text-sm text-white/35">
              Real-time location and nearby safety services
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={
            refreshLocation
          }
          disabled={
            loading ||
            nearbyLoading
          }
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-medium text-white/70 transition hover:bg-white/[0.09] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RefreshCw
            className={
              "h-4 w-4 " +
              (loading ||
              nearbyLoading
                ? "animate-spin"
                : "")
            }
          />

          Refresh
        </button>

      </div>

      {/* GPS STATUS */}

      <div className="mt-5 flex items-center justify-between rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.05] px-4 py-3">

        <div className="flex items-center gap-3">

          <span className="relative flex h-3 w-3">

            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />

            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />

          </span>

          <div>
            <p className="text-xs font-medium text-emerald-300">
              {loading
                ? "Getting GPS position..."
                : "GPS location active"}
            </p>

            <p className="mt-0.5 text-[11px] text-white/35">
              Accuracy{" "}
              {formatAccuracy()}
            </p>
          </div>

        </div>

        {lastUpdated && (
          <span className="text-[10px] text-white/25">
            Updated{" "}
            {lastUpdated.toLocaleTimeString()}
          </span>
        )}

      </div>

      {/* GPS ERROR */}

      {error && (
        <div className="mt-4 rounded-2xl border border-red-400/15 bg-red-500/[0.06] p-4">

          <p className="text-sm font-medium text-red-300">
            Location unavailable
          </p>

          <p className="mt-1 text-xs leading-5 text-red-200/60">
            {error}
          </p>

          <button
            type="button"
            onClick={
              refreshLocation
            }
            className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-500/20"
          >
            Try again
          </button>

        </div>
      )}

      {/* CURRENT LOCATION */}

      <div className="mt-5 rounded-2xl border border-white/[0.07] bg-black/20 p-5">

        <div className="flex items-start justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
              <MapPin className="h-5 w-5 text-blue-400" />
            </div>

            <div className="min-w-0">

              <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                Current location
              </p>

              <h3 className="mt-1 text-base font-semibold text-white">
                {locationName}
              </h3>

              {locationAddress && (
                <p className="mt-1 text-xs leading-5 text-white/40">
                  {locationAddress}
                </p>
              )}

            </div>

          </div>

          {location && (
            <span className="shrink-0 rounded-full border border-emerald-400/15 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
              LIVE
            </span>
          )}

        </div>

        {/* COORDINATES */}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">

          <div className="rounded-xl border border-white/5 bg-white/[0.025] p-3">

            <p className="text-[10px] uppercase tracking-[0.14em] text-white/25">
              Coordinates
            </p>

            <p className="mt-1 break-all text-xs font-medium text-white/70">
              {formatCoordinates()}
            </p>

          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.025] p-3">

            <p className="text-[10px] uppercase tracking-[0.14em] text-white/25">
              GPS accuracy
            </p>

            <p className="mt-1 text-xs font-medium text-white/70">
              {formatAccuracy()}
            </p>

          </div>

        </div>

        {/* GOOGLE MAPS */}

        <button
          type="button"
          onClick={
            openCurrentLocation
          }
          disabled={!location}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-400/15 bg-blue-500/10 px-4 py-3 text-xs font-medium text-blue-300 transition hover:bg-blue-500/15 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ExternalLink className="h-4 w-4" />
          Open my live location in Google Maps
        </button>

      </div>

      {/* NEARBY LOADING */}

      {nearbyLoading && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-blue-400/10 bg-blue-500/[0.04] px-4 py-3">

          <Loader2 className="h-4 w-4 animate-spin text-blue-400" />

          <p className="text-xs text-blue-200/60">
            Searching real nearby police stations and safe places...
          </p>

        </div>
      )}

      {/* NEARBY ERROR */}

      {nearbyError && (
        <div className="mt-4 rounded-2xl border border-yellow-400/10 bg-yellow-500/[0.04] p-4">

          <p className="text-xs font-medium text-yellow-300">
            Nearby services temporarily unavailable
          </p>

          <p className="mt-1 text-[11px] leading-5 text-white/35">
            {nearbyError}
          </p>

        </div>
      )}

      {/* NEARBY SERVICES */}

      <div className="mt-5 grid gap-4 md:grid-cols-2">

        {/* POLICE */}

        <div className="rounded-2xl border border-red-400/10 bg-red-500/[0.035] p-5">

          <div className="flex items-center justify-between">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
              <Siren className="h-5 w-5 text-red-400" />
            </div>

            {policeStation && (
              <span className="rounded-full border border-red-400/15 bg-red-500/10 px-2.5 py-1 text-[10px] font-medium text-red-300">
                NEAREST
              </span>
            )}

          </div>

          <p className="mt-5 text-xs uppercase tracking-[0.16em] text-red-300/50">
            Police station
          </p>

          <h3 className="mt-2 text-base font-semibold text-white">
            {nearbyLoading
              ? "Searching..."
              : policeStation?.name ||
                "No police station found"}
          </h3>

          <div className="mt-3 flex items-center justify-between">

            <span className="text-xs text-white/35">
              Distance
            </span>

            <span className="text-sm font-medium text-white/70">
              {policeStation
                ? formatDistance(
                    policeStation.distance_km
                  )
                : "Not available"}
            </span>

          </div>

          {policeStation && (
            <button
              type="button"
              onClick={() =>
                openPlace(
                  policeStation
                )
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-red-400/10 bg-red-500/10 px-3 py-2.5 text-xs font-medium text-red-300 transition hover:bg-red-500/15"
            >
              <MapPin className="h-3.5 w-3.5" />
              Open police station
            </button>
          )}

        </div>

        {/* SAFE PLACE */}

        <div className="rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.035] p-5">

          <div className="flex items-center justify-between">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            </div>

            {safePlace && (
              <span className="rounded-full border border-emerald-400/15 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-300">
                NEAREST
              </span>
            )}

          </div>

          <p className="mt-5 text-xs uppercase tracking-[0.16em] text-emerald-300/50">
            Safe place
          </p>

          <h3 className="mt-2 text-base font-semibold text-white">
            {nearbyLoading
              ? "Searching..."
              : safePlace?.name ||
                "No safe place found"}
          </h3>

          <div className="mt-3 flex items-center justify-between">

            <span className="text-xs text-white/35">
              Distance
            </span>

            <span className="text-sm font-medium text-white/70">
              {safePlace
                ? formatDistance(
                    safePlace.distance_km
                  )
                : "Not available"}
            </span>

          </div>

          {safePlace && (
            <button
              type="button"
              onClick={() =>
                openPlace(
                  safePlace
                )
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-400/10 bg-emerald-500/10 px-3 py-2.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/15"
            >
              <MapPin className="h-3.5 w-3.5" />
              Open safe place
            </button>
          )}

        </div>

      </div>

      {/* FOOTER */}

      <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-white/5 bg-black/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-[11px] text-white/30">
          Location is obtained from your device GPS.
        </p>

        <p className="text-[11px] text-white/20">
          Nearby search: up to 15 km
        </p>

      </div>

    </div>
  );
}
