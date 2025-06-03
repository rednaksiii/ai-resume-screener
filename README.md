<div align="center">

# 🔍 AI Resume Screener

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=for-the-badge&logo=scikit-learn&logoColor=white)](https://scikit-learn.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, **AI-powered resume screening tool** that instantly analyzes how well a resume matches a job description using state-of-the-art NLP, BERT embeddings, and machine learning — all wrapped in a beautiful, responsive UI.

</div>

## ✨ Features

<div align="center">

| Job Description Input | Resume Upload | Match Results |
|:---:|:---:|:---:|
| ![Job Input](screenshots/jobdesc.png) | ![Upload](screenshots/upload.png) | ![Results](screenshots/results.png) |

</div>

### 🤖 AI & Machine Learning
- **BERT Embeddings** for semantic text understanding
- **XGBoost Model** for candidate suitability prediction
- **TF-IDF & Cosine Similarity** for precise matching
- **spaCy NLP** for advanced text processing
- **Scikit-learn** for ML pipeline management

---

## ✨ Key Features

### 🔬 AI & NLP Analysis

* 💡 **Job Description Input** — Type or paste directly in the UI
* 📄 **Resume Upload** — Supports `.pdf` and `.docx`
* 🔍 **Text Extraction** — Accurate parsing of complex resumes
* 📊 **Match Score** — TF-IDF + Cosine similarity (0–100%)
* 🎯 **Skill Match %** — Compares required vs. detected skills
* 🤖 **XGBoost Prediction** — "Suitable" or "Not Suitable"
* 🧠 **BERT Relevance** — Classifies resumes with confidence score

### 💻 Modern Frontend

* 🎨 **React + TypeScript** - For robust, type-safe components
* 🌈 **TailwindCSS + Framer Motion** - Beautiful, fluid animations
* ⚡ **Vite** - Lightning-fast build tooling
* 📥 **React Dropzone** - Drag & drop file uploads
* 📊 **Dynamic Charts** - Real-time data visualization

## 📈 Analysis Results

The AI-powered analysis provides comprehensive insights:

* 🎯 **Overall Match Score** - TF-IDF based semantic similarity
* 📉 **Skill Match Score** - Required vs detected skills comparison
* 🤖 **ML Prediction** - XGBoost-powered suitability analysis
* 🧠 **BERT Classification** - Deep learning relevance scoring
* 📊 **Visual Analytics** - Clear, actionable insights

## 📚 Project Architecture

```mermaid
graph TD
    A[Frontend - React + TypeScript] --API Calls--> B[FastAPI Backend]
    B --> C[Resume Parser]
    B --> D[Job Matcher]
    B --> E[ML Model]
    C --> F[Text Extraction]
    D --> G[TF-IDF Vectorizer]
    D --> H[Skill Matcher]
    E --> I[XGBoost Model]
    E --> J[BERT Classifier]
    style A fill:#61DAFB,stroke:#333,stroke-width:2px
    style B fill:#009688,stroke:#333,stroke-width:2px
    style E fill:#F7931E,stroke:#333,stroke-width:2px
    style J fill:#FFC107,stroke:#333,stroke-width:2px
```

### 🎯 Core Technologies

🔍 **Frontend Stack**
- React 18 with TypeScript
- TailwindCSS for styling
- Framer Motion animations
- Vite for development

🔧 **Backend Stack**
- FastAPI for high-performance API
- Scikit-learn for ML pipeline
- BERT for deep learning
- spaCy for NLP tasks

---

## 📁 Project Structure

```
ai-resume-screener/
├── backend/
│   ├── main.py            # FastAPI routes
│   ├── job_matcher.py     # TF-IDF & skill matching
│   ├── ml_model.py        # XGBoost prediction logic
│   ├── resume_parser.py   # Text extraction
│   └── requirements.txt   # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.tsx         # Main component
│   │   └── ...             # Other files
│   ├── public/             # Static assets
│   └── package.json
└── uploads/                # Uploaded resumes
```

---

## ⚙️ Local Setup

### 🧠 Backend (FastAPI)

```bash
git clone https://github.com/your-username/ai-resume-screener.git
cd ai-resume-screener/backend

python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt
python -m spacy download en_core_web_sm

uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`

---

### 💻 Frontend (React + Vite)

```bash
cd ../frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

## 📈 What’s Next?

* [ ] 🔐 User profiles & login
* [ ] 💾 Resume history tracking
* [ ] 📊 Compare against multiple job descriptions
* [ ] 📋 Resume improvement tips
* [ ] 📥 Export analysis as PDF report

---

## 📄 License

MIT License — See [`LICENSE`](LICENSE) for full details.

---

## ✊ Acknowledgments

Created to support job seekers around the world with smarter tools.
Special thanks to the open-source community for laying the foundation.
