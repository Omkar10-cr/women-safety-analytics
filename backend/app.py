import math
import requests
import sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

from flask import Flask, jsonify, request
from flask_cors import CORS

# ============================================================
# APP CONFIGURATION
# ============================================================

app = Flask(__name__)

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*"
        }
    }
)

# ============================================================
# EXISTING BLUEPRINTS
# ============================================================
#
# Your project already has:
#
# routes/
#   auth.py
#   location.py
#   reports.py
#   risk.py
#
# These imports keep your existing APIs working.
# ============================================================

try:
    from routes.auth import auth_bp
    app.register_blueprint(auth_bp)
    print("✅ Auth routes registered")
except Exception as error:
    print("⚠️ Auth routes could not be registered:", error)


try:
    from routes.location import location_bp
    app.register_blueprint(location_bp)
    print("✅ Location routes registered")
except Exception as error:
    print("⚠️ Location routes could not be registered:", error)


try:
    from routes.reports import reports_bp
    app.register_blueprint(reports_bp)
    print("✅ Reports routes registered")
except Exception as error:
    print("⚠️ Reports routes could not be registered:", error)


try:
    from routes.risk import risk_bp
    app.register_blueprint(risk_bp)
    print("✅ Risk routes registered")
except Exception as error:
    print("⚠️ Risk routes could not be registered:", error)


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "success": True,
        "message": "Women Safety Analytics API is running",
        "service": "Women Safety Analytics",
        "status": "healthy"
    }), 200


# ============================================================
# DISTANCE CALCULATION
# ============================================================

def calculate_distance_km(
    latitude1,
    longitude1,
    latitude2,
    longitude2
):
    """
    Calculate distance between two GPS coordinates
    using the Haversine formula.
    """

    earth_radius_km = 6371.0

    lat1 = math.radians(latitude1)
    lat2 = math.radians(latitude2)

    delta_lat = math.radians(latitude2 - latitude1)
    delta_lon = math.radians(longitude2 - longitude1)

    a = (
        math.sin(delta_lat / 2) ** 2
        +
        math.cos(lat1)
        * math.cos(lat2)
        * math.sin(delta_lon / 2) ** 2
    )

    a = max(0.0, min(1.0, a))

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    return earth_radius_km * c


# ============================================================
# REVERSE GEOCODING
# ============================================================

def get_real_location_name(latitude, longitude):
    """
    Convert GPS coordinates into a real human-readable
    location name using OpenStreetMap Nominatim.
    """

    try:

        url = "https://nominatim.openstreetmap.org/reverse"

        params = {
            "format": "jsonv2",
            "lat": latitude,
            "lon": longitude,
            "zoom": 18,
            "addressdetails": 1,
            "accept-language": "en"
        }

        response = requests.get(
            url,
            params=params,
            headers={
                "User-Agent": "WomenSafetyAnalytics/1.0"
            },
            timeout=10
        )

        if response.status_code != 200:
            print(
                "Reverse geocoding failed:",
                response.status_code
            )

            return {
                "name": "Current location",
                "address": ""
            }

        data = response.json()

        address_data = data.get(
            "address",
            {}
        )

        road = (
            address_data.get("road")
            or address_data.get("pedestrian")
            or address_data.get("neighbourhood")
            or address_data.get("suburb")
            or ""
        )

        area = (
            address_data.get("suburb")
            or address_data.get("neighbourhood")
            or address_data.get("quarter")
            or ""
        )

        city = (
            address_data.get("city")
            or address_data.get("town")
            or address_data.get("village")
            or address_data.get("municipality")
            or ""
        )

        state = address_data.get(
            "state",
            ""
        )

        postcode = address_data.get(
            "postcode",
            ""
        )

        parts = []

        for value in [
            road,
            area,
            city,
            state
        ]:
            if value and value not in parts:
                parts.append(value)

        location_name = ", ".join(
            parts[:4]
        )

        if not location_name:
            location_name = (
                data.get("display_name")
                or "Current location"
            )

        return {
            "name": location_name,
            "address": (
                data.get("display_name")
                or location_name
            )
        }

    except requests.RequestException as error:

        print(
            "Reverse geocoding network error:",
            error
        )

        return {
            "name": "Current location",
            "address": ""
        }

    except Exception as error:

        print(
            "Reverse geocoding error:",
            error
        )

        return {
            "name": "Current location",
            "address": ""
        }


# ============================================================
# OVERPASS SEARCH
# ============================================================

def search_nearby_places(
    latitude,
    longitude,
    radius_meters=15000
):
    """
    Search OpenStreetMap for nearby:
      - Police stations
      - Hospitals
      - Fire stations
      - Community centres
    """

    query = f"""
    [out:json][timeout:30];

    (
        node["amenity"="police"]
        (around:{radius_meters},{latitude},{longitude});

        way["amenity"="police"]
        (around:{radius_meters},{latitude},{longitude});

        relation["amenity"="police"]
        (around:{radius_meters},{latitude},{longitude});

        node["amenity"="hospital"]
        (around:{radius_meters},{latitude},{longitude});

        way["amenity"="hospital"]
        (around:{radius_meters},{latitude},{longitude});

        relation["amenity"="hospital"]
        (around:{radius_meters},{latitude},{longitude});

        node["amenity"="fire_station"]
        (around:{radius_meters},{latitude},{longitude});

        way["amenity"="fire_station"]
        (around:{radius_meters},{latitude},{longitude});

        relation["amenity"="fire_station"]
        (around:{radius_meters},{latitude},{longitude});

        node["amenity"="community_centre"]
        (around:{radius_meters},{latitude},{longitude});

        way["amenity"="community_centre"]
        (around:{radius_meters},{latitude},{longitude});

        relation["amenity"="community_centre"]
        (around:{radius_meters},{latitude},{longitude});
    );

    out center tags;
    """

    overpass_servers = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter"
    ]

    for server in overpass_servers:

        try:

            print(
                f"🔎 Searching nearby places using {server}"
            )

            response = requests.post(
                server,
                data=query,
                headers={
                    "User-Agent":
                        "WomenSafetyAnalytics/1.0"
                },
                timeout=35
            )

            if response.status_code != 200:

                print(
                    "Overpass response:",
                    response.status_code
                )

                continue

            data = response.json()

            elements = data.get(
                "elements",
                []
            )

            print(
                f"📍 OpenStreetMap returned "
                f"{len(elements)} places"
            )

            places = []

            for element in elements:

                tags = element.get(
                    "tags",
                    {}
                )

                element_lat = element.get(
                    "lat"
                )

                element_lon = element.get(
                    "lon"
                )

                # Ways/relations have center coordinates
                if (
                    element_lat is None
                    or element_lon is None
                ):

                    center = element.get(
                        "center"
                    )

                    if center:

                        element_lat = center.get(
                            "lat"
                        )

                        element_lon = center.get(
                            "lon"
                        )

                if (
                    element_lat is None
                    or element_lon is None
                ):
                    continue

                amenity = tags.get(
                    "amenity",
                    ""
                )

                name = (
                    tags.get("name")
                    or tags.get("official_name")
                    or tags.get("short_name")
                )

                if not name:

                    if amenity == "police":
                        name = "Police Station"

                    elif amenity == "hospital":
                        name = "Hospital"

                    elif amenity == "fire_station":
                        name = "Fire Station"

                    elif amenity == "community_centre":
                        name = "Community Centre"

                    else:
                        name = "Nearby Place"

                distance = calculate_distance_km(
                    latitude,
                    longitude,
                    float(element_lat),
                    float(element_lon)
                )

                place = {
                    "name": name,
                    "type": amenity,
                    "latitude": float(element_lat),
                    "longitude": float(element_lon),
                    "distance_km": round(
                        distance,
                        2
                    )
                }

                places.append(place)

            return places

        except requests.RequestException as error:

            print(
                "Overpass request failed:",
                error
            )

        except Exception as error:

            print(
                "Overpass processing failed:",
                error
            )

    return []


# ============================================================
# NEARBY API
# ============================================================

@app.route(
    "/api/nearby",
    methods=["GET"]
)
def nearby_places():

    try:

        # ----------------------------------------------------
        # GET GPS COORDINATES
        # ----------------------------------------------------

        latitude = request.args.get(
            "latitude",
            type=float
        )

        longitude = request.args.get(
            "longitude",
            type=float
        )

        if latitude is None:

            return jsonify({
                "success": False,
                "message":
                    "latitude is required"
            }), 400

        if longitude is None:

            return jsonify({
                "success": False,
                "message":
                    "longitude is required"
            }), 400

        # ----------------------------------------------------
        # VALIDATE GPS
        # ----------------------------------------------------

        if not -90 <= latitude <= 90:

            return jsonify({
                "success": False,
                "message":
                    "Invalid latitude"
            }), 400

        if not -180 <= longitude <= 180:

            return jsonify({
                "success": False,
                "message":
                    "Invalid longitude"
            }), 400

        print("")
        print("=" * 60)
        print("📍 NEARBY LOCATION REQUEST")
        print(
            f"Latitude : {latitude}"
        )
        print(
            f"Longitude: {longitude}"
        )
        print("=" * 60)

        # ----------------------------------------------------
        # GET REAL LOCATION NAME
        # ----------------------------------------------------

        location = get_real_location_name(
            latitude,
            longitude
        )

        print(
            "📌 Location:",
            location["name"]
        )

        # ----------------------------------------------------
        # SEARCH NEARBY PLACES
        # ----------------------------------------------------

        places = search_nearby_places(
            latitude,
            longitude,
            15000
        )

        # ----------------------------------------------------
        # POLICE STATIONS
        # ----------------------------------------------------

        police_stations = [
            place
            for place in places
            if place["type"] == "police"
        ]

        police_stations.sort(
            key=lambda item:
                item["distance_km"]
        )

        nearest_police = (
            police_stations[0]
            if police_stations
            else None
        )

        # ----------------------------------------------------
        # SAFE PLACES
        # ----------------------------------------------------

        safe_types = {
            "hospital",
            "fire_station",
            "community_centre"
        }

        safe_places = [
            place
            for place in places
            if place["type"] in safe_types
        ]

        safe_places.sort(
            key=lambda item:
                item["distance_km"]
        )

        nearest_safe_place = (
            safe_places[0]
            if safe_places
            else None
        )

        # ----------------------------------------------------
        # LOG RESULTS
        # ----------------------------------------------------

        print(
            f"🚓 Police stations found:"
            f" {len(police_stations)}"
        )

        print(
            f"🏥 Safe places found:"
            f" {len(safe_places)}"
        )

        if nearest_police:

            print(
                "🚓 Nearest police:",
                nearest_police["name"],
                f"({nearest_police['distance_km']} km)"
            )

        else:

            print(
                "⚠️ No police station found"
            )

        if nearest_safe_place:

            print(
                "🏥 Nearest safe place:",
                nearest_safe_place["name"],
                f"({nearest_safe_place['distance_km']} km)"
            )

        else:

            print(
                "⚠️ No safe place found"
            )

        # ----------------------------------------------------
        # RETURN RESPONSE
        # ----------------------------------------------------

        return jsonify({

            "success": True,

            "current_location": {

                "latitude": latitude,

                "longitude": longitude,

                "name":
                    location["name"],

                "address":
                    location["address"]

            },

            "police_station":
                nearest_police,

            "safe_place":
                nearest_safe_place,

            "police_station_count":
                len(police_stations),

            "safe_place_count":
                len(safe_places),

            "search_radius_km":
                15

        }), 200

    except Exception as error:

        print(
            "❌ Nearby API error:",
            error
        )

        return jsonify({

            "success": False,

            "message":
                "Unable to fetch nearby location data",

            "error":
                str(error)

        }), 500


# ============================================================
# HOME
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({

        "success": True,

        "message":
            "Women Safety Analytics API",

        "endpoints": {

            "health":
                "/api/health",

            "nearby":
                "/api/nearby?latitude=19.29495&longitude=72.85543",

            "location":
                "/api/location",

            "reports":
                "/api/reports",

            "risk":
                "/api/risk/score"

        }

    })


# ============================================================
# 404 HANDLER
# ============================================================

@app.errorhandler(404)
def not_found(error):

    return jsonify({

        "success": False,

        "message":
            "API endpoint not found"

    }), 404


# ============================================================
# 500 HANDLER
# ============================================================

@app.errorhandler(500)
def internal_error(error):

    return jsonify({

        "success": False,

        "message":
            "Internal server error"

    }), 500


# ============================================================
# START SERVER
# ============================================================

if __name__ == "__main__":

    print("")
    print("=" * 60)
    print("🚀 Women Safety Analytics API Starting...")
    print("=" * 60)

    print(
        "📍 Server:"
        " http://127.0.0.1:5000"
    )

    print(
        "❤️ Health:"
        " http://127.0.0.1:5000/api/health"
    )

    print(
        "📍 Nearby:"
        " GET /api/nearby"
    )

    print(
        "📍 Location:"
        " /api/location"
    )

    print(
        "🚨 Reports:"
        " /api/reports"
    )

    print(
        "🛡️ Risk:"
        " /api/risk/score"
    )

    print("=" * 60)
    print("")

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )