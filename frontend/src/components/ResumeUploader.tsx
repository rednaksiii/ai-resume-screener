import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { ENDPOINTS, API_URL } from '../config';

interface ResumeUploaderProps {
  onUploadStart: () => void;
  onUploadComplete: (results: any) => void;
  jobDescription: string;
  setJobDescription: (description: string) => void;
}

interface FilePreview {
  name: string;
  size: number;
  type: string;
}

interface UploadProgress {
  status: 'idle' | 'uploading' | 'success' | 'error';
  percent: number;
}

const ResumeUploader = ({ onUploadStart, onUploadComplete, jobDescription, setJobDescription }: ResumeUploaderProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [filePreview, setFilePreview] = useState<FilePreview | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({ status: 'idle', percent: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Function to reset the form
  const resetForm = useCallback(() => {
    setFilePreview(null);
    setError(null);
    setUploadProgress({ status: 'idle', percent: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);
  
  // Function to test backend connection
  const testBackendConnection = useCallback(async () => {
    try {
      setError(null);
      setUploadProgress({ status: 'uploading', percent: 50 });
      
      // Log detailed information for debugging
      console.log('Testing connection to backend server');
      console.log('API URL:', API_URL);
      console.log('Health endpoint:', `${API_URL}/health`);
      
      // Use fetch with a timeout instead of axios
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      console.log('Sending fetch request...');
      const response = await fetch(`${API_URL}/health`, {
        method: 'GET',
        signal: controller.signal,
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Backend connection successful:', data);
      setUploadProgress({ status: 'success', percent: 100 });
      // Don't set any error message on success
      setError(null);
      return true;
    } catch (err: any) {
      console.error('❌ Backend connection failed:', err);
      setUploadProgress({ status: 'error', percent: 0 });
      
      // Provide more detailed error information
      if (err.name === 'AbortError') {
        setError(`Connection timeout: The backend server at ${API_URL} is not responding within 5 seconds.`);
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError(`Network error: Cannot reach the backend server at ${API_URL}. Please ensure it is running and accessible.`);
      } else {
        setError(`Cannot connect to backend server at ${API_URL}: ${err.message}`);
      }
      
      // Log additional debugging information
      console.log('Current origin:', window.location.origin);
      console.log('Target API:', API_URL);
      console.log('Error details:', err);
      
      return false;
    }
  }, []);
  
  // Test API connection on component mount
  useEffect(() => {
    testBackendConnection();
  }, [testBackendConnection]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    
    // Reset any previous errors
    setError(null);
    
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      setError('Invalid file type. Please upload a PDF or DOCX file.');
      return;
    }
    
    // Set file preview
    setFilePreview({
      name: file.name,
      size: file.size,
      type: file.type
    });
  }, [setError, setFilePreview]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false
  });

  // Update isDragging state based on dropzone state
  useEffect(() => {
    setIsDragging(isDragActive);
  }, [isDragActive]);
  
  // Add keyboard shortcut for pasting files
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const files = Array.from(e.clipboardData.files);
        const validFiles = files.filter(file => 
          file.type.includes('pdf') || file.type.includes('word') || file.type.includes('docx')
        );
        
        if (validFiles.length > 0) {
          onDrop(validFiles);
          e.preventDefault();
        }
      }
    };
    
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [onDrop]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="text-center mb-8">
        <motion.h2 
          className="text-2xl font-bold text-gray-800 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          AI Resume Screening
        </motion.h2>
        <motion.p 
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Enter job description and upload your resume for AI analysis
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 mb-8"
        >
          <label htmlFor="jobDescription" className="block text-left text-gray-700 font-medium mb-2">
            Job Description
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste or type the job description here..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[150px] text-gray-700"
            required
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 mb-6"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              testBackendConnection();
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
            type="button"
          >
            Test Backend Connection
          </button>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
              {error}
            </div>
          )}
        </motion.div>
      </div>
      
      <motion.div 
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-300 ${isDragging || isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload Your Resume</h3>
        <div {...getRootProps()} className="w-full h-full">
          <input {...getInputProps()} />
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                onDrop([e.target.files[0]]);
              }
            }}
          />
          
          <motion.div 
            className="flex flex-col items-center justify-center space-y-4"
            animate={isDragging || isDragActive ? { y: [0, -10, 0] } : {}}
            transition={{ repeat: isDragging ? Infinity : 0, duration: 1 }}
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            
            <div className="text-gray-700">
              <p className="font-medium">Drag & drop your resume here</p>
              <p className="text-sm text-gray-500 mt-1">or click to browse files</p>
              <p className="text-xs text-gray-400 mt-2">Supports PDF, DOCX</p>
              <div className="mt-2 flex items-center justify-center">
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-50 text-xs text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Tip: You can also paste (Ctrl+V) files directly
                </span>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Select Resume
              </button>
            </div>
            
            {filePreview && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
              >
                <div className="flex items-center">
                  <div className="mr-4 flex-shrink-0">
                    {filePreview.type.includes('pdf') ? (
                      <div className="bg-red-100 p-3 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 10.5a0.5 0.5 0 01.5-.5h3a0.5 0.5 0 010 1h-3a0.5 0.5 0 01-.5-.5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 13.5a0.5 0.5 0 01.5-.5h3a0.5 0.5 0 010 1h-3a0.5 0.5 0 01-.5-.5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 16.5a0.5 0.5 0 01.5-.5h3a0.5 0.5 0 010 1h-3a0.5 0.5 0 01-.5-.5z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 19h18" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15h18" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 11h18" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7h10" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-md font-semibold text-gray-900 truncate" title={filePreview.name}>
                      {filePreview.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500">{(filePreview.size / 1024).toFixed(2)} KB</span>
                      <span className="mx-1.5 text-gray-400">•</span>
                      <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                        {filePreview.type.includes('pdf') ? 'PDF' : 'DOCX'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        resetForm();
                      }}
                      className="mr-2 px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                      title="Reset selection"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setFilePreview(null);
                      }}
                      className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                      title="Remove file"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
      
      {(uploadProgress.status === 'uploading' || uploadProgress.status === 'success') && (
        <motion.div
          className="mt-6 w-full"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-blue-700">
              {uploadProgress.status === 'uploading' ? 'Uploading...' : 'Upload Complete!'}
            </span>
            <span className="text-sm font-medium text-blue-700">{uploadProgress.percent}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <motion.div 
              className={`h-2.5 rounded-full ${uploadProgress.status === 'success' ? 'bg-green-600' : 'bg-blue-600'}`} 
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress.percent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          {uploadProgress.status === 'success' && (
            <motion.div 
              className="flex justify-center mt-2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 15 }}
            >
              <div className="bg-green-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
      
      {error && (
        <motion.div 
          className="mt-4 p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center mb-2 sm:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
            <button
              onClick={resetForm}
              className="px-3 py-1.5 bg-white border border-red-300 text-red-600 text-sm font-medium rounded-md hover:bg-red-50 transition-colors"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      )}
      
      {/* Submit Button */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={() => {
            // Validate both job description and resume are provided
            if (!jobDescription || jobDescription.trim().length < 10) {
              setError('Please enter a detailed job description (at least 10 characters).');
              return;
            }
            
            if (!filePreview) {
              setError('Please upload a resume file (PDF or DOCX).');
              return;
            }
            
            // If we have both job description and file preview, manually create a File object
            // from the filePreview data and trigger the upload process
            if (filePreview) {
              // Log that we're starting the manual submission process
              console.log('Starting manual submission with job description and file preview');
              console.log('Job description length:', jobDescription.length);
              console.log('File preview:', filePreview.name);
              
              // Find the file in the input element if it exists
              let fileToUpload = null;
              
              if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
                fileToUpload = fileInputRef.current.files[0];
                console.log('Found file in input element:', fileToUpload.name);
              }
              
              if (fileToUpload) {
                // Create a new FormData object
                const formData = new FormData();
                formData.append('file', fileToUpload);
                formData.append('job_description', jobDescription);
                
                // Notify parent component that upload has started
                onUploadStart();
                
                // Set upload in progress
                setUploadProgress({ status: 'uploading', percent: 0 });
                
                // Use XMLHttpRequest for upload with progress tracking
                const xhr = new XMLHttpRequest();
                
                // Setup progress tracking
                xhr.upload.onprogress = (event) => {
                  if (event.lengthComputable) {
                    const percentCompleted = Math.round((event.loaded * 100) / event.total);
                    console.log(`Upload progress: ${percentCompleted}%`);
                    setUploadProgress({ status: 'uploading', percent: percentCompleted });
                  }
                };
                
                // Handle completion
                xhr.onload = function() {
                  if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                      const data = JSON.parse(xhr.responseText);
                      console.log('✅ Resume upload successful:', data);
                      setUploadProgress({ status: 'success', percent: 100 });
                      onUploadComplete(data);
                    } catch (e) {
                      console.error('Error parsing response:', e);
                      setError('Invalid response from server');
                      setUploadProgress({ status: 'error', percent: 0 });
                    }
                  } else {
                    console.error(`Server responded with status code ${xhr.status}`);
                    setError(`Server error: ${xhr.status}`);
                    setUploadProgress({ status: 'error', percent: 0 });
                  }
                };
                
                // Handle errors
                xhr.onerror = function() {
                  console.error('Network error during upload');
                  setError('Network error during upload');
                  setUploadProgress({ status: 'error', percent: 0 });
                };
                
                xhr.ontimeout = function() {
                  console.error('Upload request timed out');
                  setError('Upload timed out');
                  setUploadProgress({ status: 'error', percent: 0 });
                };
                
                // Open and send the request
                xhr.open('POST', ENDPOINTS.UPLOAD_RESUME, true);
                xhr.timeout = 30000; // 30 second timeout
                xhr.send(formData);
              } else {
                setError('Could not find the file to upload. Please try selecting the file again.');
              }
            }
          }}
          disabled={uploadProgress.status === 'uploading'}
          className={`w-full py-3 rounded-lg font-medium text-white ${
            uploadProgress.status === 'uploading' 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg transition-all'
          }`}
        >
          {uploadProgress.status === 'uploading' ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Analyze Resume with AI'
          )}
        </button>
        
        <div className="text-center mt-4 text-gray-500 text-sm">
          <p>Both job description and resume are required for analysis</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResumeUploader;
