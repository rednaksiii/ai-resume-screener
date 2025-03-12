from fastapi import FastAPI, UploadFile, File
import os
import shutil
from resume_parser import extract_resume_text
from job_matcher import calculate_similarity, match_skills, classify_resume
from ml_model import predict_suitability

app = FastAPI()

UPLOAD_FOLDER = "uploads"

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.post("/upload_resume/")
async def upload_resume(file: UploadFile = File(...)):
    """API endpoint to upload a resume and get a match score."""

    print("🚀 API /upload_resume/ was called!")  # ✅ Debug: Check if function is running

    # Save the uploaded file inside the 'uploads' folder
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    print(f"📂 Saving file to: {file_path}")  # ✅ Debug: Show save path

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    print(f"✅ File successfully saved at: {file_path}")  # ✅ Debug: Confirm file saved

    resume_text = extract_resume_text(file_path)

    with open("sample_job.txt", "r") as f:
        job_description = f.read()

    match_score = calculate_similarity(resume_text, job_description)
    skill_match_score, matched_skills = match_skills(resume_text, job_description)
    prediction = predict_suitability(4, match_score)  # Assume 4 years of experience for now
    classification_result = classify_resume(resume_text)

    print("✅ Processing completed, sending response!")  # ✅ Debug: Check if function finishes

    return {
        "match_score": match_score,
        "skill_match_score": skill_match_score,
        "matched_skills": matched_skills,
        "prediction": prediction,
        "bert_classification": classification_result,
        "file_saved_at": file_path  # Shows the exact path where the resume is stored
    }
