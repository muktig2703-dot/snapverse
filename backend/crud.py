from sqlalchemy.orm import Session
from models import CaptionHistory


def save_caption(
    db: Session,
    image_name: str,
    caption: str,
    style: str,
    raw_description: str,
    user_id: int
):
    new_caption = CaptionHistory(
    image_name=image_name,
    caption=caption,
    style=style,
    raw_description=raw_description,
    user_id=user_id
)

    db.add(new_caption)
    db.commit()
    db.refresh(new_caption)

    return new_caption

def get_user_captions(
    db: Session,
    user_id: int
):
    return (
        db.query(CaptionHistory)
        .filter(CaptionHistory.user_id == user_id)
        .order_by(CaptionHistory.created_at.desc())
        .all()
    )

def delete_caption(
    db: Session,
    caption_id: int,
    user_id: int
):
    caption = (
        db.query(CaptionHistory)
        .filter(
            CaptionHistory.id == caption_id,
            CaptionHistory.user_id == user_id
        )
        .first()
    )

    if not caption:
        return None

    db.delete(caption)
    db.commit()

    return True