import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const AiTutor = () => {
  const containerRef = useRef(null);
  const sphereRef = useRef(null);
  const materialRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const [question, setQuestion] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const initThreeJS = () => {
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance",
      alpha: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current?.appendChild(renderer.domElement);

    // Create pulsating sphere
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        isProcessing: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float isProcessing;
        varying vec3 vNormal;
        
        void main() {
          vec3 color1 = vec3(0.0, 0.4, 1.0); // Blue
          vec3 color2 = vec3(1.0, 1.0, 1.0); // White
          vec3 color3 = vec3(1.0, 0.5, 0.0); // Orange
          
          float pulse = sin(time * 2.0) * 0.5 + 0.5;
          float pattern = sin(vNormal.x * 10.0 + time) * sin(vNormal.y * 10.0 + time) * sin(vNormal.z * 10.0 + time);
          
          float processingPulse = isProcessing * sin(time * 8.0) * 0.3;
          
          vec3 finalColor = mix(
            mix(color1, color2, pulse + processingPulse),
            color3,
            pattern * 0.5 + 0.5
          );
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 15;

    // Store refs
    sphereRef.current = sphere;
    materialRef.current = material;
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    // Handle context loss
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost, false);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored, false);

    return { scene, camera, renderer, sphere, material };
  };

  const handleContextLost = (event) => {
    event.preventDefault();
    console.log('WebGL context lost, will restore...');
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }
  };

  const handleContextRestored = () => {
    console.log('WebGL context restored, reinitializing...');
    const { renderer, scene, camera } = initThreeJS();
    animate(renderer, scene, camera);
  };

  const animate = (renderer, scene, camera) => {
    if (!sphereRef.current || !materialRef.current) return;

    const animateFrame = () => {
      if (!sphereRef.current || !materialRef.current) return;

      sphereRef.current.rotation.x += 0.001;
      sphereRef.current.rotation.y += 0.001;
      materialRef.current.uniforms.time.value += 0.01;
      materialRef.current.uniforms.isProcessing.value = isProcessing ? 1.0 : 0.0;

      renderer.render(scene, camera);
      requestAnimationFrame(animateFrame);
    };

    animateFrame();
  };

  useEffect(() => {
    const { renderer, scene, camera } = initThreeJS();
    animate(renderer, scene, camera);

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.domElement.removeEventListener('webglcontextlost', handleContextLost);
        rendererRef.current.domElement.removeEventListener('webglcontextrestored', handleContextRestored);
        containerRef.current?.removeChild(rendererRef.current.domElement);
      }
    };
  }, [isProcessing]);

  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResponse(null);
    
    console.log('Sending question:', question);

    try {
      const response = await fetch('http://localhost:5001/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'omit',
        body: JSON.stringify({ question })
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from tutor');
      }

      setResponse(data.response);
      setQuestion('');
    } catch (error) {
      console.error('Error details:', error);
      setError(error.message || 'Failed to communicate with the tutor');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ position: 'relative', height: '100vh', background: '#000' }}>
      <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0 }} />
      <form 
        onSubmit={handleQuestionSubmit}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          width: '80%',
          maxWidth: '600px',
          textAlign: 'center'
        }}
      >
        <h2 style={{ marginBottom: '15px', color: '#239434' }}>AI Math Tutor</h2>
        {error && (
          <div style={{ 
            color: 'red', 
            marginBottom: '10px', 
            padding: '10px', 
            backgroundColor: 'rgba(255, 0, 0, 0.1)',
            borderRadius: '5px'
          }}>
            {error}
          </div>
        )}
        {response && (
          <div style={{ 
            color: '#239434', 
            marginBottom: '10px', 
            padding: '10px', 
            backgroundColor: 'rgba(35, 148, 52, 0.1)',
            borderRadius: '5px'
          }}>
            {response}
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me any math question..."
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #ccc',
              fontSize: '16px'
            }}
          />
          <button
            type="submit"
            disabled={isProcessing}
            style={{
              padding: '12px 24px',
              backgroundColor: '#239434',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              opacity: isProcessing ? 0.7 : 1
            }}
          >
            {isProcessing ? 'Thinking...' : 'Ask'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AiTutor; 