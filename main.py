from fastapi import FastAPI, UploadFile, File, HTTPException
import os
import shutil
import logging
from resume_parser import extract_resume_text
from job_matcher import calculate_similarity, match_skills, classify_resume
from ml_model import predict_suitability

# Initialize FastAPI
app = FastAPI()

# Define absolute path for the uploads folder
BASE_DIR = os.path.dirname(os.path.abspath(__file__))  # Get the current script directory
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")

# Ensure the uploads folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
    logging.info(f"📂 Created uploads folder at: {UPLOAD_FOLDER}")

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

@app.post("/upload_resume/")
async def upload_resume(file: UploadFile = File(...)):
    logging.info("🚀 API /upload_resume/ was called!")
    
    # Strip any directory info from the filename
    original_filename = os.path.basename(file.filename)
    
    # Further sanitize the filename if necessary
    safe_filename = "".join(c for c in original_filename if c.isalnum() or c in (".", "_", "-")).strip()
    
    file_path = os.path.join(UPLOAD_FOLDER, safe_filename)
    logging.info(f"📂 INTENDED SAVE LOCATION: {file_path}")
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        logging.info(f"✅ FILE SUCCESSFULLY SAVED AT: {file_path}")
    except Exception as e:
        logging.error(f"❌ ERROR SAVING FILE: {e}")
        raise HTTPException(status_code=500, detail="Failed to save the resume file.")
    
    if os.path.exists(file_path):
        logging.info(f"✅ VERIFIED FILE EXISTS AT: {file_path}")
    else:
        logging.error(f"❌ FILE DOES NOT EXIST AFTER SAVING: {file_path}")

    # Continue with resume processing
    resume_text = extract_resume_text(file_path)
    
    # Load job description from file
    try:
        with open("sample_job.txt", "r") as f:
            job_description = f.read()
    except Exception as e:
        logging.error(f"❌ ERROR READING JOB DESCRIPTION FILE: {e}")
        raise HTTPException(status_code=500, detail="Failed to load job description.")
    
    # Calculate match scores and other outputs
    match_score = calculate_similarity(resume_text, job_description)
    skill_match_score, matched_skills = match_skills(resume_text, job_description)
    prediction = predict_suitability(4, match_score)  # Assume 4 years of experience for now
    classification_result = classify_resume(resume_text)

    logging.info("✅ PROCESSING COMPLETED, SENDING RESPONSE!")
    
    return {
        "match_score": match_score,
        "skill_match_score": skill_match_score,
        "matched_skills": matched_skills,
        "prediction": prediction,
        "bert_classification": classification_result,
        "file_saved_at": file_path
    }
