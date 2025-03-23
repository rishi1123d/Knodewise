import React, { useState, useEffect, useRef, useCallback } from 'react';

const MultivariableCalculusTreeStudent = () => {
  // State for nodes and their connections
  const [nodes, setNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragDistance, setDragDistance] = useState(0);
  
  const svgRef = useRef(null);
  const treeContainerRef = useRef(null);
  const dragThreshold = 5; // Minimum distance in pixels to consider it a drag

  // Calculate the percentage for progress display with N/A handling
  const calculatePercentage = (correct, total, hasChildren, isLocked) => {
    if (isLocked || total === 0 || !hasChildren) return "N/A";
    return Math.round((correct / total) * 100) + "%";
  };

  // Get color based on progress percentage and lock status
  const getProgressColor = (correct, total, hasChildren, isLocked) => {
    if (isLocked || total === 0 || !hasChildren) return '#6c757d'; // Gray for locked, no progress or no children
    
    const percentage = (correct / total) * 100;
    
    if (percentage < 30) return '#d62828'; // Red
    if (percentage < 60) return '#f77f00'; // Orange
    if (percentage < 85) return '#fcbf49'; // Yellow
    return '#38b000'; // Green
  };

  // Create the initial tree structure with Multivariable Calculus data
  useEffect(() => {
    if (nodes.length === 0) {
      const initialNodes = [];

      // Root node (leftmost)
      const rootNode = {
        id: 'root',
        type: 'root',
        name: 'Math 250:\nMultivariable Calculus', // Added line break for better display
        x: 120, // Moved left from 150 to 120
        y: 300,
        children: ['section-a', 'section-b', 'section-c', 'section-d'],
        expanded: false,
        questions: [],
        progress: { correct: 5, total: 50 }, // Representing approx 1/4 completion
        hasChildren: true
      };
      initialNodes.push(rootNode);

      // Main sections (middle column) - Increased X distance from root
      const sectionA = {
        id: 'section-a',
        type: 'directory',
        name: 'A. Vectors and Parameterization',
        x: 450, // Increased from 350 to 450 for more space
        y: 100,
        parentId: 'root',
        children: ['topic-a1', 'topic-a2', 'topic-a3', 'topic-a4', 'topic-a5'],
        expanded: false,
        questions: [],
        progress: { correct: 6, total: 25 },
        hasChildren: true
      };
      initialNodes.push(sectionA);

      const sectionB = {
        id: 'section-b',
        type: 'directory',
        name: 'B. Differentiation',
        x: 450, // Increased from 350 to 450 for more space
        y: 350,
        parentId: 'root',
        children: ['topic-b1', 'topic-b2', 'topic-b3', 'topic-b4'],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 20 },
        hasChildren: true
      };
      initialNodes.push(sectionB);

      const sectionC = {
        id: 'section-c',
        type: 'directory',
        name: 'C. Multiple Integrals',
        x: 450, // Increased from 350 to 450 for more space
        y: 550,
        parentId: 'root',
        children: [],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 5 },
        locked: true,
        hasChildren: false
      };
      initialNodes.push(sectionC);

      const sectionD = {
        id: 'section-d',
        type: 'directory',
        name: 'D. Vector Calculus',
        x: 450, // Increased from 350 to 450 for more space
        y: 650,
        parentId: 'root',
        children: [],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 6 },
        locked: true,
        hasChildren: false
      };
      initialNodes.push(sectionD);

      // Topics for Section A with comprehensive examples - Increased X distance from directory nodes
      const topicA1 = {
        id: 'topic-a1',
        type: 'leaf',
        name: 'A.1 Multivariable Functions',
        x: 750, // Increased from 580 to 750 for more space
        y: 50, // Adjusted positioning
        parentId: 'section-a',
        children: [],
        expanded: false,
        questions: [
          { id: 'q-a1-1', text: 'What is the domain of f(x,y) = ln(1-x²-y²)?', correct: true },
          { id: 'q-a1-2', text: 'Define a multivariable function and give an example.', correct: true },
          { id: 'q-a1-3', text: 'What is the range of f(x,y) = x² + y²?', correct: true }
        ],
        progress: { correct: 3, total: 3 },
        hasChildren: true
      };
      initialNodes.push(topicA1);

      const topicA2 = {
        id: 'topic-a2',
        type: 'leaf',
        name: 'A.2 Vector Algebra and Matrices',
        x: 750, // Increased from 580 to 750 for more space
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
        progress: { correct: 3, total: 5 },
        hasChildren: true
      };
      initialNodes.push(topicA2);

      const topicA3 = {
        id: 'topic-a3',
        type: 'leaf',
        name: 'A.3 Dot Product and Cross Product',
        x: 750, // Increased from 580 to 750 for more space
        y: 170, // Adjusted positioning
        parentId: 'section-a',
        children: [],
        expanded: false,
        questions: [
          { id: 'q-a3-1', text: 'Find the angle between vectors [1,2,3] and [4,5,6]', correct: false },
          { id: 'q-a3-2', text: 'Calculate the cross product of [1,0,0] and [0,1,0]', correct: false },
          { id: 'q-a3-3', text: 'When are two vectors perpendicular?', correct: false },
          { id: 'q-a3-4', text: 'What is the geometric interpretation of the cross product?', correct: false }
        ],
        progress: { correct: 0, total: 4 },
        hasChildren: true
      };
      initialNodes.push(topicA3);

      const topicA4 = {
        id: 'topic-a4',
        type: 'leaf',
        name: 'A.4 Parameterized Curves',
        x: 750, // Increased from 580 to 750 for more space
        y: 230, // Adjusted positioning
        parentId: 'section-a',
        children: [],
        expanded: false,
        questions: [
          { id: 'q-a4-1', text: 'Parameterize a circle of radius 5 centered at the origin', correct: false },
          { id: 'q-a4-2', text: 'Find the parameterization of the line through (1,2,3) and (4,5,6)', correct: false }
        ],
        progress: { correct: 0, total: 2 },
        hasChildren: true
      };
      initialNodes.push(topicA4);

      const topicA5 = {
        id: 'topic-a5',
        type: 'leaf',
        name: 'A.5 Derivatives and Arc Length',
        x: 750, // Increased from 580 to 750 for more space
        y: 290, // Adjusted positioning
        parentId: 'section-a',
        children: [],
        expanded: false,
        questions: [
          { id: 'q-a5-1', text: 'Find the derivative of r(t) = (t², t³, t⁴) at t=1', correct: false },
          { id: 'q-a5-2', text: 'Calculate the arc length of r(t) = (t, t², t³) for t ∈ [0,1]', correct: false },
          { id: 'q-a5-3', text: 'What is the unit tangent vector?', correct: false }
        ],
        progress: { correct: 0, total: 3 },
        hasChildren: true
      };
      initialNodes.push(topicA5);

      // Topics for Section B with comprehensive examples
      const topicB1 = {
        id: 'topic-b1',
        type: 'leaf',
        name: 'B.1 Graphs and Level Sets',
        x: 750, // Increased from 580 to 750 for more space
        y: 350, // Adjusted positioning
        parentId: 'section-b',
        children: [],
        expanded: false,
        questions: [
          { id: 'q-b1-1', text: 'Sketch the level curves of f(x,y) = x² + y²', correct: false },
          { id: 'q-b1-2', text: 'What is the level set of f(x,y,z) = x + y + z at level 5?', correct: false },
          { id: 'q-b1-3', text: 'Describe the level curves of f(x,y) = x - y', correct: false },
          { id: 'q-b1-4', text: 'Identify the shape of level curves for f(x,y) = x² - y²', correct: false },
          { id: 'q-b1-5', text: 'How do you use level sets to visualize multivariable functions?', correct: false },
          { id: 'q-b1-6', text: 'What does it mean when level curves are close together?', correct: false }
        ],
        progress: { correct: 0, total: 6 },
        hasChildren: true
      };
      initialNodes.push(topicB1);

      const topicB2 = {
        id: 'topic-b2',
        type: 'leaf',
        name: 'B.2 Equations of Lines and Planes',
        x: 750, // Increased from 580 to 750 for more space
        y: 410, // Adjusted positioning
        parentId: 'section-b',
        children: [],
        expanded: false,
        questions: [
          { id: 'q-b2-1', text: 'Find the equation of a plane through (1,2,3) with normal vector [1,1,1]', correct: false },
          { id: 'q-b2-2', text: 'What is the vector equation of a line?', correct: false },
          { id: 'q-b2-3', text: 'Find the distance from point (2,3,4) to the plane x + y + z = 1', correct: false }
        ],
        progress: { correct: 0, total: 3 },
        hasChildren: true
      };
      initialNodes.push(topicB2);

      const topicB3 = {
        id: 'topic-b3',
        type: 'leaf',
        name: 'B.3 Continuity and Limits',
        x: 750, // Increased from 580 to 750 for more space
        y: 470, // Adjusted positioning
        parentId: 'section-b',
        children: [],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 0 },
        locked: true,
        hasChildren: false
      };
      initialNodes.push(topicB3);

      const topicB4 = {
        id: 'topic-b4',
        type: 'leaf',
        name: 'B.4 Partial Derivatives and Linearization',
        x: 750, // Increased from 580 to 750 for more space
        y: 530, // Adjusted positioning
        parentId: 'section-b',
        children: [],
        expanded: false,
        questions: [],
        progress: { correct: 0, total: 0 },
        locked: true,
        hasChildren: false
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

  // Removed toggleNodeExpansion from startDrag to separate click from drag
  const toggleNodeExpansion = useCallback((nodeId) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId ? { ...node, expanded: !node.expanded } : node
      )
    );
    setSelectedNode(nodeId);
  }, []);

  // Update progress for all directory and root nodes
  const updateParentProgress = () => {
    setNodes(prevNodes => {
      // Create a copy of the nodes
      const updatedNodes = [...prevNodes];
      
      // First handle leaf nodes to make sure their progress is up to date
      const leafNodes = updatedNodes.filter(n => n.type === 'leaf');
      leafNodes.forEach(leafNode => {
        if (leafNode.questions && leafNode.questions.length > 0) {
          const correct = leafNode.questions.filter(q => q.correct === true).length;
          const total = leafNode.questions.length;
          const nodeIndex = updatedNodes.findIndex(n => n.id === leafNode.id);
          if (nodeIndex !== -1) {
            updatedNodes[nodeIndex] = {
              ...updatedNodes[nodeIndex],
              progress: { correct, total }
            };
          }
        }
      });
      
      // Create a map to track the total corrects and totals for the entire tree
      const totalStats = {
        correct: 0,
        total: 0
      };
      
      // Count all unlocked leaf node stats for overall progress
      leafNodes.forEach(leafNode => {
        if (!leafNode.locked) {
          totalStats.correct += leafNode.progress.correct;
          totalStats.total += leafNode.progress.total;
        }
      });
      
      // Now process directory nodes from bottom up
      // First get all directory nodes and sort them by depth (children first)
      const directoryNodes = updatedNodes.filter(n => n.type === 'directory').sort((a, b) => {
        // Simple approximation: nodes with more child directories are likely deeper
        const aChildDirs = updatedNodes.filter(n => n.parentId === a.id && n.type === 'directory').length;
        const bChildDirs = updatedNodes.filter(n => n.parentId === b.id && n.type === 'directory').length;
        return bChildDirs - aChildDirs;
      });
      
      // Process each directory to update its progress
      directoryNodes.forEach(dirNode => {
        const childProgress = { correct: 0, total: 0 };
        let hasChildren = false;
        
        // Collect progress from direct children only if they are not locked
        dirNode.children.forEach(childId => {
          const childNode = updatedNodes.find(n => n.id === childId);
          if (childNode && !childNode.locked) {
            hasChildren = true;
            childProgress.correct += childNode.progress.correct;
            childProgress.total += childNode.progress.total;
          }
        });
        
        // Update this directory node's progress
        const nodeIndex = updatedNodes.findIndex(n => n.id === dirNode.id);
        if (nodeIndex !== -1) {
          updatedNodes[nodeIndex] = {
            ...updatedNodes[nodeIndex],
            progress: childProgress,
            hasChildren: hasChildren
          };
        }
      });
      
      // Finally, update the root node with overall stats from all unlocked leaf nodes
      const rootNode = updatedNodes.find(n => n.type === 'root');
      if (rootNode) {
        const rootIndex = updatedNodes.findIndex(n => n.id === rootNode.id);
        if (rootIndex !== -1) {
          updatedNodes[rootIndex] = {
            ...updatedNodes[rootIndex],
            progress: { 
              correct: totalStats.correct, 
              total: totalStats.total 
            },
            hasChildren: totalStats.total > 0
          };
        }
      }
      
      return updatedNodes;
    });
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
      
      return updatedNodes;
    });
    
    // Then update all parent nodes recursively
    setTimeout(() => updateParentProgress(), 0);
  };

  // Handle node dragging - all nodes can be dragged
  const startDrag = (e, nodeId) => {
    // Don't start dragging if clicked on a button or input
    if (
      e.target.tagName.toLowerCase() === 'button' ||
      e.target.tagName.toLowerCase() === 'input' ||
      e.target.closest('.questions-list')
    ) {
      return;
    }

    const node = findNodeById(nodeId, nodes);
    if (!node) return;

    const containerRect = treeContainerRef.current.getBoundingClientRect();
    const offsetX = e.clientX - containerRect.left - node.x;
    const offsetY = e.clientY - containerRect.top - node.y;
    
    setDraggedNode(nodeId);
    setDragOffset({ x: offsetX, y: offsetY });
    setDragDistance(0); // Reset drag distance
    
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrag = useCallback((e) => {
    if (!draggedNode) return;

    const containerRect = treeContainerRef.current.getBoundingClientRect();
    const x = e.clientX - containerRect.left - dragOffset.x;
    const y = e.clientY - containerRect.top - dragOffset.y;

    // Calculate drag distance using Euclidean distance
    const node = findNodeById(draggedNode, nodes);
    if (node) {
      const dx = x - node.x;
      const dy = y - node.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      setDragDistance(prevDistance => prevDistance + distance);
    }

    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === draggedNode ? { ...node, x, y } : node
      )
    );
    
    e.preventDefault();
    e.stopPropagation();
  }, [draggedNode, dragOffset.x, dragOffset.y, treeContainerRef, nodes]);

  const endDrag = useCallback((e) => {
    if (draggedNode) {
      e.preventDefault();
      e.stopPropagation();
      
      // Only toggle node expansion if it wasn't a significant drag
      if (dragDistance < dragThreshold) {
        toggleNodeExpansion(draggedNode);
      }
    }
    setDraggedNode(null);
  }, [draggedNode, dragDistance, toggleNodeExpansion, dragThreshold]);

  useEffect(() => {
    if (draggedNode) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', endDrag);
      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', endDrag);
      };
    }
  }, [draggedNode, handleDrag, endDrag]);

  // Get node style based on its type and state
  const getNodeStyle = (node) => {
    // Define node sizes based on type
    let nodeWidth, nodeHeight;
    
    if (node.type === 'root') {
      nodeWidth = 280; // Adjusted from 320 to 280
      nodeHeight = 140;
    } else if (node.type === 'directory') {
      nodeWidth = 180;
      nodeHeight = 100;
    } else { // leaf
      nodeWidth = 220;
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
      cursor: 'pointer', // All nodes are draggable
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      zIndex: 10,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      fontSize: node.type === 'root' ? '18px' : (node.type === 'directory' ? '14px' : '12px'),
      opacity: 1,
      padding: '5px'
    };

    // Add customizations based on node type and lock status
    if (node.type === 'root') {
      nodeStyle.backgroundColor = node.locked ? '#d0d0d0' : '#e0f3f5';
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
      // Calculate expanded height based on number of questions
      // Extra padding to ensure nothing gets cut off
      const questionsPadding = 80; // Increased padding for more space
      const expandedHeight = nodeHeight + (node.questions.length * 45) + questionsPadding;
      
      nodeStyle.height = `${expandedHeight}px`;
      // Shift the node up to ensure the expanded content is properly positioned
      nodeStyle.top = `${node.y - expandedHeight / 2}px`;
      nodeStyle.zIndex = 20;
      nodeStyle.width = '350px'; // Increased width from 280px to 350px
      nodeStyle.left = `${node.x - 175}px`; // Center the expanded node
      nodeStyle.maxHeight = '500px'; // Set a maximum height
      nodeStyle.overflowY = 'auto'; // Add vertical scrolling if needed
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
        {/* Node Title - larger and clearly visible */}
        <div 
          style={{ 
            fontWeight: 'inherit', 
            marginBottom: '5px',
            padding: '0 5px',
            textAlign: 'center',
            fontSize: node.type === 'root' ? '20px' : (node.type === 'directory' ? '14px' : '13px'), // Increased root font size
            width: '95%',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: node.type === 'root' ? 'pre-line' : (node.type === 'leaf' ? 'normal' : 'nowrap'),
            lineHeight: node.type === 'root' ? '1.3' : 'inherit',
          }}
        >
          {node.locked && <span style={{ marginRight: '5px' }}>🔒</span>}
          {node.name}
        </div>
        
        {/* Progress Display */}
        <div style={{ 
          backgroundColor: getProgressColor(node.progress.correct, node.progress.total, node.hasChildren, node.locked),
          padding: '2px 8px',
          borderRadius: '10px',
          fontSize: node.type === 'root' ? '14px' : '12px',
          color: '#fff',
          marginTop: '4px'
        }}>
          {node.locked ? 
            "Locked" : 
            (node.type === 'leaf' ? 
              `${node.progress.correct}/${node.progress.total}` : 
              calculatePercentage(node.progress.correct, node.progress.total, node.hasChildren, node.locked)
            )
          }
        </div>
        
        {/* Expanded Leaf Node Questions */}
        {node.expanded && node.type === 'leaf' && !node.locked && (
          <div style={{ 
            marginTop: '15px', // Increased top margin for better spacing 
            width: '95%',
            padding: '0 10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxHeight: '420px', // Max height for scrolling
            overflowY: 'auto',  // Add vertical scrolling
          }}>
            {node.questions.length === 0 ? (
              <div style={{ fontStyle: 'italic', color: '#999', fontSize: '11px', marginBottom: '12px' }}>
                No questions available
              </div>
            ) : (
              node.questions.map(q => (
                <div key={q.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: '100%',
                  marginBottom: '10px', // Increased margin between questions
                  padding: '8px',
                  backgroundColor: 'rgba(255,255,255,0.5)',
                  borderRadius: '5px',
                  fontSize: '12px'
                }}>
                  <div style={{ flex: 1, overflow: 'visible', padding: '0 5px' }}>
                    {q.text}
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
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
              onMouseDown: (e) => startDrag(e, node.id),
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
      
      <style jsx>{`
        .knowledge-tree-container {
          scroll-behavior: smooth;
        }
        
        .knowledge-node {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .knowledge-node:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          z-index: 30;
        }
        
        .knowledge-node.locked {
          cursor: default;
          opacity: 0.8;
        }
        
        .knowledge-node.dragging {
          cursor: grabbing !important;
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default MultivariableCalculusTreeStudent;