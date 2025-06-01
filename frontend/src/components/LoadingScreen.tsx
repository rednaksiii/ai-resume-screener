import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const steps = [
    "Extracting text from document...",
    "Calculating similarity scores...",
    "Matching skills to requirements...",
    "Running ML predictions...",
    "Generating final results..."
  ];
  
  // Simulate progress through the steps
  useEffect(() => {
    const totalSteps = steps.length;
    const stepDuration = 2000; // 2 seconds per step
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 1;
        
        // Update current step based on progress percentage
        const progressPercent = newProgress / 100;
        const newStep = Math.min(
          Math.floor(progressPercent * totalSteps),
          totalSteps - 1
        );
        
        if (newStep !== currentStep) {
          setCurrentStep(newStep);
        }
        
        // Reset interval when we reach 100%
        if (newProgress >= 100) {
          clearInterval(timer);
        }
        
        return Math.min(newProgress, 100);
      });
    }, stepDuration / 20); // Divide by 20 to get smoother progress updates
    
    return () => clearInterval(timer);
  }, [currentStep, steps.length]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="relative w-24 h-24 mb-8">
        {/* Animated circles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-transparent border-t-blue-500"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 0.2,
            }}
            style={{ opacity: 1 - i * 0.2 }}
          />
        ))}
        
        {/* Document icon in the middle */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center text-blue-600"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </motion.div>
      </div>
      
      <motion.h3 
        className="text-xl font-semibold text-gray-800 mb-2"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        Analyzing Your Resume
      </motion.h3>
      
      {/* Progress bar */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between mb-1 text-xs text-gray-500">
          <span>Analysis Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <motion.div 
            className="bg-blue-600 h-2.5 rounded-full" 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>
      
      <div className="space-y-3 w-full max-w-md">
        {/* Animated progress steps */}
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <motion.div 
              key={index}
              className={`flex items-center space-x-3 ${isActive ? 'text-blue-700' : isCompleted ? 'text-gray-500' : 'text-gray-400'}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <motion.div 
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  isCompleted ? 'bg-green-500' : 
                  isActive ? 'bg-blue-500' : 
                  'bg-gray-200'
                }`}
                animate={isActive ? {
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    '0 0 0 0 rgba(59, 130, 246, 0.5)',
                    '0 0 0 4px rgba(59, 130, 246, 0.2)',
                    '0 0 0 0 rgba(59, 130, 246, 0.5)'
                  ]
                } : {}}
                transition={{ 
                  repeat: isActive ? Infinity : 0, 
                  duration: 2
                }}
              >
                {isCompleted ? (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-3 w-3 text-white" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : isActive ? (
                  <motion.div 
                    className="w-2 h-2 bg-white rounded-full" 
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                ) : (
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                )}
              </motion.div>
              <div className="flex-1">
                <span className={`text-sm font-medium ${isActive ? 'text-blue-700' : isCompleted ? 'text-gray-700' : 'text-gray-500'}`}>
                  {step}
                </span>
                {isActive && (
                  <motion.div 
                    className="h-0.5 bg-blue-500 mt-1" 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2 }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <motion.p 
        className="text-gray-500 text-sm mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {progress < 30 && "This may take a few moments..."}
        {progress >= 30 && progress < 70 && "Almost there, analyzing your qualifications..."}
        {progress >= 70 && progress < 95 && "Finalizing your results..."}
        {progress >= 95 && "Ready to display your results!"}
      </motion.p>
    </motion.div>
  );
};

export default LoadingScreen;
