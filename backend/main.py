from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
from dotenv import load_dotenv
import os
import json

load_dotenv()

app = FastAPI(title="HopperAI Chat Platform")

# CORS middleware to allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenRouter API configuration
OPENROUTER_API_KEY = os.getenv("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")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

class ChatMessage(BaseModel):
    content: str

class ImagePrompt(BaseModel):
    prompt: str

@app.get("/")
async def root():
    return {
        "name": "HopperAI",
        "version": "1.0.0",
        "description": "Welcome to HopperAI - Your Advanced AI Assistant",
        "features": [
            "Natural Language Chat with OpenRouter AI",
            "Image Generation with DALL-E",
            "Real-time Responses",
            "Modern UI/UX"
        ],
        "status": "operational"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "HopperAI is running smoothly"}

@app.post("/chat")
async def chat(message: ChatMessage):
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{OPENROUTER_BASE_URL}/chat/completions",
                headers={
                    "Authorization": f"Bearer {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}",
                    "HTTP-Referer": "http://localhost:5173",  # Your frontend URL
                    "Content-Type": "application/json"
                },
                json={
                    "model": "anthropic/claude-2",  # You can change this to any model supported by OpenRouter
                    "messages": [
                        {
                            "role": "system",
                            "content": """You are HopperAI, a helpful AI coding assistant that provides complete code solutions and examples.

When asked for code:
1. Provide complete, working code solutions
2. Include all necessary imports and dependencies
3. Add helpful comments explaining the code
4. Include example usage where appropriate
5. Provide setup instructions if needed

For project requests:
- Generate full project structure
- Create all necessary files
- Include configuration files
- Add README with setup instructions
- Provide complete working code

For feature requests:
- Provide complete implementation
- Include all required code changes
- Add necessary dependencies
- Show integration examples

Always:
- Write production-ready code
- Follow best practices
- Include error handling
- Add appropriate documentation
- Make code reusable and maintainable"""
                        },
                        {
                            "role": "user",
                            "content": message.content
                        }
                    ]
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                return {"response": result["choices"][0]["message"]["content"]}
            else:
                raise HTTPException(status_code=response.status_code, detail="Error from OpenRouter API")
                
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-image")
async def generate_image(prompt: ImagePrompt):
    try:
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "HopperAI"
        }

        payload = {
            "model": "stabilityai/stable-diffusion-xl",  # OpenRouter's image generation model
            "prompt": prompt.prompt,
            "n": 1,
            "size": "1024x1024"
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{OPENROUTER_BASE_URL}/images/generations",
                headers=headers,
                json=payload,
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail=response.text)
            
            response_data = response.json()
            return {"image_url": response_data["data"][0]["url"]}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
