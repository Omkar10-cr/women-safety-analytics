from flask import Blueprint, request, jsonify

from services.risk_engine import calculate_safety_score


risk_bp = Blueprint(
    "risk",
    __name__,
    url_prefix="/api/risk",
)


@risk_bp.route("/score", methods=["GET"])
def get_safety_score():

    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")

    if latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "message": "latitude and longitude are required",
        }), 400

    try:
        latitude = float(latitude)
        longitude = float(longitude)

    except (TypeError, ValueError):
        return jsonify({
            "success": False,
            "message": "Invalid latitude or longitude",
        }), 400

    if not -90 <= latitude <= 90:
        return jsonify({
            "success": False,
            "message": "Invalid latitude",
        }), 400

    if not -180 <= longitude <= 180:
        return jsonify({
            "success": False,
            "message": "Invalid longitude",
        }), 400

    try:

        result = calculate_safety_score(
            latitude,
            longitude,
        )

        return jsonify({
            "success": True,
            "data": result,
        }), 200

    except Exception as error:

        print(
            "❌ Risk calculation error:",
            error,
        )

        return jsonify({
            "success": False,
            "message": "Failed to calculate safety score",
        }), 500
