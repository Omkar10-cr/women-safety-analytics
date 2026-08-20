from datetime import datetime, timezone

from extensions import db


class Location(db.Model):
    __tablename__ = "locations"

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

    accuracy = db.Column(
        db.Float,
        nullable=True
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
            "accuracy": self.accuracy,
            "timestamp": (
                self.created_at.isoformat()
                if self.created_at
                else None
            )
        }