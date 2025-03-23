import React, { useState, useEffect, useRef } from 'react';
import './kgteacher.css';

const KnowledgeGraph = () => {
  const [graphData, setGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const graphRef = useRef(null);
  
  // Sample graph data structure (will be replaced by AI-generated data)
  const sampleGraphData = {
    nodes: [
      { id: 'ap-calculus', label: 'AP Calculus AB', type: 'main', x: 400, y: 300 },
      { id: 'functions', label: 'Functions', type: 'category', x: 250, y: 420 },
      { id: 'limits', label: 'Limits', type: 'category', x: 550, y: 420 },
      { id: 'differentiation', label: 'Differentiation', type: 'category', x: 550, y: 180 },
      { id: 'applications', label: 'Applications of Derivatives', type: 'category', x: 250, y: 180 },
      
      // Function nodes
      { id: 'types-of-functions', label: 'Types of Functions', type: 'subcategory', x: 150, y: 350 },
      { id: 'domain-range', label: 'Domain & Range', type: 'subcategory', x: 280, y: 490 },
      { id: 'graphs', label: 'Graphs & Transformations', type: 'subcategory', x: 180, y: 500 },
      { id: 'even-odd', label: 'Even/Odd Functions', type: 'subcategory', x: 320, y: 550 },
      { id: 'input-output', label: 'Input & Output', type: 'subcategory', x: 380, y: 490 },
      
      // Types of functions nodes
      { id: 'algebraic', label: 'Algebraic', type: 'topic', x: 50, y: 350 },
      { id: 'trigonometric', label: 'Trigonometric', type: 'topic', x: 50, y: 300 },
      { id: 'logarithmic', label: 'Log & Exp', type: 'topic', x: 50, y: 400 },
      { id: 'composite', label: 'Composite Functions', type: 'topic', x: 150, y: 420 },
      { id: 'inverse', label: 'Inverse Functions', type: 'topic', x: 80, y: 250 },
      { id: 'piecewise', label: 'Piecewise', type: 'topic', x: 30, y: 200 },
      
      // Limits nodes
      { id: 'continuity', label: 'Continuity of Functions', type: 'subcategory', x: 650, y: 350 },
      { id: 'sandwich', label: 'Sandwich Theorem', type: 'subcategory', x: 520, y: 350 },
      { id: 'lhopital', label: 'L\'Hopital\'s Rule', type: 'subcategory', x: 700, y: 410 },
      { id: 'discontinuous', label: 'Discontinuous Functions', type: 'subcategory', x: 650, y: 470 },
      
      // Discontinuous types
      { id: 'jump', label: 'Jump', type: 'topic', x: 580, y: 520 },
      { id: 'removable', label: 'Removable', type: 'topic', x: 650, y: 520 },
      { id: 'infinite', label: 'Infinite', type: 'topic', x: 720, y: 520 },
      
      // Differentiation nodes
      { id: 'first-principle', label: 'First Principle', type: 'subcategory', x: 480, y: 100 },
      { id: 'implicit', label: 'Implicit Differentiation', type: 'subcategory', x: 580, y: 100 },
      { id: 'basic-derivatives', label: 'Basic Derivatives', type: 'subcategory', x: 550, y: 250 },
      { id: 'chain-rule', label: 'Chain Rule', type: 'subcategory', x: 720, y: 160 },
      { id: 'product-rule', label: 'Product Rule', type: 'subcategory', x: 720, y: 200 },
      { id: 'quotient-rule', label: 'Quotient Rule', type: 'subcategory', x: 720, y: 120 },
      
      // Applications nodes
      { id: 'increasing-decreasing', label: 'Increasing/Decreasing Functions', type: 'subcategory', x: 250, y: 90 },
      { id: 'critical-points', label: 'Critical Points', type: 'subcategory', x: 100, y: 130 },
      { id: 'extrema', label: 'Equations of Tangents & Normals', type: 'subcategory', x: 380, y: 90 },
      { id: 'local-global', label: 'Local & Global Maxima & Minima', type: 'subcategory', x: 150, y: 50 },
    ],
    edges: [
      // Main connections
      { source: 'ap-calculus', target: 'functions' },
      { source: 'ap-calculus', target: 'limits' },
      { source: 'ap-calculus', target: 'differentiation' },
      { source: 'ap-calculus', target: 'applications' },
      
      // Functions connections
      { source: 'functions', target: 'types-of-functions' },
      { source: 'functions', target: 'domain-range' },
      { source: 'functions', target: 'graphs' },
      { source: 'functions', target: 'even-odd' },
      { source: 'functions', target: 'input-output' },
      
      // Types of functions connections
      { source: 'types-of-functions', target: 'algebraic' },
      { source: 'types-of-functions', target: 'trigonometric' },
      { source: 'types-of-functions', target: 'logarithmic' },
      { source: 'types-of-functions', target: 'composite' },
      { source: 'types-of-functions', target: 'inverse' },
      { source: 'types-of-functions', target: 'piecewise' },
      
      // Limits connections
      { source: 'limits', target: 'continuity' },
      { source: 'limits', target: 'sandwich' },
      { source: 'limits', target: 'lhopital' },
      { source: 'limits', target: 'discontinuous' },
      
      // Discontinuous types connections
      { source: 'discontinuous', target: 'jump' },
      { source: 'discontinuous', target: 'removable' },
      { source: 'discontinuous', target: 'infinite' },
      
      // Differentiation connections
      { source: 'differentiation', target: 'first-principle' },
      { source: 'differentiation', target: 'implicit' },
      { source: 'differentiation', target: 'basic-derivatives' },
      { source: 'differentiation', target: 'chain-rule' },
      { source: 'differentiation', target: 'product-rule' },
      { source: 'differentiation', target: 'quotient-rule' },
      
      // Applications connections
      { source: 'applications', target: 'increasing-decreasing' },
      { source: 'applications', target: 'critical-points' },
      { source: 'applications', target: 'extrema' },
      { source: 'applications', target: 'local-global' },
    ]
  };

  useEffect(() => {
    // In a real application, this would be the result of AI processing
    // For now we'll use the sample data
    setGraphData(sampleGraphData);
  }, []);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  // Function to determine node color based on type
  const getNodeColor = (type) => {
    switch (type) {
      case 'main':
        return '#FFD700'; // Gold
      case 'category':
        return '#90EE90'; // Light green
      case 'subcategory':
        return '#90EE90'; // Light green
      case 'topic':
        return '#90EE90'; // Light green
      default:
        return '#90EE90'; // Default light green
    }
  };

  return (
    <div className="knowledge-graph-container">
      <div className="graph-controls">
        <div className="zoom-controls">
          <button onClick={handleZoomOut}>-</button>
          <button onClick={handleResetZoom}>Reset</button>
          <button onClick={handleZoomIn}>+</button>
        </div>
      </div>
      
      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#FFD700' }}></div>
          <span>Main Topic</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: '#90EE90' }}></div>
          <span>Subtopic</span>
        </div>
      </div>

      <div className="graph-info">
        <h3>AP Calculus AB Knowledge Graph</h3>
        <p>Generated from syllabus</p>
      </div>

      <div className="graph-actions">
        <button className="action-button">Export</button>
        <button className="action-button">Share</button>
        <button className="action-button">Edit</button>
      </div>

      <div className="graph-viewport">
        {isLoading ? (
          <div className="loading-indicator">
            <span>Generating knowledge graph...</span>
          </div>
        ) : (
          <div 
            className="graph-container" 
            ref={graphRef}
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {graphData && (
              <>
                {/* Render edges first so they appear behind nodes */}
                {graphData.edges.map((edge, index) => {
                  const sourceNode = graphData.nodes.find(node => node.id === edge.source);
                  const targetNode = graphData.nodes.find(node => node.id === edge.target);
                  
                  if (sourceNode && targetNode) {
                    return (
                      <div 
                        key={`edge-${index}`}
                        className="graph-edge"
                        style={{
                          left: `${Math.min(sourceNode.x, targetNode.x)}px`,
                          top: `${Math.min(sourceNode.y, targetNode.y)}px`,
                          width: `${Math.abs(targetNode.x - sourceNode.x)}px`,
                          height: `${Math.abs(targetNode.y - sourceNode.y)}px`,
                        }}
                      >
                        <svg width="100%" height="100%">
                          <line
                            x1={sourceNode.x > targetNode.x ? Math.abs(targetNode.x - sourceNode.x) : 0}
                            y1={sourceNode.y > targetNode.y ? Math.abs(targetNode.y - sourceNode.y) : 0}
                            x2={sourceNode.x < targetNode.x ? Math.abs(targetNode.x - sourceNode.x) : 0}
                            y2={sourceNode.y < targetNode.y ? Math.abs(targetNode.y - sourceNode.y) : 0}
                            stroke="#ccc"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    );
                  }
                  return null;
                })}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeGraph;