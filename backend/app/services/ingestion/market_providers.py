"""
API integration handlers for external market data providers.

Providers:
- TheirStack: Job postings and ATS data
- Coresignal: Company and role analytics
- Numbeo: Cost of living data
- Levels.fyi: Compensation benchmarks
"""
import httpx
from typing import Dict, Any, List, Optional
from abc import ABC, abstractmethod
import logging
from tenacity import retry, stop_after_attempt, wait_exponential

from app.core.config import settings

logger = logging.getLogger(__name__)


class MarketDataProvider(ABC):
    """Base class for market data providers."""

    def __init__(self, api_key: str, base_url: str):
        self.api_key = api_key
        self.base_url = base_url
        self.client = httpx.AsyncClient(
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=30.0
        )

    @abstractmethod
    async def fetch_data(self, **kwargs) -> Dict[str, Any]:
        """Fetch data from the provider."""
        pass

    async def close(self):
        """Close HTTP client."""
        await self.client.aclose()


class TheirStackProvider(MarketDataProvider):
    """TheirStack API integration for job postings and ATS data."""

    def __init__(self):
        super().__init__(
            api_key=settings.THEIRSTACK_API_KEY or "",
            base_url="https://api.theirstack.com/v1"
        )

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    async def fetch_data(
        self,
        profession: str,
        location: Optional[str] = None,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Fetch job postings for a specific profession.
        """
        if not self.api_key:
            logger.warning("TheirStack API key not configured")
            return []

        # TODO: Implement actual TheirStack API integration
        logger.info(f"Fetching TheirStack data for {profession}")
        return []


class CoresignalProvider(MarketDataProvider):
    """Coresignal API integration for company and role analytics."""

    def __init__(self):
        super().__init__(
            api_key=settings.CORESIGNAL_API_KEY or "",
            base_url="https://api.coresignal.com/v1"
        )

    @retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
    async def fetch_data(
        self,
        profession: str,
        region: str = "US"
    ) -> Dict[str, Any]:
        """Fetch company and role analytics."""
        if not self.api_key:
            logger.warning("Coresignal API key not configured")
            return {}

        # TODO: Implement Coresignal API integration
        logger.info(f"Fetching Coresignal data for {profession}")
        return {}


# Provider instances
theirstack = TheirStackProvider()
coresignal = CoresignalProvider()
