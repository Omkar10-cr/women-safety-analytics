from datetime import datetime, timezone

from extensions import db


class SafetyReport(db.Model):
    __tablename__ = "safety_reports"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    latitude = db.Column(
        db.Float,
        nullable=False
    )

    longitude = db.Column(
        db.Float,
        nullable=False
    )

    incident_type = db.Column(
        db.String(100),
        nullable=False
    )

    severity = db.Column(
        db.Integer,
        nullable=False,
        default=1
    )

    description = db.Column(
        db.Text,
        nullable=True
    )

    verified = db.Column(
        db.Boolean,
        default=False,
        nullable=False
    )

    source = db.Column(
        db.String(50),
        nullable=False,
        default="user"
    )

    reported_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    def to_dict(self):
        return {
            "id": self.id,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "incident_type": self.incident_type,
            "severity": self.severity,
            "description": self.description,
            "verified": self.verified,
            "source": self.source,
            "reported_at": (
                self.reported_at.isoformat()
                if self.reported_at
                else None
            ),
            "created_at": (
                self.created_at.isoformat()
                if self.created_at
                else None
            )
        }