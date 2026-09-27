from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .database import Base, engine
from . import models
from .routes import tickets


# Create database tables
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Customer Support CRM API",
    description="REST API for the Customer Support Ticketing CRM",
    version="1.0.0",
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "https://customer-support-ticketing-cxloby0ad-darpan12.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Ticket API routes
app.include_router(
    tickets.router,
    prefix="/api",
)


@app.get("/")
def root():
    return {
        "message": "Customer Support CRM API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }