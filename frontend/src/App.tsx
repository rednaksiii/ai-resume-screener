import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ResumeUploader from './components/ResumeUploader';
import ResultsDisplay from './components/ResultsDisplay';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  
  const handleUploadComplete = (data: any) => {
    setIsLoading(false);
    setResults(data);
  };
  
  const handleReset = () => {
    setResults(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
      >
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8">
          <motion.h1 
            className="text-2xl md:text-3xl font-bold text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            AI-Powered Resume Screener
          </motion.h1>
          <motion.p 
            className="text-blue-100 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Upload your resume and get instant AI-powered feedback
          </motion.p>
        </header>
        
        <main className="p-6 md:p-8">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <LoadingScreen key="loading" />
            ) : results ? (
              <ResultsDisplay key="results" results={results} onReset={handleReset} />
            ) : (
              <ResumeUploader key="uploader" onUploadStart={() => setIsLoading(true)} onUploadComplete={handleUploadComplete} />
            )}
          </AnimatePresence>
        </main>
        
        <footer className="bg-gray-50 py-4 px-8 text-center text-gray-500 text-sm border-t border-gray-100">
          <p>Powered by FastAPI, React, and Machine Learning</p>
        </footer>
      </motion.div>
    </div>
  );
}

export default App;
