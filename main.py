from fastapi import FastAPI, UploadFile, File
import shutil
from resume_parser import extract_resume_text
from job_matcher import calculate_similarity
from ml_model import predict_suitability
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow all origins for testing (you can restrict it later)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all domains
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


@app.post("/upload_resume/")
async def upload_resume(file: UploadFile = File(...)):
    with open(file.filename, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume_text = extract_resume_text(file.filename)
    with open("sample_job.txt", "r") as f:
        job_description = f.read()

    match_score = calculate_similarity(resume_text, job_description)

    print(f"\n🔍 Resume Text: {resume_text[:500]}")  # Print first 500 characters
    print(f"📌 Job Description: {job_description}")
    print(f"📊 Calculated Match Score: {match_score:.2f}%\n")

    prediction = predict_suitability(4, match_score)  # Assume 4 years experience
    return {"match_score": match_score, "prediction": prediction}

# Run with: uvicorn main:app --reload
