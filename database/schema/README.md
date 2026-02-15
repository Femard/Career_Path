# Neo4j Schema

This directory contains the graph database schema definition for the Dynamic Career Pathing SaaS.

## Initialization

To initialize the Neo4j database schema, run the Cypher script:

```bash
# Using Neo4j Browser (http://localhost:7474)
# Copy and paste the contents of init_schema.cypher

# Or using cypher-shell CLI
cat init_schema.cypher | cypher-shell -u neo4j -p your-password
```

## Graph Structure

### Node Types

1. **Profession**: Job roles and career positions
   - Properties: id, title, description, ontology_source, esco_id, onet_id, avg_salary, market_demand, automation_risk

2. **Skill**: Technical and soft skills
   - Properties: id, name, description, category, ontology_source, esco_id, onet_id, automation_risk, market_demand

3. **Training**: Courses and certifications
   - Properties: id, title, provider, duration_hours, cost, difficulty_level

4. **User**: User profiles
   - Properties: id, email, current_profession, location, experience_years

5. **Company**: Organizations
   - Properties: id, name, industry, size

6. **CareerEvent**: Intermediate nodes for career transitions
   - Properties: id, user_id, company_id, profession_id, start_date, end_date, salary

### Relationships

- `REQUIRES`: Profession → Skill (required skills for a profession)
- `TEACHES`: Training → Skill (skills taught by a training)
- `HAS_SKILL`: User → Skill (skills possessed by a user)
- `TRANSITIONS_TO`: Profession → Profession (common career transitions)
- `WORKED_AT`: User → CareerEvent (user employment history)
- `AT_COMPANY`: CareerEvent → Company (company for a career event)

## Pathfinding

The schema supports multi-objective pathfinding queries to generate career trajectories (Plans A, B, C) based on:
- Salary potential
- Training costs
- Time to transition
- Automation risk
