import os
import base64
from dotenv import load_dotenv
from database import Base, engine
from models import CaptionHistory, User
Base.metadata.create_all(bind=engine)
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from fastapi import Depends
from fastapi import Form
from sqlalchemy.orm import Session
from database import get_db
from crud import (
    save_caption,
    get_user_captions,
    delete_caption
)
from auth import create_access_token
from security import hash_password, verify_password
from pydantic import BaseModel
from dependencies import get_current_user

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class ChangeUsername(BaseModel):
    new_username: str

class ChangePassword(BaseModel):
    current_password: str
    new_password: str
# Load environment variables
load_dotenv()
# ----------------------------
# FastAPI App
# ----------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# OpenRouter Client
# ----------------------------
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)
# ----------------------------
# Helper Function
# Convert image to Base64
# ----------------------------
def encode_image(image_bytes):
    return base64.b64encode(image_bytes).decode("utf-8")


# ----------------------------
# AI Call #1
# Generate Raw Description
# ----------------------------
from google.genai import types

def generate_image_description(base64_image, mime_type):

    image_bytes = base64.b64decode(base64_image)

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[
            "Describe this image objectively.\n\n"
            "Rules:\n"
            "- Mention important objects\n"
            "- Mention people if present\n"
            "- Mention surroundings\n"
            "- Mention actions\n"
            "- No emojis\n"
            "- No Instagram captions\n"
            "- Maximum 60 words",

            types.Part.from_bytes(
                data=image_bytes,
                mime_type=mime_type,
            ),
        ],
    )

    return response.text
# ----------------------------
# AI Call #2
# Generate Instagram Caption
# ----------------------------
def generate_instagram_caption(
    raw_description,
    style,
    emoji_intensity,
    caption_length
):

    prompt = f"""
You are Snapverse, an elite Instagram caption generator.

Image Description:
{raw_description}

Generate THREE different {style} Instagram captions.

Each caption should include:

- A caption
- 8-12 relevant hashtags
- Emoji Intensity:
{emoji_intensity}
- Caption Length:
{caption_length}
Rules:
- Each caption must be different.
- Each caption should match the {style} style.
- Separate every caption with:

Emoji Rules:

- none → Do not use emojis.
- low → Use 1-2 emojis.
- medium → Use 3-5 emojis.
- high → Use lots of emojis naturally.

Caption Length Rules:

- short → One short sentence.
- medium → Two to three engaging sentences.
- long → Four to six engaging sentences with storytelling.
---

Output Example:

Caption 1

#hashtags

---

Caption 2

#hashtags

---

Caption 3

#hashtags
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return response.text
# ----------------------------
# API Endpoint
# ----------------------------
@app.post("/generate-caption")
async def generate_caption(
    file: UploadFile = File(...),
    style: str = Form("aesthetic"),
    emoji_intensity: str = Form("medium"),
    caption_length: str = Form("medium"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # Read uploaded image
    image_bytes = await file.read()
    mime_type = file.content_type
    # Convert image to Base64
    base64_image = encode_image(image_bytes) 
    # Step 1: Generate image description
    raw_description = generate_image_description(base64_image, mime_type)

    # Step 2: Generate Instagram caption
    caption = generate_instagram_caption(
        raw_description,
        style,
        emoji_intensity,
        caption_length
    )

    save_caption(
    db=db,
    image_name=file.filename,
    caption=caption,
    style=style,
    raw_description=raw_description,
    user_id=current_user.id
)

    # Return response
    return {
        "caption": caption,
        "style": style,
        "raw_description": raw_description
    }

@app.get("/history")
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    history = get_user_captions(
        db,
        current_user.id
    )

    return history

@app.delete("/history/{caption_id}")
def delete_history(
    caption_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    deleted = delete_caption(
        db,
        caption_id,
        current_user.id
    )

    if not deleted:
        return {
            "error": "Caption not found"
        }

    return {
        "message": "Caption deleted successfully"
    }

@app.post("/signup")
def signup(user: UserCreate, db: Session = Depends(get_db)):

    # Check if username already exists
    existing_user = db.query(User).filter(User.username == user.username).first()

    if existing_user:
        return {"error": "Username already exists"}

    # Hash the password
    hashed_password = hash_password(user.password)

    # Create new user
    new_user = User(
        username=user.username,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully"
    }

@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    # Find user
    existing_user = (
        db.query(User)
        .filter(User.username == user.username)
        .first()
    )

    # User not found
    if not existing_user:
        return {"error": "Invalid username or password"}

    # Verify password
    if not verify_password(user.password, existing_user.password):
        return {"error": "Invalid username or password"}

    # Generate JWT token
    token = create_access_token(
        data={
            "sub": existing_user.username
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@app.put("/change-username")
def change_username(
    data: ChangeUsername,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    existing = (
        db.query(User)
        .filter(User.username == data.new_username)
        .first()
    )

    if existing:
        return {
            "error": "Username already exists"
        }

    current_user.username = data.new_username

    db.commit()

    return {
        "message": "Username updated successfully"
    }

@app.put("/change-password")
def change_password(
    data: ChangePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if not verify_password(
        data.current_password,
        current_user.password
    ):
        return {
            "error": "Current password is incorrect"
        }

    current_user.password = hash_password(
        data.new_password
    )

    db.commit()

    return {
        "message": "Password updated successfully"
    }