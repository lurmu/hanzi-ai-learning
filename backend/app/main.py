"""FastAPI main application entry point"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.core.config import settings
from app.api import users, hanzi, learning, ai

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered Chinese character learning system for children",
    version=settings.APP_VERSION,
    debug=settings.DEBUG
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api/v1", tags=["users"])
app.include_router(hanzi.router, prefix="/api/v1", tags=["hanzi"])
app.include_router(learning.router, prefix="/api/v1", tags=["learning"])
app.include_router(ai.router, prefix="/api/v1", tags=["ai"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Welcome to Hanzi AI Learning API", "version": settings.APP_VERSION}


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
