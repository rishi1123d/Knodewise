import React, { useState, useEffect, useRef, useCallback } from 'react';

const MultivariableCalculusTreeStudent = () => {
  // State for nodes and their connections
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [nodeMoved, setNodeMoved] = useState(false);
  const svgRef = useRef(null);
  const treeContainerRef = useRef(null);

  // Create the initial tree structure with Multivariable Calculus data
  useEffect(() => {
    if (nodes.length === 0) {
      // Initialize with the same data as before...
      // This part remains unchanged
      const initialNodes = [];

      // Root node (leftmost)
      const rootNode = {
        id: 'root',
        type: 'root',
        name: 'Math 250: Multivariable Calculus',
        x: 150,
        y: 300,
        children: ['section-a', 'section-b', 'section-c', 'section-d'],
        expanded: false,
        questions: [],
        progress: { correct: 5, total: 50 } // Representing approx 1/4 completion
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
        progress: { correct: 6, total: 25 } 
      };
      initialNodes.push(sectionA);

      const sectionB = {
        id: 'section-b',
        type: 'directory',
        name: 'B. Differentiation',
        x: 400,
        y: 350,
        parentId: 'root',
        children: ['topic-b1', 'topic-b2', 'topic-b3', 'topic-b4'],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 20 }
      };
      initialNodes.push(sectionB);

      const sectionC = {
        id: 'section-c',
        type: 'directory',
        name: 'C. Multiple Integrals',
        x: 400,
        y: 550,
        parentId: 'root',
        children: [],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 5 },
        locked: true
      };
      initialNodes.push(sectionC);

      const sectionD = {
        id: 'section-d',
        type: 'directory',
        name: 'D. Vector Calculus',
        x: 400,
        y: 650,
        parentId: 'root',
        children: [],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 6 },
        locked: true
      };
      initialNodes.push(sectionD);

      // Topics for Section A with comprehensive examples
      const topicA1 = {
        id: 'topic-a1',
        type: 'leaf',
        name: 'A.1 Multivariable Functions',
        x: 700,
        y: 50, // Adjusted positioning
        parentId: 'section-a',
        children: [],
        expanded: false,
        questions: [
          { id: 'q-a1-1', text: 'What is the domain of f(x,y) = ln(1-x²-y²)?', correct: true },
          { id: 'q-a1-2', text: 'Define a multivariable function and give an example.', correct: true },
          { id: 'q-a1-3', text: 'What is the range of f(x,y) = x² + y²?', correct: true },
          { id: 'q-a1-4', text: 'When is a multivariable function considered bounded?', correct: false },
          { id: 'q-a1-5', text: 'Sketch the surface z = xy', correct: false }
        ],
        progress: { correct: 3, total: 5 }
      };
      initialNodes.push(topicA1);

      const topicA2 = {
        id: 'topic-a2',
        type: 'leaf',
        name: 'A.2 Vector Algebra and Matrices',
        x: 700,
        y: 110, // Adjusted positioning
        parentId: 'section-a',
        children: [],
        expanded: false,
        questions: [
          { id: 'q-a2-1', text: 'Calculate |3i + 4j - 5k|', correct: true },
          { id: 'q-a2-2', text: 'Find the matrix product AB if A = [[1,2],[3,4]] and B = [[5,6],[7,8]]', correct: true },
          { id: 'q-a2-3', text: 'What are the properties of a unit vector?', correct: true },
          { id: 'q-a2-4', text: 'Find the determinant of a 2×2 matrix [[a,b],[c,d]]', correct: false },
          { id: 'q-a2-5', text: 'When is a matrix considered invertible?', correct: false }
        ],
        progress: { correct: 3, total: 5 }
      };
      initialNodes.push(topicA2);

      const topicA3 = {
        id: 'topic-a3',
        type: 'leaf',
        name: 'A.3 Dot Product and Cross Product',
        x: 700,
        y: 170, // Adjusted positioning
        parentId: 'section-a',
        children: [],
        expanded: false,
        questions: [
          { id: 'q-a3-1', text: 'Calculate the dot product of <2,3,4> and <1,-1,2>', correct: true },
          { id: 'q-a3-2', text: 'Find the cross product of <1,0,0> and <0,1,0>', correct: true },
          { id: 'q-a3-3', text: 'What is the geometric interpretation of the dot product?', correct: false }
        ],
        progress: { correct: 2, total: 3 }
      };
      initialNodes.push(topicA3);

      const topicA4 = {
        id: 'topic-a4',
        type: 'leaf',
        name: 'A.4 Parameterized Curves',
        x: 700,
        y: 230, // Adjusted positioning
        parentId: 'section-a',
        children: [],
        expanded: false,
        questions: [
          { id: 'q-a4-1', text: 'Parameterize the line from (1,2,3) to (4,5,6)', correct: true },
          { id: 'q-a4-2', text: 'Parameterize a circle of radius 3 centered at the origin in the xy-plane', correct: true },
          { id: 'q-a4-3', text: 'What is the velocity vector for the curve r(t) = <t², t³, t> at t=2?', correct: false },
          { id: 'q-a4-4', text: 'Parameterize a helix that makes 2 complete turns between z=0 and z=4', correct: false },
          { id: 'q-a4-5', text: 'Find a parameterization of the sphere x² + y² + z² = 16', correct: false }
        ],
        progress: { correct: 2, total: 5 }
      };
      initialNodes.push(topicA4);

      const topicA5 = {
        id: 'topic-a5',
        type: 'leaf',
        name: 'A.5 Derivatives and Arc Length',
        x: 700,
        y: 290, // Adjusted positioning
        parentId: 'section-a',
        children: [],
        expanded: false,
        questions: [
          { id: 'q-a5-1', text: 'Calculate the arc length of r(t) = <t, t², t³> for 0 ≤ t ≤ 1', correct: false },
          { id: 'q-a5-2', text: 'Find the unit tangent vector for r(t) = <cos t, sin t, t> at t=π/4', correct: true }
        ],
        progress: { correct: 1, total: 2 }
      };
      initialNodes.push(topicA5);

      // Topics for Section B with comprehensive examples
      const topicB1 = {
        id: 'topic-b1',
        type: 'leaf',
        name: 'B.1 Graphs and Level Sets',
        x: 700,
        y: 350, // Adjusted positioning
        parentId: 'section-b',
        children: [],
        expanded: false,
        questions: [
          { id: 'q-b1-1', text: 'Describe the level sets of f(x,y) = x² + y²', correct: true },
          { id: 'q-b1-2', text: 'Sketch the level curves of f(x,y) = xy for c = -2, 0, and 2', correct: false },
          { id: 'q-b1-3', text: 'Describe the graph of z = x² - y²', correct: false },
          { id: 'q-b1-4', text: 'What is the relationship between level curves and contour plots?', correct: true }
        ],
        progress: { correct: 2, total: 4 }
      };
      initialNodes.push(topicB1);

      const topicB2 = {
        id: 'topic-b2',
        type: 'leaf',
        name: 'B.2 Equations of Lines and Planes',
        x: 700,
        y: 410, // Adjusted positioning
        parentId: 'section-b',
        children: [],
        expanded: false,
        questions: [
          { id: 'q-b2-1', text: 'Find the equation of the plane passing through (1,2,3) with normal vector <3,2,1>', correct: true },
          { id: 'q-b2-2', text: 'Write the symmetric equations for the line through (2,3,4) in the direction <1,1,1>', correct: false },
          { id: 'q-b2-3', text: 'Find the distance from the point (2,2,2) to the plane x + y + z = 3', correct: false }
        ],
        progress: { correct: 1, total: 3 }
      };
      initialNodes.push(topicB2);

      const topicB3 = {
        id: 'topic-b3',
        type: 'leaf',
        name: 'B.3 Continuity and Limits',
        x: 700,
        y: 470, // Adjusted positioning
        parentId: 'section-b',
        children: [],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 0 },
        locked: true
      };
      initialNodes.push(topicB3);

      const topicB4 = {
        id: 'topic-b4',
        type: 'leaf',
        name: 'B.4 Partial Derivatives and Linearization',
        x: 700,
        y: 530, // Adjusted positioning
        parentId: 'section-b',
        children: [],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 0 },
        locked: true
      };
      initialNodes.push(topicB4);

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
  const toggleNodeExpansion = useCallback((nodeId) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId ? { ...node, expanded: !node.expanded } : node
      )
    );
    setSelectedNode(nodeId);
  }, []);

  // Calculate the percentage for progress display
  const calculatePercentage = (correct, total) => {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  // Get color based on progress percentage
  const getProgressColor = (correct, total, locked) => {
    if (locked) return '#6c757d'; // Gray for locked nodes
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

  // Handle node dragging - improved to better distinguish between clicks and drags
  const handleMouseDown = useCallback((e, nodeId) => {
    // Don't start dragging if clicked on a button or input
    if (
      e.target.tagName.toLowerCase() === 'button' ||
      e.target.tagName.toLowerCase() === 'input' ||
      e.target.closest('.questions-list') ||
      e.target.classList.contains('node-action')
    ) {
      return;
    }

    const node = findNodeById(nodeId, nodes);
    if (!node) return;

    const containerRect = treeContainerRef.current.getBoundingClientRect();
    const clientX = e.clientX - containerRect.left;
    const clientY = e.clientY - containerRect.top;
    
    setDragStart({ x: clientX, y: clientY });
    setDraggedNode(nodeId);
    setDragOffset({ 
      x: clientX - node.x, 
      y: clientY - node.y 
    });
    setNodeMoved(false);
    
    e.preventDefault();
    e.stopPropagation();
  }, [nodes]);

  const handleMouseMove = useCallback((e) => {
    if (!draggedNode) return;

    const containerRect = treeContainerRef.current.getBoundingClientRect();
    const clientX = e.clientX - containerRect.left;
    const clientY = e.clientY - containerRect.top;
    
    // Calculate distance moved
    const dx = clientX - dragStart.x;
    const dy = clientY - dragStart.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Set nodeMoved if moved more than 5 pixels
    if (distance > 5) {
      setNodeMoved(true);
    }
    
    // Update node position
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === draggedNode ? { 
          ...node, 
          x: clientX - dragOffset.x, 
          y: clientY - dragOffset.y 
        } : node
      )
    );
    
    e.preventDefault();
    e.stopPropagation();
  }, [draggedNode, dragOffset, dragStart]);

  const handleMouseUp = useCallback((e) => {
    if (!draggedNode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // If the node wasn't moved significantly, treat it as a click
    if (!nodeMoved) {
      toggleNodeExpansion(draggedNode);
    }
    
    // Reset drag state
    setDraggedNode(null);
    setNodeMoved(false);
  }, [draggedNode, nodeMoved, toggleNodeExpansion]);

  // Set up event listeners
  useEffect(() => {
    if (draggedNode) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [draggedNode, handleMouseMove, handleMouseUp]);

  // Get node style based on its type and state
  const getNodeStyle = (node) => {
    // Define node sizes based on type
    let nodeWidth, nodeHeight;
    
    if (node.type === 'root') {
      nodeWidth = 220;
      nodeHeight = 120; // Increased from 90
    } else if (node.type === 'directory') {
      nodeWidth = 180;
      nodeHeight = 100; // Increased from 70
    } else { // leaf
      nodeWidth = 220;  // Wider leaf nodes
      nodeHeight = 60;  // Taller leaf nodes - increased from 50
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
      cursor: 'pointer',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      zIndex: 10,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      fontSize: node.type === 'root' ? '16px' : (node.type === 'directory' ? '14px' : '12px'),
      opacity: 1,
      padding: '5px'
    };

    // Add customizations based on node type
    if (node.type === 'root') {
      nodeStyle.backgroundColor = '#e0f3f5';
      nodeStyle.border = '3px solid #2a9d8f';
      nodeStyle.boxShadow = '0 3px 10px rgba(0,0,0,0.2)';
      nodeStyle.fontWeight = 'bold';
    } else if (node.type === 'directory') {
      nodeStyle.backgroundColor = node.locked ? '#d0d0d0' : '#d8f3dc';
      nodeStyle.fontWeight = 'bold';
    } else if (node.type === 'leaf') {
      nodeStyle.backgroundColor = node.locked ? '#d0d0d0' : '#f1faee';
    }

    // If the node is expanded, adjust the height to show questions
    if (node.expanded && node.type === 'leaf') {
      const expandedHeight = nodeHeight + (node.questions.length * 35) + 40; // Extra space for add button
      nodeStyle.height = `${expandedHeight}px`;
      nodeStyle.top = `${node.y - expandedHeight / 2}px`;
      nodeStyle.zIndex = 20;
      nodeStyle.width = '280px'; // Make expanded leaf nodes wider
      nodeStyle.left = `${node.x - 140}px`; // Center the expanded node
    }
    
    if (node.id === draggedNode) {
      nodeStyle.opacity = 0.8;
      nodeStyle.zIndex = 100;
      nodeStyle.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
    }
    
    return nodeStyle;
  };

  const renderNodeContent = (node) => {
    return (
      <>
        {/* Node Title */}
        <div 
          style={{ 
            fontWeight: 'inherit', 
            marginBottom: '5px',
            padding: '0 5px',
            textAlign: 'center',
            fontSize: node.type === 'root' ? '16px' : (node.type === 'directory' ? '14px' : '12px'),
            width: '100%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: node.type === 'leaf' ? 'normal' : 'nowrap'
          }}
        >
          {node.locked && <span style={{ marginRight: '5px' }}>🔒</span>}
          <span>{node.name}</span>
        </div>
        
        {/* Progress Display */}
        <div style={{ 
          backgroundColor: getProgressColor(node.progress.correct, node.progress.total, node.locked),
          padding: '2px 8px',
          borderRadius: '10px',
          fontSize: node.type === 'root' ? '14px' : '12px',
          color: '#fff',
          marginTop: '4px'
        }}>
          {node.locked ? 
            'Locked' : 
            (node.type === 'leaf' ? 
              `${node.progress.correct}/${node.progress.total}` : 
              `${calculatePercentage(node.progress.correct, node.progress.total)}%`
            )
          }
        </div>
        
        {/* Expanded Leaf Node Questions */}
        {node.expanded && node.type === 'leaf' && (
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
    <div className="knowledge-tree-container" style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'auto', background: '#f5f5f5' }}>
      <div 
        ref={treeContainerRef} 
        style={{ 
          width: '2000px', 
          height: '1500px', 
          position: 'relative',
          minWidth: '100%',
          minHeight: '100%'
        }}
      >
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
          {nodes.map(node => {
            const baseNodeProps = {
              key: node.id,
              style: getNodeStyle(node),
              onMouseDown: (e) => handleMouseDown(e, node.id),
              className: `knowledge-node ${node.type} ${node.expanded ? 'expanded' : ''} ${node.locked ? 'locked' : ''} ${draggedNode === node.id ? 'dragging' : ''}`
            };
            
            return (
              <div {...baseNodeProps}>
                {renderNodeContent(node)}
              </div>
            );
          })}
        </div>
      </div>
      
      <div style={{ position: 'fixed', bottom: '20px', left: '20px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', zIndex: 1000 }}>
        <p style={{ fontSize: '14px', marginBottom: '5px' }}><strong>Legend:</strong></p>
        <p style={{ fontSize: '12px', margin: '2px 0' }}>🔒 Locked (not yet covered in class)</p>
        <p style={{ fontSize: '12px', margin: '2px 0' }}><span style={{ backgroundColor: '#38b000', color: 'white', padding: '1px 4px', borderRadius: '3px' }}>85-100%</span> - Mastered</p>
        <p style={{ fontSize: '12px', margin: '2px 0' }}><span style={{ backgroundColor: '#fcbf49', color: 'white', padding: '1px 4px', borderRadius: '3px' }}>60-84%</span> - Learning</p>
        <p style={{ fontSize: '12px', margin: '2px 0' }}><span style={{ backgroundColor: '#f77f00', color: 'white', padding: '1px 4px', borderRadius: '3px' }}>30-59%</span> - Needs Work</p>
        <p style={{ fontSize: '12px', margin: '2px 0' }}><span style={{ backgroundColor: '#d62828', color: 'white', padding: '1px 4px', borderRadius: '3px' }}>0-29%</span> - Not Started</p>
      </div>
      
      {/* Instructions tooltip */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', zIndex: 1000, maxWidth: '300px' }}>
        <p style={{ fontSize: '14px', marginBottom: '5px' }}><strong>Controls:</strong></p>
        <p style={{ fontSize: '12px', margin: '2px 0' }}>• Drag nodes to reposition them</p>
        <p style={{ fontSize: '12px', margin: '2px 0' }}>• Click on leaf nodes to expand and see questions</p>
        <p style={{ fontSize: '12px', margin: '2px 0' }}>• Mark questions ✓ or ✗ to update your progress</p>
      </div>
    </div>
  );
};

export default MultivariableCalculusTreeStudent;