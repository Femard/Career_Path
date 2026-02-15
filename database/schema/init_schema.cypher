// Neo4j Schema Initialization for Dynamic Career Pathing SaaS
// This file defines the graph structure, constraints, and indexes

// ============================================
// NODE CONSTRAINTS (Uniqueness)
// ============================================

// Ensure unique IDs for all node types
CREATE CONSTRAINT profession_id_unique IF NOT EXISTS
FOR (p:Profession) REQUIRE p.id IS UNIQUE;

CREATE CONSTRAINT skill_id_unique IF NOT EXISTS
FOR (s:Skill) REQUIRE s.id IS UNIQUE;

CREATE CONSTRAINT training_id_unique IF NOT EXISTS
FOR (t:Training) REQUIRE t.id IS UNIQUE;

CREATE CONSTRAINT user_id_unique IF NOT EXISTS
FOR (u:User) REQUIRE u.id IS UNIQUE;

CREATE CONSTRAINT company_id_unique IF NOT EXISTS
FOR (c:Company) REQUIRE c.id IS UNIQUE;

CREATE CONSTRAINT career_event_id_unique IF NOT EXISTS
FOR (ce:CareerEvent) REQUIRE ce.id IS UNIQUE;

// ============================================
// INDEXES (Performance Optimization)
// ============================================

// Frequently queried properties
CREATE INDEX profession_title_idx IF NOT EXISTS
FOR (p:Profession) ON (p.title);

CREATE INDEX skill_name_idx IF NOT EXISTS
FOR (s:Skill) ON (s.name);

CREATE INDEX skill_category_idx IF NOT EXISTS
FOR (s:Skill) ON (s.category);

CREATE INDEX training_provider_idx IF NOT EXISTS
FOR (t:Training) ON (t.provider);

CREATE INDEX user_email_idx IF NOT EXISTS
FOR (u:User) ON (u.email);

// Ontology source indexes for cross-referencing
CREATE INDEX profession_esco_idx IF NOT EXISTS
FOR (p:Profession) ON (p.esco_id);

CREATE INDEX profession_onet_idx IF NOT EXISTS
FOR (p:Profession) ON (p.onet_id);

CREATE INDEX skill_esco_idx IF NOT EXISTS
FOR (s:Skill) ON (s.esco_id);

CREATE INDEX skill_onet_idx IF NOT EXISTS
FOR (s:Skill) ON (s.onet_id);

// ============================================
// SAMPLE DATA STRUCTURE (Examples)
// ============================================

// Example Profession nodes
// CREATE (p:Profession {
//   id: 'prof_001',
//   title: 'Software Engineer',
//   description: 'Develops and maintains software applications',
//   ontology_source: 'O*NET',
//   onet_id: '15-1252.00',
//   avg_salary: 110000.0,
//   market_demand: 0.85,
//   automation_risk: 0.15,
//   created_at: datetime()
// });

// Example Skill nodes
// CREATE (s:Skill {
//   id: 'skill_001',
//   name: 'Python Programming',
//   description: 'Proficiency in Python language',
//   category: 'Technical',
//   ontology_source: 'ESCO',
//   esco_id: 'S1.2.3',
//   automation_risk: 0.1,
//   market_demand: 0.9,
//   created_at: datetime()
// });

// Example Training nodes
// CREATE (t:Training {
//   id: 'train_001',
//   title: 'Python for Data Science',
//   provider: 'Coursera',
//   duration_hours: 40.0,
//   cost: 49.99,
//   difficulty_level: 'Intermediate',
//   created_at: datetime()
// });

// ============================================
// RELATIONSHIP PATTERNS
// ============================================

// Profession requires Skill
// MATCH (p:Profession {id: 'prof_001'}), (s:Skill {id: 'skill_001'})
// CREATE (p)-[:REQUIRES {proficiency_level: 'intermediate', weight: 0.8}]->(s);

// Training teaches Skill
// MATCH (t:Training {id: 'train_001'}), (s:Skill {id: 'skill_001'})
// CREATE (t)-[:TEACHES {proficiency_level: 'intermediate'}]->(s);

// User has Skill
// MATCH (u:User {id: 'user_001'}), (s:Skill {id: 'skill_001'})
// CREATE (u)-[:HAS_SKILL {acquired_date: datetime(), proficiency: 0.7}]->(s);

// Profession transitions to Profession
// MATCH (p1:Profession {id: 'prof_001'}), (p2:Profession {id: 'prof_002'})
// CREATE (p1)-[:TRANSITIONS_TO {
//   avg_time_months: 12,
//   training_cost: 5000.0,
//   success_rate: 0.75,
//   salary_change: 15000.0
// }]->(p2);

// ============================================
// PATHFINDING QUERIES (Examples)
// ============================================

// Find shortest path between professions
// MATCH path = shortestPath(
//   (start:Profession {id: 'prof_001'})-[:TRANSITIONS_TO*]-(target:Profession {id: 'prof_003'})
// )
// RETURN path;

// Find skills required for a profession
// MATCH (p:Profession {id: 'prof_001'})-[:REQUIRES]->(s:Skill)
// RETURN s.name, s.category, s.market_demand
// ORDER BY s.market_demand DESC;

// Find trainings that teach required skills
// MATCH (p:Profession {id: 'prof_001'})-[:REQUIRES]->(s:Skill)<-[:TEACHES]-(t:Training)
// RETURN t.title, t.provider, t.cost, t.duration_hours, collect(s.name) as skills_taught
// ORDER BY t.cost ASC;

// ============================================
// DRIFT ANALYSIS QUERIES (Examples)
// ============================================

// Monitor profession demand trends
// MATCH (p:Profession)
// WHERE p.market_demand < 0.3  // Low demand threshold
// RETURN p.title, p.market_demand, p.automation_risk
// ORDER BY p.automation_risk DESC;

// Find users affected by profession decline
// MATCH (u:User)-[:HAS_TARGET]->(p:Profession)
// WHERE p.market_demand < 0.3 OR p.automation_risk > 0.7
// RETURN u.email, p.title, p.market_demand, p.automation_risk;
