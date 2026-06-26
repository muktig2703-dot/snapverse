import os
import base64
from dotenv import load_dotenv
from database import Base, engine
from models import CaptionHistory, User
Base.metadata.create_all(bind=engine)
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from fastapi import Depends
from sqlalchemy.orm import Session
from database import get_db
from crud import save_caption, get_all_captions
from auth import create_access_token
from security import hash_password, verify_password
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str
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
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
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
def generate_image_description(base64_image, mime_type):

    response = client.chat.completions.create(
        model="openai/gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": """
Describe this image objectively.

Rules:
- Mention important objects
- Mention people if present
- Mention surroundings
- Mention actions
- No emojis
- No Instagram captions
- Maximum 60 words
"""
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{mime_type};base64,{base64_image}"
                        }
                    }
                ]
            }
        ]
    )

    return response.choices[0].message.content


# ----------------------------
# AI Call #2
# Generate Instagram Caption
# ----------------------------
def generate_instagram_caption(raw_description, style):

    prompt = f"""
You are Snapverse, an elite Instagram caption generator.

Image Description:
{raw_description}

Generate a {style} Instagram caption.

RULES:
- Keep captions short (1–2 lines max)
- Make it engaging and scroll-stopping
- Use emojis naturally
- Sound like a Gen-Z creator
- Do NOT simply repeat the description
- Do NOT explain your answer

STYLE GUIDE:
- aesthetic → poetic 🌸
- funny → witty 😂
- savage → bold 🔥
- poetic → emotional 🌙
- minimal → clean ✨

OUTPUT:
Only return the caption.
"""

    response = client.chat.completions.create(
        model="openai/gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response.choices[0].message.content


# ----------------------------
# API Endpoint
# ----------------------------
@app.post("/generate-caption")
async def generate_caption(
    file: UploadFile = File(...),
    style: str = "aesthetic",
    db: Session = Depends(get_db)
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
        style
    )

    save_caption(
    db=db,
    image_name=file.filename,
    caption=caption,
    style=style,
    raw_description=raw_description
)

    # Return response
    return {
        "caption": caption,
        "style": style,
        "raw_description": raw_description
    }

@app.get("/history")
def get_history(db: Session = Depends(get_db)):

    history = get_all_captions(db)

    return history

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