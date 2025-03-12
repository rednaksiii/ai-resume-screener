import streamlit as st
from resume_parser import extract_resume_text, extract_resume_details
from job_matcher import calculate_similarity, match_skills
from ml_model import predict_suitability

st.title("📄 AI-Powered Resume Screener")

uploaded_file = st.file_uploader("Upload Resume", type=["pdf", "docx"])

if uploaded_file:
    with open(uploaded_file.name, "wb") as buffer:
        buffer.write(uploaded_file.getvalue())

    resume_text = extract_resume_text(uploaded_file.name)
    structured_data = extract_resume_details(resume_text)

    with open("sample_job.txt", "r") as f:
        job_description = f.read()

    match_score = calculate_similarity(resume_text, job_description)
    skill_match_score, matched_skills = match_skills(resume_text, job_description)
    prediction = predict_suitability(4, match_score)

    st.write(f"### Match Score: {match_score:.2f}%")
    st.write(f"**Skill Match Score:** {skill_match_score:.2f}%")
    st.write(f"**Matched Skills:** {', '.join(matched_skills)}")
    st.write(f"**Prediction:** {prediction}")

    st.write("### Extracted Resume Details")
    st.json(structured_data)
