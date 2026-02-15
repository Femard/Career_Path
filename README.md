# Dynamic Career Pathing SaaS

A graph-based career navigation system that generates dynamic professional "Critical Paths" (Plans A, B, C) using skills ontologies and real-time market data.

## Architecture

### Backend (Python/FastAPI)
- **Ingestion Service**: API integrations for market data, salaries, and LMS platforms
- **Pathfinding Engine**: Multi-objective optimization for career trajectory planning
- **Neo4j Database**: Graph database for skills ontologies and career relationships

### Frontend (Next.js/React)
- **React Flow**: Interactive skill tree visualization
- **D3.js**: Market analysis charts and trends
- **Butterfly Framework**: Expandable career path cards

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- Neo4j 5.x (running locally or via Docker)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Career_Path
```

2. **Setup Backend**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp ../.env.example .env
# Edit .env with your Neo4j credentials and API keys
```

3. **Setup Database**

#### Option A: Using Docker Compose (Recommended)

```bash
# Start Neo4j with Docker Compose
docker-compose up -d

# Check logs
docker-compose logs -f neo4j
```

#### Option B: Using Docker directly

For Windows PowerShell/CMD:

```powershell
docker run -d --name neo4j -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/password123 neo4j:5.16.0
```

For Linux/Mac (bash):

```bash
docker run -d \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password123 \
  neo4j:5.16.0
```

#### Initialize Schema

```bash
# Open Neo4j Browser at http://localhost:7474
# Run the Cypher script from database/schema/init_schema.cypher
```

4. **Setup Frontend**
```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
```

### Running the Application

1. **Start Backend API**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python -m app.main

# Or using uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: http://localhost:8000
API docs (Swagger): http://localhost:8000/docs

2. **Start Frontend**
```bash
cd frontend
npm run dev
```

The frontend will be available at: http://localhost:3000

## Development

### Backend Development

```bash
# Run tests
cd backend
pytest

# Run with auto-reload
uvicorn app.main:app --reload
```

### Frontend Development

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

### Database Queries

Access Neo4j Browser at http://localhost:7474 to run Cypher queries.

Example queries are in `database/schema/init_schema.cypher`.

## Project Structure

```
Career_Path/
├── backend/               # Python FastAPI backend
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── core/         # Core utilities (config, Neo4j)
│   │   ├── models/       # Pydantic models
│   │   └── services/     # Business logic
│   │       ├── ingestion/      # API integrations
│   │       ├── pathfinding/    # Career path algorithms
│   │       └── skills_extraction/  # NLP for skill extraction
│   └── requirements.txt
├── frontend/             # Next.js React frontend
│   ├── app/             # Next.js app router
│   ├── components/      # React components
│   └── lib/            # Utilities and API client
├── database/
│   └── schema/         # Neo4j schema and Cypher scripts
└── docs/               # Additional documentation
```

## Features

### Core Features
- ✅ Multi-objective career pathfinding (Plans A, B, C)
- ✅ Skills ontology (ESCO/O*NET integration)
- ✅ Interactive skill tree visualization
- ✅ Market data integration framework
- 🚧 Skills extraction from CVs/job descriptions (Domain-BERT)
- 🚧 Drift analysis for market changes
- 🚧 Real-time salary and demand data

### External Integrations
- TheirStack (Job postings)
- Coresignal (Company analytics)
- Numbeo (Cost of living)
- Levels.fyi (Salary data)
- LinkedIn Learning (Courses)
- Coursera (Certifications)

*Note: API integrations require valid API keys in `.env` file*

## API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## License

[Your License Here]

## Contributing

[Contributing Guidelines]
