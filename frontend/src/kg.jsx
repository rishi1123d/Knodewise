import React, { useState, useEffect } from 'react';
import './kg.css';
import { useNavigate } from 'react-router-dom';

const KnowledgeTree = () => {
  const navigate = useNavigate();
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5));
  };

  const handleAutoLayout = () => {
    // Implement auto-layout logic here
    console.log('Auto-layout triggered');
  };

  return (
    <div className="knowledge-tree-container">
      <div className="status">
        Drag any node to reposition it. Click the Auto-Layout button to organize your mind map.
      </div>

      <div className="mind-map-container">
        <div className="mind-map" style={{ transform: `scale(${zoom})` }}>
          {/* Root Node - AP Calculus BC */}
          <div className="node root-node">
            <div className="node-content">
              <h2>AP Calculus BC</h2>
              <div className="understanding-level">
                <span>Understanding Level: 85%</span>
              </div>
            </div>

            {/* Main Branches */}
            <div className="branches">
              {/* Limits & Continuity Branch */}
              <div className="branch limits-branch">
                <div className="node topic-node limits-topic">
                  <div className="node-content">
                    <h3>Limits & Continuity</h3>
                    <div className="progress-pill green">
                      <span>88%</span>
                    </div>
                  </div>
                  
                  {/* Sub-branches for Limits & Continuity */}
                  <div className="sub-branches limits-sub">
                    <div className="sub-branch limits-at-point-branch">
                      <div className="node subtopic-node limits-at-point">
                        <div className="node-content">
                          <h4>Limits at a point</h4>
                          <div className="progress-pill green">
                            <span>95%</span>
                          </div>
                        </div>
                        
                        {/* Concepts under Limits at a point */}
                        <div className="concept-branches">
                          <div className="concept-node one-sided">
                            <span>One-sided limits</span>
                            <span className="score">4/5</span>
                          </div>
                          <div className="concept-node infinite-limits">
                            <span>Infinite Limits</span>
                            <span className="score">6/7</span>
                          </div>
                          <div className="concept-node limits-infinity">
                            <span>Limits at infinity</span>
                            <span className="score">5/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="sub-branch continuity-branch">
                      <div className="node subtopic-node continuity">
                        <div className="node-content">
                          <h4>Continuity</h4>
                          <div className="progress-pill yellow">
                            <span>66%</span>
                          </div>
                        </div>
                        
                        {/* Concepts under Continuity */}
                        <div className="concept-branches">
                          <div className="concept-node removable">
                            <span>Removable</span>
                            <span className="score">3/6</span>
                          </div>
                          <div className="concept-node jump">
                            <span>Jump</span>
                            <span className="score">4/6</span>
                          </div>
                          <div className="concept-node infinite">
                            <span>Infinite</span>
                            <span className="score">5/6</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Derivatives Branch */}
              <div className="branch derivatives-branch">
                <div className="node topic-node derivatives-topic">
                  <div className="node-content">
                    <h3>Derivatives</h3>
                    <div className="progress-pill green">
                      <span>93%</span>
                    </div>
                  </div>
                  
                  {/* Sub-branches for Derivatives */}
                  <div className="sub-branches derivatives-sub">
                    <div className="sub-branch derivative-rules-branch">
                      <div className="node subtopic-node derivative-rules">
                        <div className="node-content">
                          <h4>Derivative Rules</h4>
                          <div className="progress-pill red">
                            <span>35%</span>
                          </div>
                        </div>
                        
                        {/* Concepts under Derivative Rules */}
                        <div className="concept-branches">
                          <div className="concept-node power-rule">
                            <span>Power Rule</span>
                            <span className="score">1/3</span>
                          </div>
                          <div className="concept-node product-rule">
                            <span>Product Rule</span>
                            <span className="score">1/3</span>
                          </div>
                          <div className="concept-node chain-rule">
                            <span>Chain Rule</span>
                            <span className="score">1/3</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Integration Techniques (Locked) */}
              <div className="branch integration-branch">
                <div className="node locked-node">
                  <div className="node-content">
                    <h3>Integration Techniques</h3>
                    <div className="lock-icon">
                      <i className="fa fa-lock"></i>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Differential Equations (Locked) */}
              <div className="branch differential-branch">
                <div className="node locked-node">
                  <div className="node-content">
                    <h3>Differential Equations</h3>
                    <div className="lock-icon">
                      <i className="fa fa-lock"></i>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Series (Locked) */}
              <div className="branch series-branch">
                <div className="node locked-node">
                  <div className="node-content">
                    <h3>Series</h3>
                    <div className="lock-icon">
                      <i className="fa fa-lock"></i>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Integrals (Locked) */}
              <div className="branch integrals-branch">
                <div className="node locked-node">
                  <div className="node-content">
                    <h3>Integrals</h3>
                    <div className="lock-icon">
                      <i className="fa fa-lock"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Node Form Overlay */}
      {showNodeForm && (
        <div className="node-form-overlay">
          <div className="node-form">
            <h3>Add New Node</h3>
            <div className="form-group">
              <label htmlFor="nodeName">Node Name:</label>
              <input type="text" id="nodeName" placeholder="Enter node name" />
            </div>
            <div className="form-group">
              <label>Node Type:</label>
              <div className="radio-group">
                <label>
                  <input type="radio" name="nodeType" value="directory" defaultChecked /> Directory
                </label>
                <label>
                  <input type="radio" name="nodeType" value="leaf" /> Leaf
                </label>
              </div>
            </div>
            <div className="form-actions">
              <button onClick={() => setShowNodeForm(false)}>Save</button>
              <button onClick={() => setShowNodeForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Question Form Overlay */}
      {showQuestionForm && (
        <div className="question-form-overlay">
          <div className="question-form">
            <h3>Add New Question</h3>
            <div className="form-group">
              <label htmlFor="questionText">Question:</label>
              <input type="text" id="questionText" placeholder="Enter question text" />
            </div>
            <div className="form-actions">
              <button onClick={() => setShowQuestionForm(false)}>Save</button>
              <button onClick={() => setShowQuestionForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="controls">
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
        <button onClick={handleAutoLayout}>Auto-Layout</button>
      </div>

      {/* AI Tutor button */}
      <button
        onClick={() => navigate('/ai-tutor')}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          padding: '12px 24px',
          backgroundColor: '#239434',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontFamily: 'Arial, sans-serif',
          fontSize: '16px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}
      >
        Help with AI
      </button>
    </div>
  );
};

export default KnowledgeTree;