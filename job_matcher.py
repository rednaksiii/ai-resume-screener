from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from transformers import pipeline
import spacy
from sentence_transformers import SentenceTransformer, util
bert_model = SentenceTransformer("all-MiniLM-L6-v2")  # Efficient BERT model

# Load spaCy for text processing
nlp = spacy.load("en_core_web_sm")

# Load BERT-based model for text classification
classifier = pipeline("text-classification", model="bert-base-uncased")

# Predefined skill list (expand for more domains)
SKILL_LIST = ["Python", "Machine Learning", "Deep Learning", "NLP", "TensorFlow", "Keras", "PyTorch",
              "SQL", "Data Science", "Artificial Intelligence", "Computer Vision", "Statistics"]

def preprocess_text(text):
    """Lowercase, remove special characters, and lemmatize text."""
    doc = nlp(text.lower())
    cleaned_text = " ".join([token.lemma_ for token in doc if not token.is_stop and not token.is_punct])
    return cleaned_text

def calculate_similarity(resume_text, job_description):
    """Use BERT embeddings for better similarity scoring.
    Returns a normalized score between 0 and 100."""
    resume_embedding = bert_model.encode(resume_text, convert_to_tensor=True)
    job_embedding = bert_model.encode(job_description, convert_to_tensor=True)

    # Get cosine similarity (value between -1 and 1)
    similarity_score = util.pytorch_cos_sim(resume_embedding, job_embedding)[0][0].item()
    
    # Normalize to 0-1 range (cosine similarity can be between -1 and 1)
    # For text similarity, values are typically between 0 and 1, but we'll handle negative values just in case
    normalized_score = max(0, min(similarity_score, 1))
    
    # Convert to percentage (0-100 range)
    return normalized_score * 100


def match_skills(resume_text, job_description):
    """Extract and compare skills between resume and job description."""
    resume_skills = [skill for skill in SKILL_LIST if skill.lower() in resume_text.lower()]
    job_skills = [skill for skill in SKILL_LIST if skill.lower() in job_description.lower()]
    
    common_skills = set(resume_skills) & set(job_skills)
    skill_match_score = len(common_skills) / max(len(job_skills), 1) * 100  # Avoid division by zero
    
    return skill_match_score, list(common_skills)

LABEL_MAP = {
    "LABEL_0": "Not Relevant",
    "LABEL_1": "Relevant"
}

def classify_resume(resume_text):
    """Classify the resume using a BERT model."""
    result = classifier(resume_text[:512])  # Limit to 512 tokens
    label = LABEL_MAP.get(result[0]['label'], "Unknown")
    
    return {"label": label, "score": result[0]['score']}


if __name__ == "__main__":
    with open("sample_job.txt", "r") as f:
        job_desc = f.read()

    resume_text = "I have experience in Python, Machine Learning, Deep Learning, and SQL."
    
    similarity_score = calculate_similarity(resume_text, job_desc)
    skill_match_score, matched_skills = match_skills(resume_text, job_desc)
    classification_result = classify_resume(resume_text)

    print(f"📊 **Overall Match Score:** {similarity_score:.2f}%")
    print(f"🔹 **Skill Match Score:** {skill_match_score:.2f}%")
    print(f"✅ **Matched Skills:** {', '.join(matched_skills)}")
    print(f"🧠 **BERT Classification:** {classification_result}")
