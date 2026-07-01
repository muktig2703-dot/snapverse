from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from sqlalchemy import ForeignKey
from database import Base


class CaptionHistory(Base):
    __tablename__ = "caption_history"

    id = Column(Integer, primary_key=True, index=True)

    image_name = Column(String)

    image_url = Column(String)

    caption = Column(String)

    style = Column(String)

    raw_description = Column(String)
    user_id = Column(
    Integer,
    ForeignKey("users.id")
)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)