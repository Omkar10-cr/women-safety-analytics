from flask import Blueprint, request, jsonify

from extensions import db
from models.safety_report import SafetyReport


# =========================================================
# Safety Reports Blueprint
# =========================================================

reports_bp = Blueprint(
    "reports",
    __name__,
    url_prefix="/api/reports"
)


# =========================================================
# Create Safety Report
# =========================================================

@reports_bp.route("", methods=["POST"])
def create_report():

    data = request.get_json(silent=True)

    # -----------------------------------------------------
    # Check request body
    # -----------------------------------------------------

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    # -----------------------------------------------------
    # Get values
    # -----------------------------------------------------

    latitude = data.get("latitude")
    longitude = data.get("longitude")
    incident_type = data.get("incident_type")
    severity = data.get("severity", 1)

    # -----------------------------------------------------
    # Required fields
    # -----------------------------------------------------

    if latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "message": "Latitude and longitude are required"
        }), 400

    if not incident_type:
        return jsonify({
            "success": False,
            "message": "Incident type is required"
        }), 400

    # -----------------------------------------------------
    # Convert values
    # -----------------------------------------------------

    try:
        latitude = float(latitude)
        longitude = float(longitude)
        severity = int(severity)

    except (TypeError, ValueError):
        return jsonify({
            "success": False,
            "message": "Latitude, longitude and severity must be valid numbers"
        }), 400

    # -----------------------------------------------------
    # Validate latitude
    # -----------------------------------------------------

    if not -90 <= latitude <= 90:
        return jsonify({
            "success": False,
            "message": "Invalid latitude. Must be between -90 and 90."
        }), 400

    # -----------------------------------------------------
    # Validate longitude
    # -----------------------------------------------------

    if not -180 <= longitude <= 180:
        return jsonify({
            "success": False,
            "message": "Invalid longitude. Must be between -180 and 180."
        }), 400

    # -----------------------------------------------------
    # Validate severity
    # -----------------------------------------------------

    if severity not in [1, 2, 3, 4]:
        return jsonify({
            "success": False,
            "message": "Severity must be between 1 and 4"
        }), 400

    # -----------------------------------------------------
    # Create safety report
    # -----------------------------------------------------

    report = SafetyReport(
        latitude=latitude,
        longitude=longitude,
        incident_type=incident_type,
        severity=severity,
        description=data.get("description"),
        verified=bool(data.get("verified", False)),
        source=data.get("source", "user")
    )

    # -----------------------------------------------------
    # Save to database
    # -----------------------------------------------------

    try:

        db.session.add(report)
        db.session.commit()

    except Exception as error:

        db.session.rollback()

        print("❌ Error saving safety report:", error)

        return jsonify({
            "success": False,
            "message": "Failed to save safety report"
        }), 500

    # -----------------------------------------------------
    # Return response
    # -----------------------------------------------------

    return jsonify({
        "success": True,
        "message": "Safety report created successfully",
        "report": report.to_dict()
    }), 201


# =========================================================
# Get Safety Reports
# =========================================================

@reports_bp.route("", methods=["GET"])
def get_reports():

    try:

        reports = SafetyReport.query.order_by(
            SafetyReport.reported_at.desc()
        ).limit(100).all()

        return jsonify({
            "success": True,
            "count": len(reports),
            "reports": [
                report.to_dict()
                for report in reports
            ]
        }), 200

    except Exception as error:

        print("❌ Error fetching safety reports:", error)

        return jsonify({
            "success": False,
            "message": "Failed to fetch safety reports"
        }), 500