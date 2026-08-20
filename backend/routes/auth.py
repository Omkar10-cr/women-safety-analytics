from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash
import re

from extensions import db
from models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# =========================================================
# Validation Helpers
# =========================================================

def is_valid_email(email):
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None


def validate_password_strength(password):
    """
    Validate password strength requirements:
    - Minimum 8 characters
    - At least one uppercase letter
    - At least one lowercase letter
    - At least one digit
    """
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    if not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase letter"
    
    if not re.search(r'[a-z]', password):
        return False, "Password must contain at least one lowercase letter"
    
    if not re.search(r'[0-9]', password):
        return False, "Password must contain at least one digit"
    
    return True, None


# =========================================================
# Auth Routes
# =========================================================

@auth_bp.route("/register", methods=["POST"])
def register():
    """
    Register a new user
    Expected JSON:
    {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "SecurePass123",
        "confirmPassword": "SecurePass123"
    }
    """
    try:
        data = request.get_json()

        # Validate required fields
        if not data:
            return jsonify({"error": "Request body cannot be empty"}), 400

        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        password = data.get("password", "")
        confirm_password = data.get("confirmPassword", "")

        # Validation checks
        if not name:
            return jsonify({"error": "Name is required"}), 400

        if not email:
            return jsonify({"error": "Email is required"}), 400

        if not is_valid_email(email):
            return jsonify({"error": "Invalid email format"}), 400

        if not password:
            return jsonify({"error": "Password is required"}), 400

        if password != confirm_password:
            return jsonify({"error": "Passwords do not match"}), 400

        # Validate password strength
        is_strong, error_msg = validate_password_strength(password)
        if not is_strong:
            return jsonify({"error": error_msg}), 400

        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({"error": "Email already registered"}), 409

        # Create new user
        new_user = User(name=name, email=email)
        new_user.set_password(password)

        db.session.add(new_user)
        db.session.commit()

        # Create JWT token
        access_token = create_access_token(identity=new_user.id)

        return jsonify({
            "message": "User registered successfully",
            "user": new_user.to_dict(),
            "access_token": access_token
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Registration failed: {str(e)}"}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Login user and return JWT token
    Expected JSON:
    {
        "email": "john@example.com",
        "password": "SecurePass123"
    }
    """
    try:
        data = request.get_json()

        # Validate required fields
        if not data:
            return jsonify({"error": "Request body cannot be empty"}), 400

        email = data.get("email", "").strip()
        password = data.get("password", "")

        if not email:
            return jsonify({"error": "Email is required"}), 400

        if not password:
            return jsonify({"error": "Password is required"}), 400

        # Find user by email
        user = User.query.filter_by(email=email).first()

        # Verify user exists and password is correct
        if not user or not user.check_password(password):
            return jsonify({"error": "Invalid email or password"}), 401

        # Create JWT token
        access_token = create_access_token(identity=user.id)

        return jsonify({
            "message": "Login successful",
            "user": user.to_dict(),
            "access_token": access_token
        }), 200

    except Exception as e:
        return jsonify({"error": f"Login failed: {str(e)}"}), 500


@auth_bp.route("/profile", methods=["GET"])
def get_profile():
    """
    Get current user profile (requires JWT token)
    Headers:
    Authorization: Bearer <access_token>
    """
    from flask_jwt_extended import jwt_required, get_jwt_identity

    try:
        @jwt_required()
        def profile_handler():
            user_id = get_jwt_identity()
            user = User.query.get(user_id)

            if not user:
                return jsonify({"error": "User not found"}), 404

            return jsonify({
                "user": user.to_dict()
            }), 200

        return profile_handler()

    except Exception as e:
        return jsonify({"error": f"Failed to get profile: {str(e)}"}), 500
