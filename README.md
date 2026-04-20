# VoiceBot Pro — AI Voice English Tutor / Tutor de ingles con voz

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen)](./LICENSE)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](./docker-compose.yml)
[![Deploy: Render](https://img.shields.io/badge/Deploy-Render-46E3B7?logo=render&logoColor=black)](./render.yaml)
[![Version](https://img.shields.io/badge/version-1.0.0-7c6af7)](./frontend/package.json)

Practice English naturally with voice conversations.  
Practica ingles de forma natural con conversaciones por voz.

---

## Espanol

### Que puedes hacer

- Hablar en ingles con microfono
- Ver tu transcripcion antes de enviar
- Escuchar la respuesta de la IA con voz
- Elegir acento (US / UK / AU)
- Practicar en varios modos (casual, entrevista, viajes, tech, diario)

### Requisitos

- Node.js 18+
- Python 3.11+
- API key de OpenRouter

### Inicio rapido local

1) Backend:

```bash
cd backend
cp .env.example .env
```

Edita `backend/.env`:

```env
OPENROUTER_API_KEY=tu_api_key_real
```

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

2) Frontend (otra terminal):

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Abre: `http://localhost:3000`

### Docker (recomendado para demo)

```bash
cp backend/.env.example backend/.env
cp .env.docker.example .env.docker
docker compose --env-file .env.docker up --build
```

App: `http://localhost:3000`  
Health backend: `http://localhost:8000/health`

Detener:

```bash
docker compose --env-file .env.docker down
```

### Problemas comunes

- `Backend not connected`: revisa backend en `:8000` y `OPENROUTER_API_KEY` en `backend/.env`
- Microfono no funciona: habilita permisos de microfono y prueba Chrome/Edge
- IA no responde: revisa API key y conexion a internet

---

## English

### What you can do

- Speak in English using your microphone
- Review transcript before sending
- Listen to AI voice replies
- Pick accent (US / UK / AU)
- Practice with multiple modes (casual, interview, travel, tech, daily)

### Requirements

- Node.js 18+
- Python 3.11+
- OpenRouter API key

### Local quick start

1) Backend:

```bash
cd backend
cp .env.example .env
```

Update `backend/.env`:

```env
OPENROUTER_API_KEY=your_real_api_key
```

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

2) Frontend (new terminal):

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Open: `http://localhost:3000`

### Docker (recommended for demos)

```bash
cp backend/.env.example backend/.env
cp .env.docker.example .env.docker
docker compose --env-file .env.docker up --build
```

App: `http://localhost:3000`  
Backend health: `http://localhost:8000/health`

Stop:

```bash
docker compose --env-file .env.docker down
```

### Common issues

- `Backend not connected`: ensure backend is running on `:8000` and key is set in `backend/.env`
- Microphone not working: allow mic permissions and try Chrome/Edge
- AI not replying: verify API key and internet connection

---

## Security / Seguridad

- Never commit real API keys
- Keep real secrets only in local env files (`backend/.env`)
- Commit only template files like `.env.example`

## License / Licencia

This project is licensed under the **MIT License**.

Este proyecto esta licenciado bajo la **Licencia MIT**.

- Full license text: `LICENSE`
- You can use, modify, and distribute this project with attribution.

---

### Third-party licenses / Licencias de terceros

- Frontend dependencies follow their own licenses (NPM packages).
- Backend dependencies follow their own licenses (PyPI packages).
- Check package metadata before commercial redistribution.
