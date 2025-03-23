import React, { useState, useEffect, useRef, useCallback } from 'react';

const MultivariableCalculusTree = () => {
  // State for nodes and their connections
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const svgRef = useRef(null);
  const treeContainerRef = useRef(null);

  // Create the initial tree structure with Multivariable Calculus data
  useEffect(() => {
    if (nodes.length === 0) {
      const initialNodes = [];

      // Root node (leftmost)
      const rootNode = {
        id: 'root',
        type: 'root',
        name: 'Math 211 - Multivariable Calculus',
        x: 150,
        y: 200,
        children: ['section-a', 'section-b', 'section-c', 'section-d'],
        expanded: false,
        questions: [],
        progress: { correct: 5, total: 21 } // Representing approx 1/4 completion
      };
      initialNodes.push(rootNode);

      // Main sections (middle column)
      const sectionA = {
        id: 'section-a',
        type: 'directory',
        name: 'A. Vectors and Parameterization',
        x: 400,
        y: 100,
        parentId: 'root',
        children: ['topic-a1', 'topic-a2', 'topic-a3', 'topic-a4', 'topic-a5'],
        expanded: false,
        questions: [],
        progress: { correct: 5, total: 5 } // Fully completed section
      };
      initialNodes.push(sectionA);

      const sectionB = {
        id: 'section-b',
        type: 'directory',
        name: 'B. Differentiation',
        x: 400,
        y: 250,
        parentId: 'root',
        children: ['topic-b1', 'topic-b2', 'topic-b3', 'topic-b4', 'topic-b5', 'topic-b6', 'topic-b7', 'topic-b8'],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 8 } // No completed topics in this section
      };
      initialNodes.push(sectionB);

      const sectionC = {
        id: 'section-c',
        type: 'directory',
        name: 'C. Multiple Integrals',
        x: 400,
        y: 350,
        parentId: 'root',
        children: [],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 5 }, // Locked section
        locked: true
      };
      initialNodes.push(sectionC);

      const sectionD = {
        id: 'section-d',
        type: 'directory',
        name: 'D. Vector Calculus',
        x: 400,
        y: 450,
        parentId: 'root',
        children: [],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 6 }, // Locked section
        locked: true
      };
      initialNodes.push(sectionD);

      // Topics for Section A (reduced to match 1/4 coverage)
      // Only showing first 2 topics as fully completed
      const topicA1 = {
        id: 'topic-a1',
        type: 'leaf',
        name: 'A.1 Multivariable Functions',
        x: 650,
        y: 60,
        parentId: 'section-a',
        children: [],
        expanded: false,
        questions: [
          { id: 'q-a1-1', text: 'What is the domain of f(x,y) = ln(1-x²-y²)?', correct: true },
          { id: 'q-a1-2', text: 'Define a multivariable function and give an example.', correct: true },
          { id: 'q-a1-3', text: 'What is the range of f(x,y) = x² + y²?', correct: true }
        ],
        progress: { correct: 3, total: 3 }
      };
      initialNodes.push(topicA1);

      const topicA2 = {
        id: 'topic-a2',
        type: 'leaf',
        name: 'A.2 Vector Algebra and Matrices',
        x: 650,
        y: 130,
        parentId: 'section-a',
        children: [],
        expanded: false,
        questions: [
          { id: 'q-a2-1', text: 'Calculate |3i + 4j - 5k|', correct: true },
          { id: 'q-a2-2', text: 'Find the matrix product AB if A = [[1,2],[3,4]] and B = [[5,6],[7,8]]', correct: true },
          { id: 'q-a2-3', text: 'What are the properties of a unit vector?', correct: true }
        ],
        progress: { correct: 3, total: 3 }
      };
      initialNodes.push(topicA2);

      // The remaining topics in section A are locked
      const topicA3 = {
        id: 'topic-a3',
        type: 'leaf',
        name: 'A.3 Dot Product and Cross Product',
        x: 650,
        y: 200,
        parentId: 'section-a',
        children: [],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 0 },
        locked: true
      };
      initialNodes.push(topicA3);

      const topicA4 = {
        id: 'topic-a4',
        type: 'leaf',
        name: 'A.4 Parameterized Curves',
        x: 650,
        y: 270,
        parentId: 'section-a',
        children: [],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 0 },
        locked: true
      };
      initialNodes.push(topicA4);

      const topicA5 = {
        id: 'topic-a5',
        type: 'leaf',
        name: 'A.5 Derivatives and Arc Length',
        x: 650,
        y: 340,
        parentId: 'section-a',
        children: [],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 0 },
        locked: true
      };
      initialNodes.push(topicA5);

      // All topics in Section B are now locked
      const topicB1 = {
        id: 'topic-b1',
        type: 'leaf',
        name: 'B.1 Graphs and Level Sets',
        x: 650,
        y: 410,
        parentId: 'section-b',
        children: [],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 0 },
        locked: true
      };
      initialNodes.push(topicB1);

      const topicB2 = {
        id: 'topic-b2',
        type: 'leaf',
        name: 'B.2 Equations of Lines and Planes',
        x: 650,
        y: 480,
        parentId: 'section-b',
        children: [],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 0 },
        locked: true
      };
      initialNodes.push(topicB2);

      const topicB3 = {
        id: 'topic-b3',
        type: 'leaf',
        name: 'B.3 Continuity and Limits',
        x: 650,
        y: 550,
        parentId: 'section-b',
        children: [],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 0 },
        locked: true
      };
      initialNodes.push(topicB3);

      setNodes(initialNodes);
    }
  }, [nodes.length]);

  // Helper function to find a node by its ID
  const findNodeById = (id, nodesList) => {
    return nodesList.find(node => node.id === id);
  };

  // Draw connector lines
  const renderConnections = useCallback(() => {
    const connections = [];
    
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        node.children.forEach(childId => {
          const childNode = findNodeById(childId, nodes);
          if (childNode) {
            connections.push(
              <line
                key={`${node.id}-${childId}`}
                x1={node.x}
                y1={node.y}
                x2={childNode.x}
                y2={childNode.y}
                stroke="#2a9d8f"
                strokeWidth="2"
              />
            );
          }
        });
      }
    });
    
    return connections;
  }, [nodes]);

  // Toggle node expansion
  const toggleNodeExpansion = (nodeId) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId && !node.locked ? { ...node, expanded: !node.expanded } : node
      )
    );
    setSelectedNode(nodeId);
  };

  // Calculate the percentage for progress display
  const calculatePercentage = (correct, total) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  // Get color based on progress percentage
  const getProgressColor = (correct, total) => {
    if (total === 0) return '#6c757d'; // Gray for no progress
    
    const percentage = (correct / total) * 100;
    
    if (percentage < 30) return '#d62828'; // Red
    if (percentage < 60) return '#f77f00'; // Orange
    if (percentage < 85) return '#fcbf49'; // Yellow
    return '#38b000'; // Green
  };

  // Mark a question as correct or incorrect
  const markQuestion = (nodeId, questionId, isCorrect) => {
    setNodes(prevNodes => {
      // First update the specific question
      const updatedNodes = prevNodes.map(node => {
        if (node.id === nodeId) {
          const updatedQuestions = node.questions.map(q => 
            q.id === questionId ? { ...q, correct: isCorrect } : q
          );
          
          const correct = updatedQuestions.filter(q => q.correct === true).length;
          const total = updatedQuestions.length;
          
          return { 
            ...node, 
            questions: updatedQuestions,
            progress: { correct, total }
          };
        }
        return node;
      });
      
      // Then update all parent nodes recursively
      const updateParentProgress = (nodesList, childId) => {
        const childNode = nodesList.find(n => n.id === childId);
        if (!childNode || !childNode.parentId) return nodesList;
        
        const parentNode = nodesList.find(n => n.id === childNode.parentId);
        if (!parentNode) return nodesList;
        
        // Calculate total progress across all children
        let totalCorrect = 0;
        let totalQuestions = 0;
        
        parentNode.children.forEach(id => {
          const child = nodesList.find(n => n.id === id);
          if (child) {
            totalCorrect += child.progress.correct;
            totalQuestions += child.progress.total;
          }
        });
        
        // Update parent's progress
        const updatedList = nodesList.map(n => 
          n.id === parentNode.id ? 
            { ...n, progress: { correct: totalCorrect, total: totalQuestions } } : 
            n
        );
        
        // Continue up the tree if there are more parents
        if (parentNode.parentId) {
          return updateParentProgress(updatedList, parentNode.id);
        }
        
        return updatedList;
      };
      
      return updateParentProgress(updatedNodes, nodeId);
    });
  };

  // Render a node based on its type
  const renderNode = (node) => {
    // Define node sizes based on type
    let nodeWidth, nodeHeight;
    
    if (node.type === 'root') {
      nodeWidth = 220;
      nodeHeight = 90;
    } else if (node.type === 'directory') {
      nodeWidth = 160;
      nodeHeight = 70;
    } else { // leaf
      nodeWidth = 120;
      nodeHeight = 60;
    }
    
    const radius = 10;
    
    // Base node style
    const nodeStyle = {
      position: 'absolute',
      left: `${node.x - nodeWidth / 2}px`,
      top: `${node.y - nodeHeight / 2}px`,
      width: `${nodeWidth}px`,
      height: `${nodeHeight}px`,
      borderRadius: `${radius}px`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e9ecef',
      border: `2px solid ${node.locked ? '#aaaaaa' : '#2a9d8f'}`,
      cursor: node.locked ? 'not-allowed' : 'pointer',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      zIndex: 10,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      fontSize: node.type === 'root' ? '16px' : (node.type === 'directory' ? '14px' : '12px'),
      opacity: node.locked ? 0.7 : 1,
      padding: '5px'
    };

    // Add customizations based on node type
    if (node.type === 'root') {
      nodeStyle.backgroundColor = '#e0f3f5';
      nodeStyle.border = '3px solid #2a9d8f';
      nodeStyle.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
      nodeStyle.fontWeight = 'bold';
    } else if (node.type === 'directory') {
      nodeStyle.backgroundColor = node.locked ? '#e6e6e6' : '#d8f3dc';
      nodeStyle.fontWeight = 'bold';
    } else if (node.type === 'leaf') {
      nodeStyle.backgroundColor = node.locked ? '#e6e6e6' : '#f1faee';
    }

    // If the node is expanded, adjust the height to show questions
    if (node.expanded && node.type === 'leaf' && !node.locked) {
      const expandedHeight = nodeHeight + (node.questions.length * 35) + 40; // Extra space for add button
      nodeStyle.height = `${expandedHeight}px`;
      nodeStyle.top = `${node.y - expandedHeight / 2}px`;
      nodeStyle.zIndex = 20;
      nodeStyle.width = '220px'; // Make expanded leaf nodes wider
      nodeStyle.left = `${node.x - 110}px`; // Center the expanded node
    }

    const renderNodeContent = () => {
      return (
        <>
          {/* Node Title */}
          <div 
            style={{ 
              fontWeight: 'inherit', 
              marginBottom: '5px',
              padding: '0 5px',
              textAlign: 'center',
              fontSize: node.type === 'root' ? '16px' : (node.type === 'directory' ? '14px' : '12px')
            }}
          >
            {node.locked && <span style={{ marginRight: '5px' }}>🔒</span>}
            <span>{node.name}</span>
          </div>
          
          {/* Progress Display */}
          {!node.locked && (
            <div style={{ 
              backgroundColor: getProgressColor(node.progress.correct, node.progress.total),
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: node.type === 'root' ? '14px' : '12px',
              color: '#fff',
              marginTop: '4px'
            }}>
              {node.type === 'leaf' ? 
                `${node.progress.correct}/${node.progress.total}` : 
                `${calculatePercentage(node.progress.correct, node.progress.total)}%`
              }
            </div>
          )}
          
          {/* Expanded Leaf Node Questions */}
          {node.expanded && node.type === 'leaf' && !node.locked && (
            <div style={{ 
              marginTop: '10px', 
              width: '100%', 
              padding: '0 10px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              {node.questions.length === 0 ? (
                <div style={{ fontStyle: 'italic', color: '#999', fontSize: '11px', marginBottom: '10px' }}>
                  No questions added
                </div>
              ) : (
                node.questions.map(q => (
                  <div key={q.id} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    width: '100%',
                    marginBottom: '5px',
                    padding: '5px',
                    backgroundColor: 'rgba(255,255,255,0.5)',
                    borderRadius: '5px',
                    fontSize: '11px'
                  }}>
                    <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {q.text}
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          markQuestion(node.id, q.id, true);
                        }}
                        style={{
                          backgroundColor: q.correct === true ? '#38b000' : '#ccc',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '12px',
                          color: 'white'
                        }}
                      >
                        ✓
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          markQuestion(node.id, q.id, false);
                        }}
                        style={{
                          backgroundColor: q.correct === false ? '#d62828' : '#ccc',
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          fontSize: '12px',
                          color: 'white'
                        }}
                      >
                        ✗
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      );
    };

    return (
      <div
        key={node.id}
        style={nodeStyle}
        onClick={() => toggleNodeExpansion(node.id)}
        className={`knowledge-node ${node.type} ${node.expanded ? 'expanded' : ''} ${node.locked ? 'locked' : ''}`}
      >
        {renderNodeContent()}
      </div>
    );
  };

  return (
    <div className="knowledge-tree-container" style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'hidden', background: '#f5f5f5' }}>
      <div ref={treeContainerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
        {/* SVG for connection lines */}
        <svg 
          ref={svgRef}
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%',
            zIndex: 1
          }}
        >
          {renderConnections()}
        </svg>
        
        {/* Render nodes */}
        <div style={{ position: 'relative', width: '100%', height: '100%', zIndex: 2 }}>
          {nodes.map(node => renderNode(node))}
        </div>
      </div>
      
      <div style={{ position: 'absolute', bottom: '20px', left: '20px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <p style={{ fontSize: '14px', marginBottom: '5px' }}><strong>Legend:</strong></p>
        <p style={{ fontSize: '12px', margin: '2px 0' }}>🔒 Locked (not yet covered in class)</p>
        <p style={{ fontSize: '12px', margin: '2px 0' }}><span style={{ backgroundColor: '#38b000', color: 'white', padding: '1px 4px', borderRadius: '3px' }}>85-100%</span> - Mastered</p>
        <p style={{ fontSize: '12px', margin: '2px 0' }}><span style={{ backgroundColor: '#fcbf49', color: 'white', padding: '1px 4px', borderRadius: '3px' }}>60-84%</span> - Learning</p>
        <p style={{ fontSize: '12px', margin: '2px 0' }}><span style={{ backgroundColor: '#f77f00', color: 'white', padding: '1px 4px', borderRadius: '3px' }}>30-59%</span> - Needs Work</p>
        <p style={{ fontSize: '12px', margin: '2px 0' }}><span style={{ backgroundColor: '#d62828', color: 'white', padding: '1px 4px', borderRadius: '3px' }}>0-29%</span> - Not Started</p>
      </div>
      
      <style jsx>{`
        .knowledge-node {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .knowledge-node:hover:not(.locked) {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          z-index: 30;
        }
        
        .knowledge-node.locked {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default MultivariableCalculusTree;