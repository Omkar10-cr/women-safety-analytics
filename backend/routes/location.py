from flask import Blueprint, request, jsonify

from extensions import db
from models.location import Location


location_bp = Blueprint(
    "location",
    __name__,
    url_prefix="/api/location"
)


@location_bp.route("", methods=["GET"])
def get_locations():

    locations = Location.query.order_by(
        Location.created_at.desc()
    ).limit(20).all()

    return jsonify({
        "success": True,
        "count": len(locations),
        "locations": [
            location.to_dict()
            for location in locations
        ]
    }), 200


@location_bp.route("", methods=["POST"])
def update_location():

    data = request.get_json(silent=True)

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required"
        }), 400

    latitude = data.get("latitude")
    longitude = data.get("longitude")
    accuracy = data.get("accuracy")

    if latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "message": "latitude and longitude are required"
        }), 400

    try:
        new_location = Location(
            latitude=latitude,
            longitude=longitude,
            accuracy=accuracy
        )

        db.session.add(new_location)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Location saved successfully",
            "location": new_location.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({
            "success": False,
            "message": f"Error saving location: {str(e)}"
        }), 500