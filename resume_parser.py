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
    if file_path.endswith(".pdf"):
        return extract_text_from_pdf(file_path)
    elif file_path.endswith(".docx"):
        return extract_text_from_docx(file_path)
    else:
        raise ValueError("Unsupported file format. Use PDF or DOCX.")

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
