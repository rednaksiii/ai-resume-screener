import { motion } from 'framer-motion';

interface ResultsDisplayProps {
  results: {
    match_score: number;
    skill_match_score: number;
    matched_skills: string[];
    prediction: string;
    bert_classification: {
      label: string;
      confidence: number;
    };
  };
  onReset: () => void;
}

const ResultsDisplay = ({ results, onReset }: ResultsDisplayProps) => {
  // Format scores as percentages
  // Backend now returns match_score and skill_match_score already in 0-100 range
  const matchScore = Math.round(results.match_score);
  const skillMatchScore = Math.round(results.skill_match_score);
  const confidenceScore = Math.round(results.bert_classification.confidence * 100); // This still needs multiplication
  
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Determine background color based on score
  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  // Animation variants for progress bars
  const progressVariants = {
    hidden: { width: '0%' },
    visible: (score: number) => ({
      width: `${score}%`,
      transition: { duration: 1.5, ease: "easeOut" }
    })
  };
  
  // Animation variants for containers
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full"
    >
      <motion.div 
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Resume Analysis Results
        </h2>
        <p className="text-gray-600">
          Here's how your resume matches the job requirements
        </p>
      </motion.div>
      
      {/* Summary Card */}
      <motion.div
        className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${matchScore >= 70 ? 'bg-green-100' : matchScore >= 50 ? 'bg-blue-100' : 'bg-yellow-100'}`}>
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-8 w-8 ${matchScore >= 70 ? 'text-green-600' : matchScore >= 50 ? 'text-blue-600' : 'text-yellow-600'}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
              >
                {matchScore >= 70 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : matchScore >= 50 ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                )}
              </motion.svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {matchScore >= 70 ? 'Strong Match' : matchScore >= 50 ? 'Moderate Match' : 'Potential Match'}
              </h3>
              <p className="text-sm text-gray-600">
                {matchScore >= 70 ? 
                  'Your resume shows excellent alignment with the job requirements.' : 
                  matchScore >= 50 ? 
                  'Your resume shows good potential but could be improved.' : 
                  'Your resume may need significant improvements to match this role.'}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(matchScore)}`}>{matchScore}%</div>
              <div className="text-xs text-gray-500">Overall</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getScoreColor(skillMatchScore)}`}>{skillMatchScore}%</div>
              <div className="text-xs text-gray-500">Skills</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">{confidenceScore}%</div>
              <div className="text-xs text-gray-500">Confidence</div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Overall Match Score */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-gray-500 text-sm font-medium mb-2">Overall Match Score</h3>
          <div className="flex items-end space-x-2 mb-3">
            <span className={`text-3xl font-bold ${getScoreColor(matchScore)}`}>{matchScore}%</span>
            <span className="text-gray-400 text-sm mb-1">match</span>
          </div>
          
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${getScoreBgColor(matchScore)}`}
              variants={progressVariants}
              custom={matchScore}
              initial="hidden"
              animate="visible"
            />
          </div>
        </motion.div>
        
        {/* Skill Match Score */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-gray-500 text-sm font-medium mb-2">Skill Match Score</h3>
          <div className="flex items-end space-x-2 mb-3">
            <span className={`text-3xl font-bold ${getScoreColor(skillMatchScore)}`}>{skillMatchScore}%</span>
            <span className="text-gray-400 text-sm mb-1">match</span>
          </div>
          
          <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div 
              className={`h-full ${getScoreBgColor(skillMatchScore)}`}
              variants={progressVariants}
              custom={skillMatchScore}
              initial="hidden"
              animate="visible"
            />
          </div>
        </motion.div>
      </div>
      
      {/* Matched Skills */}
      <motion.div 
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 col-span-1 md:col-span-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h3 className="text-gray-700 font-semibold">Matched Skills</h3>
            <p className="text-gray-500 text-sm mt-1">
              {results.matched_skills.length > 0 
                ? `Found ${results.matched_skills.length} matching skills on your resume` 
                : 'No matching skills found on your resume'}
            </p>
          </div>
          
          {results.matched_skills.length > 0 && (
            <div className="mt-2 md:mt-0">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg className="mr-1.5 h-2 w-2 text-green-400" fill="currentColor" viewBox="0 0 8 8">
                  <circle cx="4" cy="4" r="3" />
                </svg>
                Skills Match
              </span>
            </div>
          )}
        </div>
        
        {results.matched_skills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {results.matched_skills.map((skill, index) => (
              <motion.div 
                key={index}
                className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + (index * 0.05) }}
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 truncate">{skill}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h4 className="text-sm font-medium text-yellow-800 mb-1">No Skills Matched</h4>
              <p className="text-xs text-yellow-700">
                Consider updating your resume to include relevant skills for this position.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* ML Prediction */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex flex-col">
            <h3 className="text-gray-700 font-semibold mb-1">ML Prediction</h3>
            <p className="text-gray-500 text-sm mb-4">Machine learning assessment of resume fit</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <motion.div 
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${
                    results.prediction.toLowerCase().includes('suitable') ? 'bg-green-100' : 'bg-red-100'
                  }`}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.8 }}
                >
                  {results.prediction.toLowerCase().includes('suitable') ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </motion.div>
                <div className="ml-4">
                  <h4 className="font-medium text-gray-800">
                    {results.prediction.toLowerCase().includes('suitable') ? 'Suitable Candidate' : 'Not Suitable'}
                  </h4>
                  <p className={`text-sm ${
                    results.prediction.toLowerCase().includes('suitable') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {results.prediction}
                  </p>
                </div>
              </div>
              
              <motion.div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  results.prediction.toLowerCase().includes('suitable') 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                {results.prediction.toLowerCase().includes('suitable') ? 'Recommended' : 'Not Recommended'}
              </motion.div>
            </div>
            
            <motion.div 
              className={`mt-4 p-3 rounded-lg text-sm ${
                results.prediction.toLowerCase().includes('suitable') 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-red-50 text-red-700'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>
                  {results.prediction.toLowerCase().includes('suitable') 
                    ? 'Our ML model predicts this resume is a good match for the job requirements.' 
                    : 'Our ML model suggests this resume may not be the best fit for the job requirements.'}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* BERT Classification */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-col">
            <h3 className="text-gray-700 font-semibold mb-1">BERT Classification</h3>
            <p className="text-gray-500 text-sm mb-4">AI-powered resume classification</p>
            
            <div className="flex flex-col sm:flex-row items-center sm:justify-between">
              <div className="flex items-center mb-4 sm:mb-0">
                <motion.div 
                  className="relative w-20 h-20 mr-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, type: 'spring', stiffness: 100 }}
                >
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="16" fill="#f3f4f6" />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2.5"
                      strokeDasharray="100, 100"
                    />
                    <motion.path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={confidenceScore >= 70 ? '#10b981' : confidenceScore >= 50 ? '#3b82f6' : '#f59e0b'}
                      strokeWidth="2.5"
                      strokeDasharray={`${confidenceScore}, 100`}
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${confidenceScore}, 100` }}
                      transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                    />
                    <motion.text 
                      x="18" 
                      y="18" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      className="text-sm font-bold"
                      fill={confidenceScore >= 70 ? '#10b981' : confidenceScore >= 50 ? '#3b82f6' : '#f59e0b'}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.5 }}
                    >
                      {confidenceScore}%
                    </motion.text>
                  </svg>
                </motion.div>
                
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-800 text-lg">{results.bert_classification.label}</span>
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      confidenceScore >= 70 ? 'bg-green-100 text-green-800' : 
                      confidenceScore >= 50 ? 'bg-blue-100 text-blue-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {confidenceScore >= 70 ? 'High Confidence' : 
                       confidenceScore >= 50 ? 'Medium Confidence' : 
                       'Low Confidence'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    BERT AI model classification result
                  </p>
                </div>
              </div>
              
              <motion.div
                className="flex flex-col items-center justify-center bg-indigo-50 p-3 rounded-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="text-xs text-indigo-500 mb-1">Confidence Level</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                  <motion.div 
                    className={`h-2.5 rounded-full ${
                      confidenceScore >= 70 ? 'bg-green-500' : 
                      confidenceScore >= 50 ? 'bg-blue-500' : 
                      'bg-yellow-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${confidenceScore}%` }}
                    transition={{ duration: 1, delay: 1.3 }}
                  />
                </div>
                <div className="text-xs text-gray-500">Based on {confidenceScore}% confidence score</div>
              </motion.div>
            </div>
            
            <motion.div
              className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <div className="flex text-sm text-indigo-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                </svg>
                <span>
                  BERT is an advanced AI model that analyzes your resume text to determine its relevance to the job requirements. 
                  {confidenceScore >= 70 ? 
                    'The high confidence score indicates strong alignment with the position.' : 
                    confidenceScore >= 50 ? 
                    'The medium confidence score suggests reasonable alignment with the position.' : 
                    'The lower confidence score indicates potential misalignment with the position.'}
                </span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <motion.div 
          className="mt-10 mb-6 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6 text-center md:text-left">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Ready for your next step?</h3>
              <p className="text-gray-600 max-w-md">
                {matchScore >= 70 
                  ? 'Your resume shows strong potential for this position. Consider applying now!' 
                  : 'Want to improve your match score? Try updating your resume with more relevant skills and experience.'}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={onReset}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Upload Another Resume
              </motion.button>
              
              <motion.button
                className="px-6 py-3 bg-white text-indigo-600 border border-indigo-200 rounded-lg shadow-sm hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  // This could be used to download results or save them
                  alert('This feature would allow saving or downloading your results!');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Save Results
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ResultsDisplay;
