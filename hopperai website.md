# HopperAI - Advanced AI Assistant

A professional AI chatbot with code generation and image creation capabilities.

## Features

- 💻 Complete Code Solutions
- 🎨 AI Image Generation
- 🚀 Real-time Responses
- 📱 Responsive Design
- 🎯 Smart Context Understanding

## Tech Stack

### Frontend
- React + Vite
- Material-UI
- Axios
- React Markdown

### Backend
- FastAPI
- OpenRouter API
- Python-dotenv
- HTTPX

## Deployment

### Prerequisites
- Node.js and npm
- Python 3.8+
- Git

### Local Development
1. Clone the repository:
```bash
git clone https://github.com/yourusername/hopper-ai.git
cd hopper-ai
```

2. Backend Setup:
```bash
cd backend
pip install -r requirements.txt
# Create .env file with your OPENROUTER_API_KEY
uvicorn main:app --reload
```

3. Frontend Setup:
```bash
cd frontend
npm install
# Create .env with VITE_API_URL
npm run dev
```

### Production Deployment

#### Backend (Railway)
1. Connect GitHub repository
2. Set environment variables:
   - OPENROUTER_API_KEY
   - PORT
3. Deploy using Procfile

#### Frontend (Vercel)
1. Import from GitHub
2. Configure build settings:
   - Framework: Vite
   - Root Directory: frontend
   - Build Command: npm run build
   - Output Directory: dist
3. Add environment variables
4. Deploy

## Live Demo
Visit: [https://hopperai.vercel.app](https://hopperai.vercel.app)

## License
MIT License
