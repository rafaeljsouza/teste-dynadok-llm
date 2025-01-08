import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
#import services.llm_service as llm
from services.llm_service import generate_summary, translate_text
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

class SummaryRequest(BaseModel):
    text: str
    lang: str

class SummaryResponse(BaseModel):
    summary: str

@app.get("/")
async def root():
    return {"message": "API is running"}

@app.post("/summarize", response_model=SummaryResponse)
async def summarize_text(request: SummaryRequest):
    try:
        if request.lang not in ['pt', 'en', 'es']:
            raise HTTPException(status_code=400, detail="Language not supported")
        
        # Validate input text
        if not request.text or len(request.text.strip()) == 0:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
            
        # Log the incoming request
        logger.info(f"Processing text of length {len(request.text)} in {request.lang}")
        
        # Generate summary
        logger.info("Generating summary...")
        summary = await generate_summary(request.text)
        
        # Translate if needed
        if request.lang != 'en':
            logger.info(f"Translating to {request.lang}...")
            summary = await translate_text(summary, request.lang)
        
        logger.info("Processing completed successfully")
        return SummaryResponse(summary=summary)
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        error_message = f"Error processing request: {str(e)}"
        raise HTTPException(status_code=500, detail=error_message)