from sqlalchemy.orm import Session
from models import CaptionHistory


def save_caption(
    db: Session,
    image_name: str,
    caption: str,
    style: str,
    raw_description: str
):
    new_caption = CaptionHistory(
        image_name=image_name,
        caption=caption,
        style=style,
        raw_description=raw_description
    )

    db.add(new_caption)
    db.commit()
    db.refresh(new_caption)

    return new_caption

def get_all_captions(db: Session):
    return db.query(CaptionHistory).order_by(CaptionHistory.created_at.desc()).all()