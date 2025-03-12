from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def calculate_similarity(resume_text, job_description):
    """Calculate similarity score between resume and job description."""
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([resume_text, job_description])
    similarity_score = cosine_similarity(vectors[0], vectors[1])[0][0]
    return similarity_score * 100  # Convert to percentage

if __name__ == "__main__":
    with open("sample_job.txt", "r") as f:
        job_desc = f.read()
    
    resume_text = "Skills: Python, Machine Learning, NLP, Deep Learning"
    score = calculate_similarity(resume_text, job_desc)
    print(f"Match Score: {score:.2f}%")
