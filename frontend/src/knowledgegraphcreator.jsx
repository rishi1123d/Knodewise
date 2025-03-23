import React, { useState } from 'react';
import './styles.css';

const KnowledgeGraphCreator = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [graphTitle, setGraphTitle] = useState('Course Knowledge Graph');
  const [file, setFile] = useState(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleGenerateGraph = () => {
    // In a real app, this would send the file to an API
    console.log('Generating graph for:', file?.name);
    // Navigate to the graph visualization
  };

  return (
    <div className="knowledge-graph-creator">
      <div className="kg-header">
        <h1 className="kg-title">Knowledge Graph Creator</h1>
        <p className="kg-description">
          Create interactive knowledge graphs from your syllabus to
          visualize course connections
        </p>
      </div>
      
      <div className="kg-tabs">
        <button 
          className={`kg-tab ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => handleTabChange('upload')}
        >
          Upload Syllabus
        </button>
        <button 
          className={`kg-tab ${activeTab === 'paste' ? 'active' : ''}`}
          onClick={() => handleTabChange('paste')}
        >
          Paste Content
        </button>
        <button 
          className={`kg-tab ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => handleTabChange('preview')}
        >
          Preview
        </button>
      </div>
      
      <div className="kg-content">
        {activeTab === 'upload' && (
          <div className="upload-section">
            <h2 className="section-title">Upload Your Syllabus</h2>
            
            <div className="info-box">
              <div className="info-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              </div>
              <div className="info-content">
                <h3 className="info-title">How This Works</h3>
                <p className="info-description">
                  Upload your syllabus PDF and our AI will analyze the content to create
                  a visual knowledge graph. The AI identifies key topics, subtopics, and
                  their relationships to help students understand the course structure
                  and connections between concepts.
                </p>
              </div>
            </div>
            
            <div className="upload-form">
              <div className="form-group">
                <label className="form-label">Upload Syllabus (PDF recommended)</label>
                <div className="file-upload">
                  <button className="file-button">
                    <svg className="upload-icon" viewBox="0 0 24 24">
                      <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
                    </svg>
                    Choose file
                  </button>
                  <input 
                    type="file" 
                    id="syllabus-upload" 
                    className="hidden-input"
                    onChange={handleFileUpload}
                    accept=".pdf,.docx,.txt"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Knowledge Graph Title</label>
                <input
                  type="text"
                  className="text-input"
                  value={graphTitle}
                  onChange={(e) => setGraphTitle(e.target.value)}
                  placeholder="Enter a title for your knowledge graph"
                />
              </div>
              
              <button 
                className="generate-button"
                onClick={handleGenerateGraph}
                disabled={!file}
              >
                <svg className="generate-icon" viewBox="0 0 24 24">
                  <path d="M12 3l.01 10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4.01 4c2.21 0 3.99-1.79 3.99-4v-10h4V3h-6zm-1.99 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
                </svg>
                Generate Knowledge Graph
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'paste' && (
          <div className="paste-section">
            <h2 className="section-title">Paste Syllabus Content</h2>
            <p className="section-description">
              Don't have a PDF? Paste your syllabus content directly here.
            </p>
            
            <textarea 
              className="content-textarea"
              placeholder="Paste your syllabus content here..."
            ></textarea>
            
            <button className="generate-button">
              <svg className="generate-icon" viewBox="0 0 24 24">
                <path d="M12 3l.01 10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4.01 4c2.21 0 3.99-1.79 3.99-4v-10h4V3h-6zm-1.99 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
              </svg>
              Generate Knowledge Graph
            </button>
          </div>
        )}
        
        {activeTab === 'preview' && (
          <div className="preview-section">
            <h2 className="section-title">Preview Knowledge Graph</h2>
            <p className="section-description">
              Your generated knowledge graph will appear here.
            </p>
            
            <div className="graph-placeholder">
              <svg className="placeholder-icon" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
              <p className="placeholder-text">Generate a knowledge graph first</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeGraphCreator;