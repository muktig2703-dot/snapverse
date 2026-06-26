from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from database import Base


class CaptionHistory(Base):
    __tablename__ = "caption_history"

    id = Column(Integer, primary_key=True, index=True)

    image_name = Column(String)

    caption = Column(String)

    style = Column(String)

    raw_description = Column(String)

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