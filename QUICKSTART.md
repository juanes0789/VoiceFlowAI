# Quick Start (ES/EN)

## Espanol

1) Configura backend

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

2) Configura frontend (otra terminal)

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Abre `http://localhost:3000`.

Docker (opcional):

```bash
cp backend/.env.example backend/.env
cp .env.docker.example .env.docker
docker compose --env-file .env.docker up --build
```

## English

1) Set up backend

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

2) Set up frontend (new terminal)

```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`.

Docker (optional):

```bash
cp backend/.env.example backend/.env
cp .env.docker.example .env.docker
docker compose --env-file .env.docker up --build
```

