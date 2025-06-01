# AI Resume Screener - Frontend

## Overview

This is the frontend application for the AI-Powered Resume Screener. It provides a modern, animated user interface for uploading resumes and displaying the analysis results from the FastAPI backend.

## Features

- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Animated Interface**: Smooth transitions and animations using Framer Motion
- **Responsive Design**: Fully mobile-friendly interface
- **File Upload**: Drag and drop resume upload for PDF and DOCX files
- **Visual Results**: Animated progress bars, gauges, and visual indicators for analysis results

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- Backend API running (FastAPI application)

### Installation

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Configuration

The API endpoint URL can be configured in the `src/config.ts` file. By default, it points to `http://localhost:8000`.

## Usage

1. Ensure the FastAPI backend is running
2. Upload a resume (PDF or DOCX format)
3. View the detailed analysis results with animated visualizations

## Technologies Used

- React with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API requests
- React Dropzone for file uploads
