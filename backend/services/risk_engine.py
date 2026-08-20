import math
from datetime import datetime, timezone

from models.safety_report import SafetyReport


SEARCH_RADIUS_KM = 2.0

SEVERITY_WEIGHTS = {
    1: 5,
    2: 12,
    3: 22,
    4: 35,
}

VERIFICATION_MULTIPLIER = {
    "verified": 1.0,
    "trusted": 0.85,
    "user": 0.55,
    "unverified": 0.35,
}


def calculate_distance_km(
    latitude1,
    longitude1,
    latitude2,
    longitude2,
):
    earth_radius_km = 6371.0

    lat1 = math.radians(latitude1)
    lat2 = math.radians(latitude2)

    delta_lat = math.radians(latitude2 - latitude1)
    delta_lon = math.radians(longitude2 - longitude1)

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(delta_lon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a),
    )

    return earth_radius_km * c


def calculate_time_weight(reported_at):
    if not reported_at:
        return 0.1

    now = datetime.now(timezone.utc)

    if reported_at.tzinfo is None:
        reported_at = reported_at.replace(
            tzinfo=timezone.utc
        )

    age_hours = (
        now - reported_at
    ).total_seconds() / 3600

    age_hours = max(age_hours, 0)

    if age_hours <= 1:
        return 1.0

    if age_hours <= 6:
        return 0.8

    if age_hours <= 24:
        return 0.6

    if age_hours <= 24 * 7:
        return 0.35

    if age_hours <= 24 * 30:
        return 0.15

    return 0.05


def calculate_distance_weight(distance_km):
    if distance_km <= 0.25:
        return 1.0

    if distance_km <= 0.5:
        return 0.85

    if distance_km <= 1.0:
        return 0.65

    if distance_km <= 1.5:
        return 0.4

    if distance_km <= SEARCH_RADIUS_KM:
        return 0.2

    return 0.0


def calculate_verification_weight(report):
    if report.verified:
        return 1.0

    source = (
        report.source or "user"
    ).lower()

    if source in ["police", "admin"]:
        return VERIFICATION_MULTIPLIER["verified"]

    if source in ["trusted_source", "trusted"]:
        return VERIFICATION_MULTIPLIER["trusted"]

    if source == "user":
        return VERIFICATION_MULTIPLIER["user"]

    return VERIFICATION_MULTIPLIER["unverified"]


def calculate_report_risk(
    report,
    user_latitude,
    user_longitude,
):
    distance = calculate_distance_km(
        user_latitude,
        user_longitude,
        report.latitude,
        report.longitude,
    )

    distance_weight = calculate_distance_weight(
        distance
    )

    if distance_weight == 0:
        return None

    time_weight = calculate_time_weight(
        report.reported_at
    )

    severity_weight = SEVERITY_WEIGHTS.get(
        report.severity,
        5,
    )

    verification_weight = (
        calculate_verification_weight(report)
    )

    risk_contribution = (
        severity_weight
        * distance_weight
        * time_weight
        * verification_weight
    )

    return {
        # Report identity
        "report_id": report.id,

        # Actual report location
        "latitude": report.latitude,
        "longitude": report.longitude,

        # Report information
        "incident_type": report.incident_type,
        "severity": report.severity,
        "description": report.description,

        # Trust information
        "verified": report.verified,
        "source": report.source,

        # Distance from current user
        "distance_km": round(
            distance,
            3,
        ),

        # Time information
        "reported_at": (
            report.reported_at.isoformat()
            if report.reported_at
            else None
        ),

        # Calculation details
        "time_weight": round(
            time_weight,
            3,
        ),
        "distance_weight": round(
            distance_weight,
            3,
        ),
        "verification_weight": round(
            verification_weight,
            3,
        ),

        "risk_contribution": round(
            risk_contribution,
            2,
        ),
    }


def calculate_safety_score(
    user_latitude,
    user_longitude,
):
    reports = SafetyReport.query.all()

    nearby_reports = []

    total_risk = 0.0

    for report in reports:

        result = calculate_report_risk(
            report,
            user_latitude,
            user_longitude,
        )

        if result is None:
            continue

        nearby_reports.append(result)

        total_risk += result[
            "risk_contribution"
        ]

    risk_score = min(
        100,
        round(total_risk),
    )

    safety_score = max(
        0,
        100 - risk_score,
    )

    if risk_score <= 25:
        risk_level = "LOW"

    elif risk_score <= 50:
        risk_level = "MODERATE"

    elif risk_score <= 75:
        risk_level = "HIGH"

    else:
        risk_level = "CRITICAL"

    nearby_reports.sort(
        key=lambda item: item[
            "risk_contribution"
        ],
        reverse=True,
    )

    return {
        "safety_score": safety_score,
        "risk_score": risk_score,
        "risk_level": risk_level,

        "location": {
            "latitude": user_latitude,
            "longitude": user_longitude,
        },

        "search_radius_km": SEARCH_RADIUS_KM,

        "nearby_report_count": len(
            nearby_reports
        ),

        "reports": nearby_reports,
    }