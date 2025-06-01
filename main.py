from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import logging
from resume_parser import extract_resume_text
from job_matcher import calculate_similarity, match_skills, classify_resume
from ml_model import predict_suitability

# Initialize FastAPI
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://localhost:5175", "*"],  # Allow specific origins and all for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define absolute path for the uploads folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get the current script directory
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

# Ensure the uploads folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    logging.info(f"📂 Created uploads folder at: {UPLOAD_FOLDER}")

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Server is running"}

@app.post("/upload_resume/")
async def upload_resume(file: UploadFile = File(...)):
    logging.info("🚀 API /upload_resume/ was called!")
    logging.info(f"📄 Received file: {file.filename}, content_type: {file.content_type}")
    
    # Strip any directory info from the filename
    original_filename = os.path.basename(file.filename)
    logging.info(f"📄 Original filename: {original_filename}")
    
    # Further sanitize the filename if necessary
    safe_filename = "".join(c for c in original_filename if c.isalnum() or c in (".", "_", "-")).strip()
    logging.info(f"📄 Sanitized filename: {safe_filename}")
    
    file_path = os.path.join(UPLOAD_FOLDER, safe_filename)
    logging.info(f"📂 INTENDED SAVE LOCATION: {file_path}")
    
    # Ensure the uploads folder exists (again, just to be sure)
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
        logging.info(f"📂 Created uploads folder at: {UPLOAD_FOLDER}")
    
    try:
        # Reset file position to beginning before reading
        await file.seek(0)
        
        # Read file content
        content = await file.read()
        logging.info(f"📄 Read {len(content)} bytes from uploaded file")
        
        # Write to file
        with open(file_path, "wb") as buffer:
            buffer.write(content)
        logging.info(f"✅ FILE SUCCESSFULLY SAVED AT: {file_path}")
    except Exception as e:
        logging.error(f"❌ ERROR SAVING FILE: {str(e)}")
        import traceback
        logging.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Failed to save the resume file: {str(e)}")
    
    if os.path.exists(file_path):
        logging.info(f"✅ VERIFIED FILE EXISTS AT: {file_path}")
    else:
        logging.error(f"❌ FILE DOES NOT EXIST AFTER SAVING: {file_path}")
        raise HTTPException(status_code=500, detail="File was not saved correctly")

    try:
        # Continue with resume processing
        logging.info("📝 Extracting text from resume...")
        resume_text = extract_resume_text(file_path)
        logging.info(f"📝 Extracted {len(resume_text)} characters from resume")
        
        # Load job description from file
        try:
            with open("sample_job.txt", "r") as f:
                job_description = f.read()
            logging.info(f"📝 Loaded job description: {job_description[:50]}...")
        except Exception as e:
            logging.error(f"❌ ERROR READING JOB DESCRIPTION FILE: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to load job description: {str(e)}")
        
        # Calculate match scores and other outputs
        logging.info("🧮 Calculating similarity...")
        match_score = calculate_similarity(resume_text, job_description)
        logging.info(f"🧮 Match score: {match_score}")
        
        logging.info("🧮 Matching skills...")
        skill_match_score, matched_skills = match_skills(resume_text, job_description)
        logging.info(f"🧮 Skill match score: {skill_match_score}, matched skills: {matched_skills}")
        
        logging.info("🧮 Predicting suitability...")
        prediction = predict_suitability(4, match_score)  # Assume 4 years of experience for now
        logging.info(f"🧮 Prediction: {prediction}")
        
        logging.info("🧮 Classifying resume...")
        classification_result = classify_resume(resume_text)
        logging.info(f"🧮 Classification result: {classification_result}")

        logging.info("✅ PROCESSING COMPLETED, SENDING RESPONSE!")
    except Exception as e:
        logging.error(f"❌ ERROR PROCESSING RESUME: {str(e)}")
        import traceback
        logging.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")
    
    return {
        "match_score": match_score,
        "skill_match_score": skill_match_score,
        "matched_skills": matched_skills,
        "prediction": prediction,
        "bert_classification": classification_result,
        "file_saved_at": file_path
    }

# Run the FastAPI server if this file is executed directly
if __name__ == "__main__":
    import uvicorn
    logging.info("🚀 Starting FastAPI server on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
