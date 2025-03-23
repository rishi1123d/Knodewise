import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';

const MindMap = () => {
  // State for the mind map data
  const [mindMapData, setMindMapData] = useState({
    nodes: {},
    connections: []
  });
  
  // Refs
  const mindMapRef = useRef(null);
  const nodeNameInputRef = useRef(null);
  const questionTextInputRef = useRef(null);
  
  // State for node form
  const [nodeFormVisible, setNodeFormVisible] = useState(false);
  const [nodeName, setNodeName] = useState('');
  const [nodeType, setNodeType] = useState('directory');
  const [parentId, setParentId] = useState(null);
  
  // State for question form
  const [questionFormVisible, setQuestionFormVisible] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [currentNodeId, setCurrentNodeId] = useState(null);
  
  // State for zoom
  const [currentScale, setCurrentScale] = useState(1);
  
  // Completely rewritten connector function with pixel-perfect accuracy
const createConnector = (fromId, toId) => {
  // Get DOM elements
  const fromNode = document.getElementById(fromId);
  const toNode = document.getElementById(toId);
  
  if (!fromNode || !toNode) return;
  
  // Get actual node positions in the document
  const fromRect = fromNode.getBoundingClientRect();
  const toRect = toNode.getBoundingClientRect();
  const containerRect = mindMapRef.current.getBoundingClientRect();
  
  // Calculate center points relative to container
  const fromCenterX = fromRect.left + (fromRect.width / 2) - containerRect.left;
  const fromCenterY = fromRect.top + (fromRect.height / 2) - containerRect.top;
  const toCenterX = toRect.left + (toRect.width / 2) - containerRect.left;
  const toCenterY = toRect.top + (toRect.height / 2) - containerRect.top;
  
  // Calculate connector properties
  const dx = toCenterX - fromCenterX;
  const dy = toCenterY - fromCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  
  // Create connector element
  const connector = document.createElement('div');
  connector.className = 'connector';
  connector.style.width = `${distance}px`;
  connector.style.left = `${fromCenterX}px`;
  connector.style.top = `${fromCenterY}px`;
  connector.style.transform = `rotate(${angle}deg)`;
  
  mindMapRef.current.appendChild(connector);
};
  
  // Improved drawConnectors function with better verification
  const drawConnectors = useCallback(() => {
    if (!mindMapRef.current) return;
    
    // Remove existing connectors
    const existingConnectors = mindMapRef.current.querySelectorAll('.connector');
    existingConnectors.forEach(el => el.remove());
    
    // Ensure all nodes exist in DOM before attempting to create connections
    // This helps prevent timing issues where connections are attempted
    // before nodes are rendered
    setTimeout(() => {
      // Create each connector
      mindMapData.connections.forEach(conn => {
        // Verify both nodes exist before attempting to draw connector
        const fromExists = document.getElementById(conn.from);
        const toExists = document.getElementById(conn.to);
        
        if (fromExists && toExists) {
          createConnector(conn.from, conn.to);
        }
      });
    }, 0);
  }, [mindMapData.connections, createConnector]);
  
  // Memoize the collapseAllNodes function - must be defined before it's used
  const collapseAllNodes = useCallback(() => {
    const expandedNodes = document.querySelectorAll('.node.expanded');
    expandedNodes.forEach(node => {
      node.classList.remove('expanded');
      const questionsList = node.querySelector('.questions-list');
      if (questionsList) {
        questionsList.classList.remove('visible');
      }
    });
  }, []);
  
  // Initialize the mind map with a root node
  useEffect(() => {
    createRootNode();
    
    // Center the mind map in the viewport
    if (mindMapRef.current) {
      const mindMap = mindMapRef.current;
      const container = mindMap.parentElement;
      
      // Calculate the center offsets
      mindMap.style.top = '0';
      mindMap.style.left = '0';
    }
  }, []);
  
  // Focus input field when node form becomes visible
  useEffect(() => {
    if (nodeFormVisible && nodeNameInputRef.current) {
      setTimeout(() => {
        nodeNameInputRef.current.focus();
      }, 50);
    }
  }, [nodeFormVisible]);
  
  // Focus input field when question form becomes visible
  useEffect(() => {
    if (questionFormVisible && questionTextInputRef.current) {
      setTimeout(() => {
        questionTextInputRef.current.focus();
      }, 50);
    }
  }, [questionFormVisible]);
  
  // Update connectors when nodes or connections change
  useEffect(() => {
    if (Object.keys(mindMapData.nodes).length > 0) {
      // Delay slightly to ensure nodes are rendered in DOM
      const timer = setTimeout(() => {
        drawConnectors();
      }, 50);
      
      return () => clearTimeout(timer);
    }
  }, [mindMapData.nodes, mindMapData.connections, drawConnectors]);
  
  // Function to create the initial root node (simplified)
  const createRootNode = () => {
    // Create root node data with a centered position
    setMindMapData({
      nodes: {
        root: {
          id: 'root',
          title: 'Root Node', // Default title
          type: 'root',
          children: [],
          depth: 0,
          position: { 
            top: 800, // Center vertical position
            left: 1200 // Center horizontal position
          }
        }
      },
      connections: []
    });
  };
  
  // Function to show the node form
  const showNodeForm = (pId) => {
    setParentId(pId);
    setNodeName('');
    setNodeType('directory');
    setNodeFormVisible(true);
  };
  
  // Function to hide the node form
  const hideNodeForm = () => {
    setNodeFormVisible(false);
  };
  
  // Function to save the node form
  const saveNodeForm = () => {
    if (nodeName.trim()) {
      // Create new node
      createNode(parentId, nodeName.trim(), nodeType);
      
      // Hide form
      hideNodeForm();
      
      // Update node scores
      updateNodeScores();
    }
  };
  
  // Handle form key events
  const handleNodeFormKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      saveNodeForm();
    } else if (e.key === 'Escape') {
      hideNodeForm();
    }
  };
  
  // Improved node creation with precise positioning
  const createNode = (parentId, title, type) => {
    if (!mindMapData.nodes[parentId]) {
      console.error("Cannot create node: parent does not exist");
      return;
    }
    
    const parent = mindMapData.nodes[parentId];
    const nodeId = `node_${Date.now()}`;
    const nodeDepth = parent.depth + 1;
    
    // Calculate exact vertical offset based on node type
    const verticalOffset = 200; // Increased for better visibility
    
    // Calculate horizontal positioning
    const childCount = parent.children ? parent.children.length : 0;
    let offsetX = 0;
    
    if (childCount === 0) {
      offsetX = 0; // First child directly below parent
    } else {
      const horizontalSpacing = 250; // Wider spacing
      // Calculate total width needed for all children including this one
      const childrenCount = childCount + 1;
      // For an odd number of children, center them; for even, offset slightly
      const totalWidth = horizontalSpacing * (childrenCount - 1);
      // Start from the far left position
      const startX = -totalWidth / 2;
      // Place this child at its position in the row
      offsetX = startX + (childCount * horizontalSpacing);
    }
    
    // Update the state atomically
    setMindMapData(prevData => {
      const newData = {
        nodes: {
          ...prevData.nodes,
          [nodeId]: {
            id: nodeId,
            title: title,
            type: type,
            parent: parentId,
            depth: nodeDepth,
            children: [],
            questions: [],
            position: {
              // Precise positioning
              top: parent.position.top + verticalOffset,
              left: parent.position.left + offsetX
            }
          }
        },
        connections: [
          ...prevData.connections
        ]
      };
      
      // Update parent's children array
      newData.nodes[parentId] = {
        ...prevData.nodes[parentId],
        children: [...(prevData.nodes[parentId].children || []), nodeId]
      };
      
      // Add the connection
      newData.connections.push({
        from: parentId,
        to: nodeId
      });
      
      return newData;
    });
    
    // Force redraw of connectors after a short delay
    setTimeout(() => {
      drawConnectors();
    }, 100);
  };
  
  // Function to delete a node
  const deleteNode = (nodeId) => {
    if (nodeId === 'root') return; // Prevent deleting root node
    
    setMindMapData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      
      // Get the node to delete
      const nodeToDelete = newData.nodes[nodeId];
      if (!nodeToDelete) return newData;
      
      // Get the parent node
      const parentId = nodeToDelete.parent;
      const parentNode = newData.nodes[parentId];
      
      // Remove node from parent's children array
      if (parentNode && parentNode.children) {
        parentNode.children = parentNode.children.filter(id => id !== nodeId);
      }
      
      // Function to recursively collect all descendant node IDs
      const collectDescendants = (nodeId) => {
        const descendants = [];
        const node = newData.nodes[nodeId];
        
        if (!node) return descendants;
        
        descendants.push(nodeId);
        
        if (node.children && node.children.length > 0) {
          node.children.forEach(childId => {
            descendants.push(...collectDescendants(childId));
          });
        }
        
        return descendants;
      };
      
      // Get all descendant nodes
      const nodesToDelete = collectDescendants(nodeId);
      
      // Remove all descendants from nodes object
      nodesToDelete.forEach(id => {
        delete newData.nodes[id];
      });
      
      // Remove connections involving deleted nodes
      newData.connections = newData.connections.filter(conn => 
        !nodesToDelete.includes(conn.from) && !nodesToDelete.includes(conn.to)
      );
      
      return newData;
    });
    
    // Update scores after deletion
    updateNodeScores();
  };
  
  // Function to toggle questions display for leaf nodes
  const toggleQuestionsDisplay = (nodeId) => {
    const node = document.getElementById(nodeId);
    const questionsList = node.querySelector('.questions-list');
    
    if (questionsList.classList.contains('visible')) {
      // Collapse
      questionsList.classList.remove('visible');
      node.classList.remove('expanded');
    } else {
      // Expand
      collapseAllNodes();
      questionsList.classList.add('visible');
      node.classList.add('expanded');
    }
  };
  
  // Show question form
  const showQuestionForm = (nodeId) => {
    setCurrentNodeId(nodeId);
    setQuestionText('');
    setQuestionFormVisible(true);
  };
  
  // Hide question form
  const hideQuestionForm = () => {
    setQuestionFormVisible(false);
  };
  
  // Save question form
  const saveQuestionForm = () => {
    if (questionText.trim()) {
      // Add question to the node
      addQuestion(currentNodeId, questionText.trim());
      
      // Hide form
      hideQuestionForm();
      
      // Update scores
      updateNodeScores();
    }
  };
  
  // Handle question form key events
  const handleQuestionFormKeyDown = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      saveQuestionForm();
    } else if (e.key === 'Escape') {
      hideQuestionForm();
    }
  };
  
  // Add question to a leaf node
  const addQuestion = (nodeId, questionText) => {
    setMindMapData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const node = newData.nodes[nodeId];
      
      if (node && node.type === 'leaf') {
        // Create question object
        const questionId = `q_${Date.now()}`;
        const question = {
          id: questionId,
          text: questionText,
          isCorrect: false
        };
        
        // Add to node's questions
        if (!node.questions) {
          node.questions = [];
        }
        node.questions.push(question);
      }
      
      return newData;
    });
  };
  
  // Toggle question correct/incorrect
  const toggleQuestionCorrect = (nodeId, questionId, isCorrect) => {
    setMindMapData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const node = newData.nodes[nodeId];
      
      if (node && node.questions) {
        // Find and update the question
        const question = node.questions.find(q => q.id === questionId);
        if (question) {
          question.isCorrect = isCorrect;
        }
      }
      
      return newData;
    });
    
    // Update scores
    updateNodeScores();
  };
  
  // Update scores for all directory and root nodes
  const updateNodeScores = () => {
    setMindMapData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      
      // First, calculate scores for each leaf node
      for (const nodeId in newData.nodes) {
        const node = newData.nodes[nodeId];
        if (node.type === 'leaf' && node.questions) {
          node.correctCount = node.questions.filter(q => q.isCorrect).length;
          node.totalCount = node.questions.length;
        }
      }
      
      // Then update directory nodes and root
      function calculateDirectoryScore(nodeId) {
        const node = newData.nodes[nodeId];
        let totalCorrect = 0;
        let totalQuestions = 0;
        
        // Get scores from children
        for (const childId of node.children || []) {
          const childNode = newData.nodes[childId];
          
          if (childNode.type === 'leaf') {
            totalCorrect += childNode.correctCount || 0;
            totalQuestions += childNode.totalCount || 0;
          } else {
            // Recursively calculate child directory scores
            const childScore = calculateDirectoryScore(childId);
            totalCorrect += childScore.correctCount;
            totalQuestions += childScore.totalCount;
          }
        }
        
        // Save the calculated scores in the node
        node.correctCount = totalCorrect;
        node.totalCount = totalQuestions;
        
        // Return the score for parent calculations
        return { 
          correctCount: totalCorrect, 
          totalCount: totalQuestions 
        };
      }
      
      // Start calculation from the root
      if (newData.nodes.root) {
        calculateDirectoryScore('root');
      }
      
      return newData;
    });
  };
  
  // Memoize the makeNodeDraggable function
  const makeNodeDraggable = useCallback((nodeId) => {
    const nodeRef = document.getElementById(nodeId);
    if (!nodeRef) return;
    
    let startX, startY;
    let startTop, startLeft;
    let isDragging = false;
    
    const dragStart = (e) => {
      if (e.target.closest('.add-button') || 
          e.target.closest('.delete-button') ||
          e.target.closest('.questions-list') ||
          e.target.closest('.add-question-btn') ||
          e.target.closest('.title-input')) {
        return;
      }
      
      e.stopPropagation();
      e.preventDefault();
      
      isDragging = true;
      nodeRef.classList.add('dragging');
      
      startX = e.clientX;
      startY = e.clientY;
      startTop = nodeRef.offsetTop;
      startLeft = nodeRef.offsetLeft;
      
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', dragEnd);
    };
    
    const drag = (e) => {
      if (!isDragging) return;
      
      e.preventDefault();
      
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      const newTop = startTop + deltaY;
      const newLeft = startLeft + deltaX;
      
      nodeRef.style.top = `${newTop}px`;
      nodeRef.style.left = `${newLeft}px`;
      
      setMindMapData(prevData => {
        const newData = {...prevData};
        if (newData.nodes[nodeId]) {
          newData.nodes[nodeId] = {
            ...newData.nodes[nodeId],
            position: {
              top: newTop,
              left: newLeft
            }
          };
        }
        return newData;
      });
      
      drawConnectors();
    };
    
    const dragEnd = () => {
      isDragging = false;
      nodeRef.classList.remove('dragging');
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', dragEnd);
      drawConnectors();
    };
    
    nodeRef.addEventListener('mousedown', dragStart);
    
    return () => {
      nodeRef.removeEventListener('mousedown', dragStart);
    };
  }, [drawConnectors]);
  
  // After nodes are rendered, make them draggable
  useEffect(() => {
    const cleanupFunctions = [];
    
    Object.keys(mindMapData.nodes).forEach(nodeId => {
      const cleanup = makeNodeDraggable(nodeId);
      if (cleanup) cleanupFunctions.push(cleanup);
    });
    
    // Make the background draggable for panning
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let isDragging = false;
    
    const dragMouseDown = (e) => {
      if (e.target.closest('.node') || 
          e.target.closest('.node-form') || 
          e.target.closest('.question-form') ||
          e.target.closest('.add-button') ||
          e.target.closest('.delete-button')) return;
      
      e.preventDefault();
      isDragging = true;
      
      pos3 = e.clientX;
      pos4 = e.clientY;
      
      document.addEventListener('mousemove', elementDrag);
      document.addEventListener('mouseup', closeDragElement);
    };
    
    const elementDrag = (e) => {
      if (!isDragging || !mindMapRef.current) return;
      
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      
      mindMapRef.current.style.top = (mindMapRef.current.offsetTop - pos2) + "px";
      mindMapRef.current.style.left = (mindMapRef.current.offsetLeft - pos1) + "px";
    };
    
    const closeDragElement = () => {
      isDragging = false;
      document.removeEventListener('mousemove', elementDrag);
      document.removeEventListener('mouseup', closeDragElement);
    };
    
    if (mindMapRef.current) {
      mindMapRef.current.addEventListener('mousedown', dragMouseDown);
    }
    
    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
      if (mindMapRef.current) {
        mindMapRef.current.removeEventListener('mousedown', dragMouseDown);
      }
      document.removeEventListener('mousemove', elementDrag);
      document.removeEventListener('mouseup', closeDragElement);
    };
  }, [mindMapData.nodes, makeNodeDraggable]);
  
  // Hide expanded node when clicking elsewhere
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.node') && !e.target.closest('.node-form') && !e.target.closest('.question-form')) {
        collapseAllNodes();
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [collapseAllNodes]);
  
  // Center the mind map on initial load
  useEffect(() => {
    // Center the mind map in the viewport after initial render
    const centerMindMap = () => {
      if (mindMapRef.current) {
        const map = mindMapRef.current;
        const container = map.parentElement;
        
        // Get container dimensions
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Center the mind map
        const mapWidth = 2400;
        const mapHeight = 1600;
        
        // Calculate offsets to center the mind map
        const offsetX = (containerWidth - mapWidth) / 2;
        const offsetY = (containerHeight - mapHeight) / 2;
        
        // Apply offsets
        map.style.left = `${offsetX}px`;
        map.style.top = `${offsetY}px`;
      }
    };
    
    // Center after a short delay to ensure DOM is fully rendered
    setTimeout(centerMindMap, 100);
  }, []);
  
  // Zoom In
  const zoomIn = () => {
    setCurrentScale(prev => prev + 0.1);
    collapseAllNodes();
  };
  
  // Zoom Out
  const zoomOut = () => {
    setCurrentScale(prev => Math.max(0.5, prev - 0.1));
    collapseAllNodes();
  };
  
  // Auto Layout
  const autoLayout = () => {
    setMindMapData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      
      // Get root node
      const rootNode = newData.nodes.root;
      if (!rootNode) return newData;
      
      // Center of the container
      const containerWidth = 2400;
      const containerHeight = 1600;
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      
      // Update root node position
      rootNode.position = { top: centerY, left: centerX };
      
      // Function to position children in a tree-like structure
      const positionChildren = (nodeId, level, childIndex, siblingCount, parentPosition) => {
        const node = newData.nodes[nodeId];
        if (!node) return;
        
        // Constants for layout
        const levelHeight = 180; // Vertical spacing between levels
        const siblingWidth = 200; // Horizontal spacing between siblings
        
        // Calculate the total width needed for all siblings at this level
        const totalWidth = siblingWidth * (siblingCount - 1);
        
        // Calculate horizontal position
        let offsetX = 0;
        if (siblingCount === 1) {
          offsetX = 0; // Single child directly below parent
        } else {
          // Start from the leftmost position
          const startX = -totalWidth / 2;
          // Place this child at its position in the row
          offsetX = startX + (childIndex * siblingWidth);
        }
        
        // Calculate vertical position
        const offsetY = levelHeight;
        
        // Set node position
        node.position = {
          top: parentPosition.top + offsetY,
          left: parentPosition.left + offsetX
        };
        
        // Recursively position children
        if (node.children && node.children.length > 0) {
          node.children.forEach((childId, idx) => {
            positionChildren(
              childId,
              level + 1,
              idx,
              node.children.length,
              node.position
            );
          });
        }
      };
      
      // Position all children starting from the root
      if (rootNode.children && rootNode.children.length > 0) {
        rootNode.children.forEach((childId, idx) => {
          positionChildren(
            childId,
            1,
            idx,
            rootNode.children.length,
            rootNode.position
          );
        });
      }
      
      return newData;
    });
    
    // Collapse all nodes when auto-layout
    collapseAllNodes();
  };
  
  // Prevent form events from bubbling to parent elements
  const handleFormClick = (e) => {
    e.stopPropagation();
  };
  
  // Render all nodes
  const renderNodes = () => {
    return Object.values(mindMapData.nodes).map(node => {
      const { id, title, type, position, questions = [] } = node;
      
      // Calculate scores for display
      const totalQuestions = questions.length;
      const correctQuestions = questions.filter(q => q.isCorrect).length;
      const scoreValue = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;
      const scoreClass = scoreValue >= 80 ? 'high' : (scoreValue >= 60 ? 'medium' : 'low');
      
      // For directory and root nodes, calculate progress percentage
      const progressPercentage = node.totalCount > 0 
        ? Math.round((node.correctCount / node.totalCount) * 100) 
        : 0;
      
      const progressClass = progressPercentage >= 80 
        ? 'high' 
        : (progressPercentage >= 60 ? 'medium' : 'low');
      
      return (
        <div
          key={id}
          id={id}
          className={`node ${type}`}
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`
          }}
        >
          {type === 'root' ? (
            <input
              type="text"
              className="title-input"
              placeholder="Enter root node name"
              defaultValue={title}
              onBlur={(e) => {
                setMindMapData(prevData => {
                  const newData = {...prevData};
                  newData.nodes[id].title = e.target.value;
                  return newData;
                });
              }}
            />
          ) : (
            <div className="node-title">{title}</div>
          )}
          
          {/* For root and directory nodes: show progress percentage */}
          {(type === 'directory' || type === 'root') && (
            <div 
              className={`progress ${progressClass}`} 
              style={{ display: node.totalCount > 0 ? 'block' : 'none' }}
            >
              {progressPercentage}%
            </div>
          )}
          
          {/* For leaf nodes: show fraction of correct answers */}
          {type === 'leaf' && (
            <div 
              className="fraction" 
              onClick={(e) => {
                e.stopPropagation();
                toggleQuestionsDisplay(id);
              }}
            >
              {correctQuestions}/{totalQuestions}
            </div>
          )}
          
          {/* Add button for directory and root nodes only */}
          {(type === 'directory' || type === 'root') && (
            <div 
              className="add-button"
              onClick={(e) => {
                e.stopPropagation();
                showNodeForm(id);
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </div>
          )}
          
          {/* Delete button for all nodes except root */}
          {type !== 'root' && (
            <div 
              className="delete-button"
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(id);
              }}
            >
              <FontAwesomeIcon icon={faTrash} />
            </div>
          )}
          
          {/* Questions list for leaf nodes */}
          {type === 'leaf' && (
            <div className="questions-list">
              {questions.length === 0 ? (
                <div className="no-questions">No questions added</div>
              ) : (
                questions.map(question => (
                  <div key={question.id} className="question-item" data-id={question.id}>
                    <div className="question-text">{question.text}</div>
                    <div className="question-actions">
                      <button 
                        className="correct-btn" 
                        title="Mark as correct"
                        style={{ opacity: question.isCorrect ? 1 : 0.5 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleQuestionCorrect(id, question.id, true);
                        }}
                      >
                        <FontAwesomeIcon icon={faCheck} />
                      </button>
                      <button 
                        className="wrong-btn" 
                        title="Mark as wrong"
                        style={{ opacity: question.isCorrect ? 0.5 : 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleQuestionCorrect(id, question.id, false);
                        }}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </div>
                ))
              )}
              <button 
                className="add-question-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  showQuestionForm(id);
                }}
              >
                Add Question
              </button>
            </div>
          )}
        </div>
      );
    });
  };
  
  return (
    <div className="mind-map-app">
      <div className="status">
        Drag any node to reposition it. Click the Auto-Layout button to organize your mind map.
      </div>
      
      <div className="mind-map-container">
        <div 
          className="mind-map"
          ref={mindMapRef}
          style={{ transform: `scale(${currentScale})` }}
        >
          {renderNodes()}
          {/* Connectors will be added dynamically */}
        </div>
      </div>
      
      {/* Node Form */}
      {nodeFormVisible && (
        <div 
          className="node-form-overlay" 
          style={{ display: 'flex' }}
          onClick={hideNodeForm}
        >
          <div 
            className="node-form"
            onClick={handleFormClick} // Prevent click from closing the form
          >
            <h3>Add New Node</h3>
            <div className="form-group">
              <label htmlFor="nodeName">Node Name:</label>
              <input 
                type="text" 
                id="nodeName" 
                placeholder="Enter node name"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                onKeyDown={handleNodeFormKeyDown}
                ref={nodeNameInputRef}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Node Type:</label>
              <div className="radio-group">
                <label>
                  <input 
                    type="radio" 
                    name="nodeType" 
                    value="directory" 
                    checked={nodeType === 'directory'}
                    onChange={() => setNodeType('directory')}
                  /> 
                  Directory
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="nodeType" 
                    value="leaf" 
                    checked={nodeType === 'leaf'}
                    onChange={() => setNodeType('leaf')}
                  /> 
                  Leaf
                </label>
              </div>
            </div>
            <div className="form-actions">
              <button onClick={saveNodeForm}>Save</button>
              <button onClick={hideNodeForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Question Form */}
      {questionFormVisible && (
        <div 
          className="question-form-overlay" 
          style={{ display: 'flex' }}
          onClick={hideQuestionForm}
        >
          <div 
            className="question-form"
            onClick={handleFormClick} // Prevent click from closing the form
          >
            <h3>Add New Question</h3>
            <div className="form-group">
              <label htmlFor="questionText">Question:</label>
              <input 
                type="text" 
                id="questionText" 
                placeholder="Enter question text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                onKeyDown={handleQuestionFormKeyDown}
                ref={questionTextInputRef}
                autoFocus
              />
            </div>
            <div className="form-actions">
              <button onClick={saveQuestionForm}>Save</button>
              <button onClick={hideQuestionForm}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="controls">
        <button onClick={zoomIn}>Zoom In</button>
        <button onClick={zoomOut}>Zoom Out</button>
        <button onClick={autoLayout}>Auto-Layout</button>
      </div>
      
      <style jsx>{`
        /* Mind Map Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Arial', sans-serif;
        }
        
        .mind-map-app {
          background-color: #f5f5f5;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          overflow: hidden;
          position: relative;
        }
        
        .mind-map-container {
          width: 100%;
          height: 100vh;
          position: relative;
          overflow: hidden;
        }
        
        .mind-map {
          width: 2400px;
          height: 1600px;
          position: relative;
          margin: 0 auto;
          transform-origin: center center;
        }
        
        .node {
          position: absolute;
          background-color: #e0e0e0;
          border: 2px solid #4caf50;
          border-radius: 15px;
          padding: 10px 15px;
          text-align: center;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          cursor: grab;
          position: relative;
        }
        
        .node:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
          z-index: 10;
        }
        
        .node.dragging {
          cursor: grabbing;
          opacity: 0.8;
          z-index: 100;
        }
        
        .node.root {
          width: 240px;
          height: 140px;
          font-size: 24px;
          font-weight: bold;
          z-index: 5;
          background-color: #e8f5e9;
        }
        
        .node.directory {
          width: 200px;
          height: 100px;
          font-size: 18px;
          font-weight: bold;
          z-index: 4;
          background-color: #f0f7f0;
        }
        
        .node.leaf {
          width: 150px;
          height: 80px;
          font-size: 14px;
          z-index: 3;
        }
        
        .node.expanded {
          width: 300px;
          height: auto;
          min-height: 150px;
          z-index: 50;
        }
        
        .node .title-input {
          border: none;
          background: transparent;
          font-size: inherit;
          text-align: center;
          width: 90%;
          border-bottom: 1px solid #4caf50;
          outline: none;
          margin-bottom: 5px;
        }
        
        .add-button {
          position: absolute;
          bottom: -10px;
          right: -10px;
          width: 25px;
          height: 25px;
          background-color: #4caf50;
          color: white;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          z-index: 6;
        }
        
        .delete-button {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 25px;
          height: 25px;
          background-color: #f44336;
          color: white;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          z-index: 6;
        }
        
        .add-button:hover {
          background-color: #388e3c;
        }
        
        .delete-button:hover {
          background-color: #d32f2f;
        }
        
        .progress {
          margin-top: 5px;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: bold;
          color: white;
        }
        
        .high {
          background-color: #4caf50;
        }
        
        .medium {
          background-color: #ffc107;
        }
        
        .low {
          background-color: #f44336;
        }
        
        .fraction {
          font-size: 12px;
          margin-top: 5px;
          color: #555;
          cursor: pointer;
        }
        
        .questions-list {
          display: none;
          width: 100%;
          margin-top: 10px;
          text-align: left;
          border-top: 1px solid #ccc;
          padding-top: 10px;
        }
        
        .questions-list.visible {
          display: block;
        }
        
        .question-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
          font-size: 12px;
        }
        
        .question-text {
          flex-grow: 1;
          padding-right: 10px;
        }
        
        .question-actions {
          display: flex;
          gap: 5px;
        }
        
        .question-actions button {
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 10px;
        }
        
        .correct-btn {
          background-color: #4caf50;
          color: white;
        }
        
        .wrong-btn {
          background-color: #f44336;
          color: white;
        }
        
        .add-question-btn {
          margin-top: 5px;
          background-color: #2196f3;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 3px 8px;
          font-size: 12px;
          cursor: pointer;
        }
        
        .connector {
          position: absolute;
          background-color: #4caf50;
          height: 2px;
          transform-origin: 0 0;
          z-index: 1;
          pointer-events: none;
        }
        
        .controls {
          position: fixed;
          bottom: 20px;
          right: 20px;
          display: flex;
          gap: 10px;
          z-index: 1000;
        }
        
        .controls button {
          padding: 10px 15px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          font-weight: bold;
        }
        
        .controls button:hover {
          background-color: #388e3c;
        }
        
        .status {
          position: fixed;
          top: 20px;
          left: 20px;
          background-color: rgba(255, 255, 255, 0.8);
          padding: 10px;
          border-radius: 5px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
          z-index: 1000;
          font-size: 14px;
        }
        
        /* Modal overlays */
        .node-form-overlay,
        .question-form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1100; /* Increased z-index to ensure it appears above all other elements */
          justify-content: center;
          align-items: center;
        }
        
        .node-form,
        .question-form {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          width: 400px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          position: relative; /* Added to ensure proper stacking context */
          z-index: 1200; /* Increased further to ensure form content is above overlay */
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
        }
        
        .form-group input {
          width: 100%;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        
        .radio-group {
          display: flex;
          gap: 20px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        
        .form-actions button {
          padding: 8px 15px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .form-actions button:first-child {
          background-color: #4caf50;
          color: white;
        }
        
        .form-actions button:last-child {
          background-color: #f44336;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default MindMap;