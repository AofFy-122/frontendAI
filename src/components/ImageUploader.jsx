'use client';

import React, { useState, useRef } from 'react';
import styles from './ImageUploader.module.css';

export default function ImageUploader() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      handleFile(droppedFile);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile) => {
    // Only accept images
    if (!selectedFile.type.match('image.*')) {
      setError('Please select an image file (.jpg, .png, etc.)');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    setResult(null);
    
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(selectedFile);
  };

  const handlePredict = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      // In production, NEXT_PUBLIC_API_URL will point to Render's URL.
      // In local development, the fallback will point to localhost.
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      
      const response = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to analyze image');
      }
      
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred during prediction');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (preview) {
    return (
      <div className={styles.previewContainer}>
        <div className={styles.imageWrapper}>
          <img src={preview} alt="Preview" className={styles.image} />
        </div>
        
        {error && <div style={{color: '#ff4d4f'}}>{error}</div>}
        
        {isLoading ? (
          <div className={styles.resultCard + ' ' + styles.glassPanel}>
            <div className={styles.spinner}></div>
            <div className={styles.loadingText}>Analyzing Flower...</div>
          </div>
        ) : result ? (
          <div className={`${styles.resultCard} glass-panel`}>
            <div className={styles.resultTitle}>This looks like a</div>
            <div className={`${styles.prediction} title-gradient`}>
              {result.prediction}
            </div>
            
            <div className={styles.confidenceContainer}>
              <div 
                className={styles.confidenceBar} 
                style={{width: `${result.confidence}%`}}
              ></div>
            </div>
            <div className={styles.confidenceText}>
              {result.confidence}% Confidence
            </div>
            
            <div className={styles.buttonGroup} style={{justifyContent: 'center'}}>
              <button className={`${styles.button} ${styles.secondaryButton}`} onClick={handleReset}>
                Try Another Flower
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.buttonGroup}>
            <button 
              className={`${styles.button} ${styles.secondaryButton}`} 
              onClick={handleReset}
            >
              Cancel
            </button>
            <button 
              className={`${styles.button} ${styles.primaryButton}`} 
              onClick={handlePredict}
            >
              Identify Flower
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div 
        className={`${styles.dropzone} ${isDragging ? styles.active : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="image/*"
          className={styles.input}
          onChange={handleChange}
          ref={fileInputRef}
        />
        <div className={styles.content}>
          <svg className={styles.icon} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 13v5c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-5H3l8-9 8 9h-2zm-6-6v7h-2V7h2z"/>
          </svg>
          <div className={styles.text}>Drag & Drop your flower image here</div>
          <div className={styles.subtext}>or click to browse files</div>
        </div>
      </div>
      {error && <div style={{color: '#ff4d4f', textAlign: 'center'}}>{error}</div>}
    </div>
  );
}
