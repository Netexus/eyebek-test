from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import face_recognition
import numpy as np
from PIL import Image
import io

app = FastAPI(title="Eyebek Facial Recognition API", version="1.0.0")

# CORS Configuration (allow Backend to call this service)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict to backend service
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class FaceComparisonResponse(BaseModel):
    match: bool
    confidence: float
    message: str

class HealthResponse(BaseModel):
    status: str
    service: str

# Health Check Endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint for Docker healthcheck"""
    return HealthResponse(status="healthy", service="facial-recognition")

# Root endpoint
@app.get("/")
async def root():
    return {
        "service": "Eyebek Facial Recognition API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "compare": "/api/compare-faces (POST)"
        }
    }

@app.post("/api/compare-faces", response_model=FaceComparisonResponse)
async def compare_faces(
    known_face: UploadFile = File(..., description="Known face image (stored)"),
    unknown_face: UploadFile = File(..., description="Unknown face image (to verify)")
):
    """
    Compare two face images and return match confidence.
    
    - **known_face**: The reference face image (e.g., from user profile)
    - **unknown_face**: The face to verify (e.g., from attendance capture)
    
    Returns match status and confidence score.
    """
    try:
        # Load images
        known_image_data = await known_face.read()
        unknown_image_data = await unknown_face.read()
        
        known_image = face_recognition.load_image_file(io.BytesIO(known_image_data))
        unknown_image = face_recognition.load_image_file(io.BytesIO(unknown_image_data))
        
        # Get face encodings
        known_encodings = face_recognition.face_encodings(known_image)
        unknown_encodings = face_recognition.face_encodings(unknown_image)
        
        if len(known_encodings) == 0:
            raise HTTPException(status_code=400, detail="No face detected in known image")
        
        if len(unknown_encodings) == 0:
            raise HTTPException(status_code=400, detail="No face detected in unknown image")
        
        # Compare faces (use first detected face)
        known_encoding = known_encodings[0]
        unknown_encoding = unknown_encodings[0]
        
        # Calculate face distance (lower is better, 0.6 is typical threshold)
        face_distance = face_recognition.face_distance([known_encoding], unknown_encoding)[0]
        
        # Convert distance to confidence (inverse relationship)
        confidence = 1.0 - face_distance
        
        # Determine match (threshold: 0.6 = 60% confidence)
        match = confidence >= 0.6
        
        return FaceComparisonResponse(
            match=match,
            confidence=round(confidence, 2),
            message="Faces match" if match else "Faces do not match"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing images: {str(e)}")

@app.post("/api/extract-encoding")
async def extract_face_encoding(image: UploadFile = File(...)):
    """
    Extract facial encoding from an image.
    Returns a 128-dimensional face encoding vector.
    """
    try:
        image_data = await image.read()
        loaded_image = face_recognition.load_image_file(io.BytesIO(image_data))
        
        encodings = face_recognition.face_encodings(loaded_image)
        
        if len(encodings) == 0:
            raise HTTPException(status_code=400, detail="No face detected in image")
        
        # Return first encoding as a list
        encoding = encodings[0].tolist()
        
        return {
            "success": True,
            "encoding": encoding,
            "dimensions": len(encoding)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error extracting encoding: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
