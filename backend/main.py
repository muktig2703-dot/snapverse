import os
from dotenv import load_dotenv
load_dotenv()

from openai import OpenAI
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import base64

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

def encode_image(image_bytes):
    return base64.b64encode(image_bytes).decode("utf-8")

@app.post("/generate-caption")
async def generate_caption(file: UploadFile = File(...), style: str = "aesthetic"):

    text = f"""
You are Snapverse, an elite Instagram caption generator.

Generate a {style} Instagram caption.

RULES:
- Keep captions short (1–2 lines max)
- Make it engaging and scroll-stopping
- Use emojis naturally
- Sound like a Gen-Z creator
- Do NOT describe the image directly
- Do NOT explain your answer

STYLE GUIDE:
- aesthetic → poetic, soft, emotional 🌸
- funny → humorous, witty 😂
- savage → bold, confident 🔥
- poetic → deep, expressive 🌙
- minimal → short, clean ✨

OUTPUT:
Only return the caption.
"""
    image_bytes = await file.read()
    base64_image = encode_image(image_bytes)

    response = client.chat.completions.create(
    model="openai/gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": text
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}"
                    }
                }
            ]
        }
    ]
)

    caption = response.choices[0].message.content

    return {"caption": caption,
            "style": style}