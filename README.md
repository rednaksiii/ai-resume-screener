### **📄 AI-Powered Resume Screener**  

🚀 **An AI-driven resume screening system** built with **FastAPI** that uses **Machine Learning, NLP, and BERT embeddings** to evaluate candidate resumes against job descriptions.  

---

## **📌 Features**  
✅ **Upload Resumes** (PDF/DOCX) via API  
✅ **Extracts Resume Text** using `pdfplumber` & `python-docx`  
✅ **Matches Resume with Job Descriptions** (TF-IDF & BERT embeddings)  
✅ **Skill Matching & Suitability Prediction** using **XGBoost**  
✅ **BERT-based Text Classification** for job relevance  
✅ **Stores Resumes in `uploads/` Folder**  

---

## **🚀 How It Works**
1️⃣ **User uploads a resume** via **Swagger UI** or API (`/upload_resume/`)  
2️⃣ **Text is extracted** using `pdfplumber` (PDF) or `python-docx` (DOCX)  
3️⃣ **Job matching system** calculates:  
   - **Text similarity** (TF-IDF + Cosine Similarity)  
   - **Skill match percentage**  
4️⃣ **ML Prediction (XGBoost)** classifies the candidate as **"Suitable" or "Not Suitable"**  
5️⃣ **BERT Classification** determines job relevance (`"Relevant"` or `"Not Relevant"`)  
6️⃣ **API returns a JSON response** with all results  

---

## **📡 API Endpoints**
### **1️⃣ Upload Resume**
#### **`POST /upload_resume/`**
- **Uploads a resume & evaluates candidate suitability**  
- **Body**: `multipart/form-data`
- **File Type**: `.pdf` or `.docx`
- **Response:**
```json
{
  "match_score": 85.4,
  "skill_match_score": 90,
  "matched_skills": ["Python", "Machine Learning", "Deep Learning"],
  "prediction": "Suitable",
  "bert_classification": {
    "label": "Relevant",
    "score": 0.92
  },
  "file_saved_at": "uploads/resume.pdf"
}
```

---

## **🛠️ Installation & Setup**
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-username/ai-resume-screener.git
cd ai-resume-screener
```

### **2️⃣ Create a Virtual Environment**
```bash
python -m venv venv
```
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

### **3️⃣ Install Dependencies**
```bash
pip install -r requirements.txt
```

### **4️⃣ Download spaCy & BERT Models**
```bash
python -m spacy download en_core_web_sm
```

### **5️⃣ Run FastAPI Server**
```bash
python -m uvicorn main:app --reload
```
Server will run at **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

### **6️⃣ Access Swagger UI**
Go to **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)** to test the API.

---

## **📂 Project Structure**
```
📦 ai-resume-screener
 ┣ 📂 uploads/                # Folder where uploaded resumes are stored
 ┣ 📜 main.py                 # FastAPI application
 ┣ 📜 resume_parser.py        # Extracts text from resumes
 ┣ 📜 job_matcher.py          # Job matching & skill extraction
 ┣ 📜 ml_model.py             # XGBoost-based suitability prediction
 ┣ 📜 sample_job.txt          # Example job description
 ┣ 📜 requirements.txt        # Required dependencies
 ┣ 📜 README.md               # Project documentation
```

---

## **📦 Dependencies (`requirements.txt`)**
This project requires the following packages:
```
fastapi
uvicorn
pdfplumber
python-docx
scikit-learn
xgboost
numpy
streamlit
spacy
transformers
sentence-transformers
torch
torchvision
torchaudio
pandas
joblib
```
To install them, run:
```bash
pip install -r requirements.txt
```
Then download the **spaCy model**:
```bash
python -m spacy download en_core_web_sm
```

---

## 📊 **Response Explanation**

When a resume is uploaded, the API returns a JSON object like this:

```json
{
  "match_score": 44.63,
  "skill_match_score": 50,
  "matched_skills": ["Python", "Machine Learning"],
  "prediction": "Suitable",
  "bert_classification": {
    "label": "Relevant",
    "score": 0.569
  },
  "file_saved_at": "uploads/SophiaMartinezDataScienceResume.pdf"
}
```

### 🔍 What Each Field Means:

| Field | Description |
|-------|-------------|
| `match_score` | **Textual similarity** between the resume and job description, calculated using **TF-IDF + cosine similarity** (scale: 0–100). |
| `skill_match_score` | The **percentage of required job skills** that were found in the resume. |
| `matched_skills` | A list of actual **skills detected** in the resume that overlap with the job description. |
| `prediction` | Output from the **XGBoost ML model** that predicts whether the candidate is **“Suitable” or “Not Suitable”** based on features like match score and (placeholder) experience. |
| `bert_classification.label` | Classification result from a **BERT-based model**, determining whether the resume text is **“Relevant” or “Not Relevant”** to the job context. |
| `bert_classification.score` | The **confidence score** (from 0 to 1) of the BERT model’s classification. |
| `file_saved_at` | The full **path to the saved resume** in the local `uploads/` folder, useful for reviewing or referencing later. |

---

## **🔮 Next Steps**
🔲 **Fix Swagger UI Debugging Issue**  
🔲 **Optimize BERT Model with More Data**  
🔲 **Deploy API Online (Railway, Render, or AWS)**  
🔲 **Sorting Resumes by Score** 