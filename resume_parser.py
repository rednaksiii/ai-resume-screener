import pdfplumber
import docx

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

if __name__ == "__main__":
    text = extract_resume_text("sample_resume.pdf")
    print(text)
