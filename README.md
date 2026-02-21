# Career Path — Visualisateur de Carrière

Outil graphique de visualisation et planification de carrière avec IA.

## Démarrage rapide

### 1. Backend (FastAPI + Python)

```bash
cd backend
cp .env.example .env
# Éditez .env et ajoutez votre clé ANTHROPIC_API_KEY

# Créer l'environnement virtuel (si pas fait)
python -m venv venv
./venv/Scripts/activate  # Windows
# ou: source venv/bin/activate  # Mac/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload
```

Le backend démarre sur `http://localhost:8000`
Documentation API : `http://localhost:8000/docs`

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

L'app s'ouvre sur `http://localhost:3000`

## Variables d'environnement

**backend/.env** :
```
ANTHROPIC_API_KEY=sk-ant-...   # Obligatoire pour l'IA
DATABASE_URL=sqlite:///./career_path.db
CORS_ORIGINS=http://localhost:3000
```

**frontend/.env.local** (déjà créé) :
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Fonctionnalités

- **Frise chronologique** : Route sinueuse animée SVG avec vos événements de carrière
- **Objectifs IA** : Claude génère un chemin détaillé (emplois, formations, salaires)
- **Chemins multiples** : Jusqu'à 5 objectifs simultanés en couleurs distinctes
- **Analyse marché** : Tendances, salaires par ville, formations recommandées

## Stack

- **Frontend** : Next.js 14 + TypeScript + Tailwind CSS + Framer Motion + Recharts + Zustand
- **Backend** : FastAPI + Python + SQLAlchemy + SQLite
- **IA** : Anthropic Claude API (claude-sonnet-4-6)
