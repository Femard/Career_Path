# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Dynamic Career Pathing SaaS - A graph-based career navigation system that generates dynamic professional "Critical Paths" (Plans A, B, C) using skills ontologies and real-time market data. The platform transitions from linear career models to dynamic trajectories with predictive drift analysis.

## Architecture

### Core Stack
- **Backend**: Python with FastAPI (Ingestion Service)
- **Database**: Neo4j (Graph Database) with Cypher queries for pathfinding
- **Frontend**: Next.js with React Flow (skill trees/pathways) and D3.js (market analysis)
- **Styling**: Tailwind CSS and Shadcn/ui

### Service Architecture
The system follows a multi-service architecture:
1. **Ingestion Service** (FastAPI): Handles API integrations for market data, salaries, and LMS platforms
2. **Pathfinding Engine**: Multi-objective optimization using Dijkstra/A* with Artificial Bee Colony algorithms
3. **Skills Extraction**: Domain-BERT model for CV/job description parsing
4. **Frontend**: React Flow for interactive skill tree visualization

## Data Model (Neo4j)

### Node Types
- `Profession`: Job roles and career positions
- `Skill`: Technical and soft skills from ESCO/O*NET ontologies
- `Training`: Courses, certifications, learning paths
- `User`: User profiles and career trajectories
- **Intermediate Nodes**: Career events linking users, companies, and roles

### Relationships
Use intermediate nodes to model career transitions and skill acquisitions. Edges should include weights for:
- Salary differential
- Training cost
- Time to acquire
- Automation risk

## Key Algorithms

### Pathfinding Logic
Multi-objective optimization calculates trajectory costs based on:
- Salary potential
- Training investment
- Automation risk
- Time to transition

Implement "Path Traversal Pruning" to filter by:
- Maximum time horizon
- Budget constraints
- Risk tolerance

### Drift Analysis
Monitor market shifts that impact Plan A/B ROI and trigger proactive alerts when:
- Job demand decreases
- Skill value changes
- Automation risk increases

## External Integrations

### Market Data Providers
- **TheirStack**: Job postings and ATS data
- **Coresignal**: Company and role analytics

### Salary & Economics
- **Numbeo**: Cost of living data
- **Levels.fyi**: Compensation benchmarks

### Learning Management Systems
- **LinkedIn Learning**: Course catalog and completion data
- **Coursera**: Training programs and certifications

## Ontology Standards

### ESCO (European Skills, Competences, Qualifications and Occupations)
Used for EU market skill mapping and profession taxonomies.

### O*NET (Occupational Information Network)
Used for USA market standardization and skill requirements.

Map between both ontologies to enable cross-market pathfinding.

## Frontend Components

### React Flow Workspace
- **Skill Tree Visualization**: Nodes "unlock" new career targets based on acquired skills
- Interactive navigation through career pathways
- Visual representation of Plans A, B, C

### Butterfly Framework UI
Expandable trajectory cards that show:
- Current position (center)
- Alternative paths (wings)
- Skill gaps and training requirements

### D3.js Visualizations
Market trend analysis, salary distributions, and demand forecasting.

## Ethical Considerations

### Anonymization
Ensure skill models are anonymized to prevent demographic bias in recommendations.

### Transparency
Career path recommendations must be explainable - users should understand why specific paths are suggested.

## Development Commands

### Backend (FastAPI)
```bash
cd backend

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server with auto-reload
python -m app.main
# Or using uvicorn directly:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest

# Run specific test file
pytest tests/test_pathfinding.py -v
```

### Frontend (Next.js)
```bash
cd frontend

# Install dependencies (first time only)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Database (Neo4j)
```bash
# Start Neo4j via Docker
docker run -d \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/your-password \
  neo4j:5.16.0

# Initialize schema (run Cypher script in Neo4j Browser)
# Visit http://localhost:7474
# Copy/paste contents of database/schema/init_schema.cypher

# Or using cypher-shell CLI
cat database/schema/init_schema.cypher | cypher-shell -u neo4j -p your-password
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# Required: NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD
# Optional: API keys for external integrations
```

### Full Stack Development
```bash
# Terminal 1: Neo4j (if not using Docker)
neo4j console

# Terminal 2: Backend
cd backend && source venv/bin/activate && python -m app.main

# Terminal 3: Frontend
cd frontend && npm run dev
```

Access points:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- Neo4j Browser: http://localhost:7474

## Neo4j Connection

Use environment variables for database credentials:
- `NEO4J_URI`: Database connection string
- `NEO4J_USER`: Database username
- `NEO4J_PASSWORD`: Database password

Always use parameterized Cypher queries to prevent injection attacks.

## Critical Path Generation

When implementing pathfinding:
1. Start from user's current skill set
2. Query Neo4j for possible trajectories to target profession
3. Apply multi-objective cost function
4. Rank paths by ROI (salary gain / (training cost + time))
5. Return top 3 paths as Plans A, B, C
