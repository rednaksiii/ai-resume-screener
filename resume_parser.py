import pdfplumber
import docx
import spacy
import re

# Load spaCy model for Named Entity Recognition (NER)
nlp = spacy.load("en_core_web_sm")

# Predefined skill set (you can expand this)
SKILL_LIST = ["Python", "Machine Learning", "Deep Learning", "NLP", "TensorFlow", "Keras", "PyTorch",
              "SQL", "Data Science", "Artificial Intelligence", "Computer Vision", "Statistics"]

def extract_text_from_pdf(pdf_path):
    """Extract text from a PDF resume."""
    with pdfplumber.open(pdf_path) as pdf:
        text = "\n".join([page.extract_text() for page in pdf.pages if page.extract_text()])
    return text

def extract_text_from_docx(docx_path):
    """Extract text from a DOCX resume."""
    doc = docx.Document(docx_path)
    return "\n".join([para.text for para in doc.paragraphs])

def extract_resume_text(file_path):
    """Detect file type and extract text accordingly."""
    import os
    import logging
    
    logging.info(f"Attempting to extract text from: {file_path}")
    
    # Check if file exists
    if not os.path.exists(file_path):
        logging.error(f"File does not exist: {file_path}")
        raise FileNotFoundError(f"File not found: {file_path}")
    
    # Check file size
    file_size = os.path.getsize(file_path)
    logging.info(f"File size: {file_size} bytes")
    if file_size == 0:
        logging.error(f"File is empty: {file_path}")
        raise ValueError(f"Empty file: {file_path}")
    
    # Extract text based on file extension
    try:
        if file_path.lower().endswith(".pdf"):
            logging.info("Detected PDF file, extracting text...")
            text = extract_text_from_pdf(file_path)
        elif file_path.lower().endswith(".docx"):
            logging.info("Detected DOCX file, extracting text...")
            text = extract_text_from_docx(file_path)
        else:
            logging.error(f"Unsupported file format: {file_path}")
            raise ValueError(f"Unsupported file format: {os.path.splitext(file_path)[1]}. Use PDF or DOCX.")
        
        logging.info(f"Successfully extracted {len(text)} characters of text")
        return text
    except Exception as e:
        logging.error(f"Error extracting text from {file_path}: {str(e)}")
        import traceback
        logging.error(traceback.format_exc())
        raise

def extract_name(text):
    """Extract the candidate's name from the resume text using spaCy."""
    doc = nlp(text)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text
    return "Not Found"

def extract_skills(text):
    """Extract skills by checking predefined skill keywords."""
    skills_found = [skill for skill in SKILL_LIST if skill.lower() in text.lower()]
    return list(set(skills_found))  # Remove duplicates

def extract_education(text):
    """Extract education-related information from resume text."""
    edu_keywords = ["Bachelor", "Master", "PhD", "B.Sc", "M.Sc", "Doctorate", "Degree", "University"]
    education_list = [line for line in text.split("\n") if any(edu in line for edu in edu_keywords)]
    return education_list if education_list else ["Not Found"]

def extract_experience(text):
    """Extract experience details based on years worked (e.g., '5 years of experience')."""
    experience_pattern = re.compile(r"(\d+)\s+years? of experience", re.IGNORECASE)
    experience_match = experience_pattern.search(text)
    return experience_match.group(0) if experience_match else "Not Found"

def parse_resume(file_path):
    """Extract structured data from resume."""
    resume_text = extract_resume_text(file_path)

    parsed_data = {
        "Name": extract_name(resume_text),
        "Skills": extract_skills(resume_text),
        "Education": extract_education(resume_text),
        "Experience": extract_experience(resume_text)
    }

    return parsed_data

if __name__ == "__main__":
    resume_data = parse_resume("sample_resume.pdf")
    print(resume_data)
