"""
Multi-objective pathfinding engine for career trajectory optimization.

Implements algorithms inspired by Dijkstra/A* with Artificial Bee Colony
optimization for multi-objective cost functions.
"""
from typing import List, Dict, Any, Optional, Tuple
import heapq
from dataclasses import dataclass
import logging

from app.models.graph_models import CareerPath
from app.core.neo4j_connection import Neo4jConnection

logger = logging.getLogger(__name__)


@dataclass
class PathNode:
    """Node in the career pathfinding search."""
    profession_id: str
    cost: float  # Multi-objective cost
    time_months: int
    salary: float
    automation_risk: float
    parent: Optional['PathNode'] = None
    trainings_required: List[str] = None

    def __lt__(self, other):
        """Compare nodes by cost for priority queue."""
        return self.cost < other.cost


class PathfindingEngine:
    """
    Career path optimization engine.

    Uses multi-objective optimization to balance:
    - Salary potential (maximize)
    - Training cost (minimize)
    - Time investment (minimize)
    - Automation risk (minimize)
    """

    def __init__(self, db: Neo4jConnection):
        self.db = db

    def calculate_paths(
        self,
        user_id: str,
        target_profession_id: str,
        max_cost: float = 50000.0,
        max_time_months: int = 24,
        risk_tolerance: float = 0.5,
        num_paths: int = 3
    ) -> List[CareerPath]:
        """
        Generate top N career paths from current to target profession.

        Args:
            user_id: User's unique identifier
            target_profession_id: Target profession to reach
            max_cost: Maximum training cost budget
            max_time_months: Maximum time horizon
            risk_tolerance: 0.0 (risk-averse) to 1.0 (risk-tolerant)
            num_paths: Number of alternative paths to generate (default 3)

        Returns:
            List of CareerPath objects (Plans A, B, C)
        """
        # Get user's current profession and skills
        user_data = self._get_user_profile(user_id)
        if not user_data:
            logger.error(f"User {user_id} not found")
            return []

        current_profession_id = user_data.get("current_profession")
        current_skills = set(user_data.get("current_skills", []))

        # Run modified A* search to find multiple paths
        paths = self._find_k_shortest_paths(
            start_profession=current_profession_id,
            target_profession=target_profession_id,
            current_skills=current_skills,
            max_cost=max_cost,
            max_time_months=max_time_months,
            risk_tolerance=risk_tolerance,
            k=num_paths
        )

        # Convert to CareerPath objects
        career_paths = []
        plan_labels = ["A", "B", "C"]
        for i, path_data in enumerate(paths[:num_paths]):
            career_path = self._build_career_path(
                plan_id=plan_labels[i],
                path_data=path_data,
                current_profession_id=current_profession_id,
                target_profession_id=target_profession_id
            )
            career_paths.append(career_path)

        return career_paths

    def _get_user_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve user profile from Neo4j."""
        query = """
        MATCH (u:User {id: $user_id})
        OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
        RETURN u.current_profession as current_profession,
               collect(s.id) as current_skills
        """
        results = self.db.execute_query(query, {"user_id": user_id})
        return results[0] if results else None

    def _find_k_shortest_paths(
        self,
        start_profession: str,
        target_profession: str,
        current_skills: set,
        max_cost: float,
        max_time_months: int,
        risk_tolerance: float,
        k: int = 3
    ) -> List[Dict[str, Any]]:
        """
        Find k-shortest paths using A* with multi-objective cost.

        This is a placeholder implementation. In production, this would:
        1. Query Neo4j for profession graph with TRANSITIONS_TO relationships
        2. Use A* with multi-objective heuristic
        3. Track k-best paths using Yen's algorithm or similar
        """
        # TODO: Implement full pathfinding algorithm
        logger.warning("Pathfinding algorithm not yet implemented")

        # Placeholder: Return empty paths
        return []

    def _calculate_multi_objective_cost(
        self,
        salary_gain: float,
        training_cost: float,
        time_months: int,
        automation_risk: float,
        risk_tolerance: float
    ) -> float:
        """
        Calculate multi-objective cost function.

        Lower cost is better. Balances:
        - Negative salary gain (we want to maximize this)
        - Training cost (minimize)
        - Time investment (minimize)
        - Automation risk (minimize, weighted by risk_tolerance)
        """
        # Normalize and weight components
        salary_component = -salary_gain / 10000  # Negative because we maximize
        cost_component = training_cost / 10000
        time_component = time_months / 12
        risk_component = automation_risk * (1 - risk_tolerance)

        # Weighted sum (weights can be tuned)
        total_cost = (
            0.4 * salary_component +
            0.3 * cost_component +
            0.2 * time_component +
            0.1 * risk_component
        )

        return total_cost

    def _build_career_path(
        self,
        plan_id: str,
        path_data: Dict[str, Any],
        current_profession_id: str,
        target_profession_id: str
    ) -> CareerPath:
        """Convert path search result to CareerPath model."""
        # TODO: Build full CareerPath from search results
        return CareerPath(
            plan_id=plan_id,
            current_profession_id=current_profession_id,
            target_profession_id=target_profession_id,
            steps=[],
            total_cost=0.0,
            total_time_months=0,
            expected_salary_gain=0.0,
            roi=0.0,
            automation_risk=0.0,
            required_trainings=[],
            skills_to_acquire=[],
            confidence_score=0.0
        )

    def apply_path_traversal_pruning(
        self,
        paths: List[Dict[str, Any]],
        max_time: int,
        max_cost: float
    ) -> List[Dict[str, Any]]:
        """
        Filter paths that exceed time or cost constraints.

        Args:
            paths: List of candidate paths
            max_time: Maximum time in months
            max_cost: Maximum training cost budget

        Returns:
            Filtered list of viable paths
        """
        viable_paths = []
        for path in paths:
            if path["total_time_months"] <= max_time and path["total_cost"] <= max_cost:
                viable_paths.append(path)

        return viable_paths
