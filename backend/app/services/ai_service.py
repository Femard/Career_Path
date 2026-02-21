import anthropic
import httpx
import json
import logging
import os
import time
from typing import List
from app.schemas import CareerEventCreate, CareerPath, MarketInsight

# --- Logger ---
logger = logging.getLogger("career_path.ai")

# --- Provider configuration ---
AI_PROVIDER = os.getenv("AI_PROVIDER", "claude").lower()  # "claude" or "ollama"

# Claude
CLAUDE_MODEL = "claude-sonnet-4-6"
_anthropic = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY", ""))

# Ollama — qwen2.5:7b : excellent pour JSON structuré et le français
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "qwen2.5:7b")


def get_ai_info() -> dict:
    if AI_PROVIDER == "ollama":
        return {"provider": "ollama", "model": OLLAMA_MODEL, "base_url": OLLAMA_BASE_URL}
    return {"provider": "claude", "model": CLAUDE_MODEL}


def _call_ai(prompt: str, task: str = "generation") -> str:
    """Route the prompt to the configured AI provider, log everything, return raw text."""
    provider_label = f"Ollama ({OLLAMA_MODEL})" if AI_PROVIDER == "ollama" else f"Claude ({CLAUDE_MODEL})"

    logger.info("=" * 60)
    logger.info(f"[{task.upper()}] → {provider_label}")
    logger.info(f"PROMPT ({len(prompt)} chars) :\n{prompt}")
    logger.info("-" * 60)

    t0 = time.perf_counter()
    try:
        raw = _call_ollama(prompt) if AI_PROVIDER == "ollama" else _call_claude(prompt)
    except Exception as e:
        logger.error(f"ERREUR appel {provider_label} : {e}")
        raise

    elapsed = time.perf_counter() - t0
    logger.info(f"RÉPONSE BRUTE ({elapsed:.1f}s) :\n{raw}")
    logger.info("=" * 60)
    return raw


def _call_claude(prompt: str) -> str:
    msg = _anthropic.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}],
    )
    return msg.content[0].text.strip()


def _call_ollama(prompt: str) -> str:
    with httpx.Client(timeout=180.0) as client:
        resp = client.post(
            f"{OLLAMA_BASE_URL}/api/chat",
            json={
                "model": OLLAMA_MODEL,
                "messages": [{"role": "user", "content": prompt}],
                "stream": False,
                "options": {
                    "temperature": 0.2,
                    "num_predict": 2048,
                },
            },
        )
        resp.raise_for_status()
        return resp.json()["message"]["content"].strip()


def _parse_json_response(raw: str, task: str = "") -> dict:
    """Strip markdown code fences and parse JSON, with logging."""
    text = raw.strip()
    if text.startswith("```"):
        parts = text.split("```")
        text = parts[1] if len(parts) > 1 else parts[0]
        if text.startswith("json"):
            text = text[4:]
        text = text.strip()
    # Skip any preamble before the first {
    start = text.find("{")
    if start > 0:
        logger.warning(f"[{task}] Texte avant le JSON ignoré : {repr(text[:start])}")
        text = text[start:]
    try:
        data = json.loads(text)
        logger.info(f"[{task}] JSON parsé avec succès — {len(data)} clés : {list(data.keys())}")
        return data
    except json.JSONDecodeError as e:
        logger.error(f"[{task}] Échec parsing JSON : {e}\nTexte reçu :\n{text}")
        raise ValueError(f"Réponse non-JSON du modèle : {e}") from e


# --- Shared prompt helpers ---

def _career_history_text(events: List[CareerEventCreate]) -> str:
    if not events:
        return "Pas d'historique de carrière renseigné."
    lines = []
    for e in sorted(events, key=lambda x: x.startYear):
        end = "maintenant" if e.isCurrent else (str(e.endYear) if e.endYear else str(e.startYear))
        inst = f" ({e.institution})" if e.institution else ""
        lines.append(f"- {e.startYear}–{end} : {e.title}{inst} [{e.type}]")
    return "\n".join(lines)


# --- Public functions ---

async def generate_career_path(
    career_history: List[CareerEventCreate],
    objective_title: str,
    location: str,
) -> CareerPath:
    history_text = _career_history_text(career_history)
    current_year = 2026
    task = f"path:{objective_title}@{location}"

    prompt = f"""Tu es un conseiller en évolution professionnelle expert du marché du travail français.

Parcours actuel de l'utilisateur :
{history_text}

Objectif : devenir **{objective_title}** à **{location}**

Génère un plan de carrière réaliste et détaillé pour atteindre cet objectif depuis la situation actuelle.
Le plan doit inclure les étapes intermédiaires (emplois et formations) avec des données chiffrées réalistes pour le marché français en {current_year}.

Réponds UNIQUEMENT avec un objet JSON valide ayant cette structure exacte (sans markdown, sans explication) :
{{
  "steps": [
    {{
      "type": "job",
      "title": "Titre du poste",
      "duration_months": 24,
      "salary_min": 38000,
      "salary_max": 48000,
      "year_estimate": 2026,
      "description": "Description courte du rôle"
    }},
    {{
      "type": "formation",
      "title": "Titre de la formation",
      "provider": "Nom de l'organisme",
      "duration_months": 6,
      "cost": 3000,
      "year_estimate": 2027,
      "description": "Ce que la formation apporte"
    }}
  ],
  "market_insights": "Analyse concise du marché pour cet objectif : tendances, demande, perspectives d'évolution en {location}.",
  "confidence_score": 0.82
}}

Règles :
- 3 à 6 étapes maximum
- Les salaires doivent être réalistes pour {location} et le secteur concerné
- La dernière étape doit être le poste objectif ({objective_title})
- confidence_score entre 0.5 et 0.95 selon la faisabilité
- Réponds UNIQUEMENT en JSON, rien d'autre"""

    raw = _call_ai(prompt, task=task)
    data = _parse_json_response(raw, task=task)
    return CareerPath(**data)


async def generate_market_insights(
    career_history: List[CareerEventCreate],
    objectives: List[dict],
) -> MarketInsight:
    history_text = _career_history_text(career_history)
    objectives_text = (
        ", ".join(f"{o.get('title', '')} ({o.get('location', 'France')})" for o in objectives)
        if objectives
        else "non définis"
    )
    task = "market_insights"

    prompt = f"""Tu es un analyste du marché du travail français expert en tendances d'emploi et de formation.

Parcours de l'utilisateur :
{history_text}

Objectifs visés : {objectives_text}

Fournis une analyse de marché actualisée (2025-2026) avec des données réalistes.

Réponds UNIQUEMENT avec un objet JSON valide ayant cette structure exacte (sans markdown) :
{{
  "topJobs": [
    {{"title": "Intitulé de poste", "demand": "Description courte de la demande", "growth": "+12%"}},
    {{"title": "...", "demand": "...", "growth": "..."}}
  ],
  "salaryByCity": [
    {{"city": "Paris", "min": 45000, "avg": 58000, "max": 80000}},
    {{"city": "Lyon", "min": 40000, "avg": 50000, "max": 70000}},
    {{"city": "Bordeaux", "min": 38000, "avg": 47000, "max": 65000}}
  ],
  "trendingFormations": [
    {{"title": "Nom de la formation", "provider": "Organisme", "relevance": "Pourquoi c'est pertinent"}},
    {{"title": "...", "provider": "...", "relevance": "..."}}
  ],
  "summary": "Synthèse en 2-3 phrases des tendances du marché, des opportunités et des conseils pour l'utilisateur."
}}

Règles :
- 4 à 6 métiers en demande pertinents au profil et aux objectifs
- 3 à 5 villes avec des salaires réalistes pour le domaine concerné
- 3 à 5 formations actuelles et reconnues en France
- Données basées sur le marché français 2025-2026
- Réponds UNIQUEMENT en JSON"""

    raw = _call_ai(prompt, task=task)
    data = _parse_json_response(raw, task=task)
    return MarketInsight(**data)
