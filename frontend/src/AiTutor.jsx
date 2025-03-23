"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

const AiTutor = () => {
  const containerRef = useRef(null)
  const sphereRef = useRef(null)
  const materialRef = useRef(null)
  const rendererRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const [question, setQuestion] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [response, setResponse] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [inputMode, setInputMode] = useState("chat") // "chat" or "voice"
  const [renderError, setRenderError] = useState(false)

  const initThreeJS = () => {
    try {
      // Three.js setup
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

      // Check if WebGL is available
      let renderer
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          powerPreference: "default", // Changed from high-performance for better compatibility
          alpha: true,
        })
      } catch (e) {
        console.error("WebGL initialization failed:", e)
        setRenderError(true)
        return null
      }

      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      containerRef.current?.appendChild(renderer.domElement)

      // Create a simpler sphere geometry with fewer segments for better performance
      const geometry = new THREE.IcosahedronGeometry(5, 4) // Reduced detail level

      // Create a simpler shader material
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          isProcessing: { value: 0 },
          isSpeaking: { value: 0 },
          baseColor: { value: new THREE.Color(0x00a2ff) },
          glowColor: { value: new THREE.Color(0x00ffff) },
        },
        vertexShader: `
          uniform float time;
          uniform float isProcessing;
          uniform float isSpeaking;
          
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec2 vUv;
          varying float vDisplacement;
          
          // Simplified noise function
          float noise(vec3 p) {
            vec3 i = floor(p);
            vec3 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            
            vec2 uv = (i.xy + vec2(37.0, 17.0) * i.z) + f.xy;
            vec2 rg = vec2(
              sin(uv.x * 0.1 + time),
              sin(uv.y * 0.1 + time)
            ) * 0.5 + 0.5;
            return mix(rg.x, rg.y, f.z);
          }
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            vUv = uv;
            
            // Create organic displacement based on simplified noise
            float noiseScale = 0.3;
            float noiseTime = time * 0.2;
            
            // Base noise for organic shape
            float baseNoise = noise(position * noiseScale + vec3(0.0, 0.0, noiseTime)) * 0.5;
            
            // Add speaking effect
            float speakingEffect = isSpeaking * sin(time * 5.0 + position.y) * 0.2;
            
            // Add processing effect
            float processingEffect = isProcessing * sin(time * 3.0) * 0.15;
            
            // Add subtle breathing animation when idle
            float idleEffect = sin(time * 0.5) * 0.05;
            
            // Combine all displacement effects
            float displacement = baseNoise + speakingEffect + processingEffect + idleEffect;
            
            // Store displacement for fragment shader
            vDisplacement = displacement;
            
            // Apply displacement along normal
            vec3 newPosition = position + normal * displacement * 0.8;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          uniform float isProcessing;
          uniform float isSpeaking;
          uniform vec3 baseColor;
          uniform vec3 glowColor;
          
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec2 vUv;
          varying float vDisplacement;
          
          void main() {
            // Create a simpler mesh grid pattern
            float gridSize = 40.0;
            vec2 gridPos = vUv * gridSize;
            
            // Create grid lines
            float lineWidth = 0.03;
            float gridX = smoothstep(lineWidth, 0.0, abs(mod(gridPos.x, 1.0) - 0.5));
            float gridY = smoothstep(lineWidth, 0.0, abs(mod(gridPos.y, 1.0) - 0.5));
            
            // Combine grid patterns
            float grid = gridX + gridY;
            
            // Edge glow effect
            float edgeGlow = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
            
            // Displacement-based color variation
            float colorVariation = vDisplacement * 0.5 + 0.5;
            
            // Pulsing effect
            float pulse = sin(time * 1.5) * 0.5 + 0.5;
            
            // Speaking intensity
            float speakIntensity = isSpeaking * (sin(time * 5.0) * 0.5 + 0.5);
            
            // Processing intensity
            float processIntensity = isProcessing * (sin(time * 3.0) * 0.5 + 0.5);
            
            // Combine all effects
            float intensity = max(speakIntensity, processIntensity);
            intensity = max(intensity, pulse * 0.3);
            
            // Base surface color
            vec3 surfaceColor = mix(baseColor * 0.5, baseColor, colorVariation * 0.7 + intensity * 0.3);
            
            // Add grid lines with glow
            surfaceColor = mix(surfaceColor, glowColor, grid * 0.7);
            
            // Add edge glow
            surfaceColor += glowColor * edgeGlow * 0.6;
            
            // Add highlights when speaking or processing
            surfaceColor += glowColor * (speakIntensity + processIntensity) * 0.3;
            
            gl_FragColor = vec4(surfaceColor, 1.0);
          }
        `,
        transparent: true,
      })

      const sphere = new THREE.Mesh(geometry, material)
      scene.add(sphere)

      // Add a simple glow effect
      const glowGeometry = new THREE.SphereGeometry(5.2, 32, 32)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x00a2ff,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide,
      })

      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
      scene.add(glowMesh)

      // Add some simple particles
      const particleCount = 300 // Reduced count
      const particleGeometry = new THREE.BufferGeometry()
      const particlePositions = new Float32Array(particleCount * 3)

      for (let i = 0; i < particleCount; i++) {
        const radius = 5 + Math.random() * 3
        const theta = Math.random() * Math.PI * 2
        const phi = Math.acos(2 * Math.random() - 1)

        particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
        particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
        particlePositions[i * 3 + 2] = radius * Math.cos(phi)
      }

      particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))

      const particleMaterial = new THREE.PointsMaterial({
        color: 0x00a2ff,
        size: 0.05,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      })

      const particles = new THREE.Points(particleGeometry, particleMaterial)
      scene.add(particles)

      camera.position.z = 15

      // Store refs
      sphereRef.current = sphere
      materialRef.current = material
      rendererRef.current = renderer
      sceneRef.current = scene
      cameraRef.current = camera

      // Store additional refs for animation
      sphere.userData.particles = particles
      sphere.userData.glowMesh = glowMesh

      // Handle context loss
      renderer.domElement.addEventListener("webglcontextlost", handleContextLost, false)
      renderer.domElement.addEventListener("webglcontextrestored", handleContextRestored, false)

      return { scene, camera, renderer, sphere, material }
    } catch (err) {
      console.error("Error initializing Three.js:", err)
      setRenderError(true)
      return null
    }
  }

  const handleContextLost = (event) => {
    event.preventDefault()
    console.log("WebGL context lost, will restore...")
    if (rendererRef.current) {
      rendererRef.current.dispose()
    }
  }

  const handleContextRestored = () => {
    console.log("WebGL context restored, reinitializing...")
    const result = initThreeJS()
    if (result) {
      const { renderer, scene, camera } = result
      animate(renderer, scene, camera)
    }
  }

  const animate = (renderer, scene, camera) => {
    if (!sphereRef.current || !materialRef.current) return

    const animateFrame = () => {
      try {
        if (!sphereRef.current || !materialRef.current || !renderer) return

        // Update time uniform for all materials
        const timeValue = performance.now() * 0.001

        // Update sphere rotation
        sphereRef.current.rotation.x += 0.0005
        sphereRef.current.rotation.y += 0.001

        // Update material uniforms
        materialRef.current.uniforms.time.value = timeValue
        materialRef.current.uniforms.isProcessing.value = isProcessing ? 1.0 : 0.0
        materialRef.current.uniforms.isSpeaking.value = isSpeaking ? 1.0 : 0.0

        // Update particle animation
        if (sphereRef.current.userData.particles) {
          sphereRef.current.userData.particles.rotation.y += 0.0005
        }

        // Update glow effect
        if (sphereRef.current.userData.glowMesh) {
          const glowIntensity = isSpeaking ? 1.3 : isProcessing ? 1.2 : 1.0
          sphereRef.current.userData.glowMesh.scale.set(glowIntensity, glowIntensity, glowIntensity)
        }

        renderer.render(scene, camera)
        requestAnimationFrame(animateFrame)
      } catch (err) {
        console.error("Error in animation loop:", err)
        setRenderError(true)
      }
    }

    animateFrame()
  }

  useEffect(() => {
    const result = initThreeJS()
    if (result) {
      const { renderer, scene, camera } = result
      animate(renderer, scene, camera)
    }

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return

      cameraRef.current.aspect = window.innerWidth / window.innerHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current.domElement.removeEventListener("webglcontextlost", handleContextLost)
        rendererRef.current.domElement.removeEventListener("webglcontextrestored", handleContextRestored)
        containerRef.current?.removeChild(rendererRef.current.domElement)
      }
    }
  }, [isProcessing, isSpeaking])

  const handleQuestionSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) {
      setError("Please enter a question")
      return
    }

    setIsProcessing(true)
    setError(null)
    setResponse(null)

    console.log("Sending question:", question)

    try {
      const response = await fetch("http://localhost:5001/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "omit",
        body: JSON.stringify({ question }),
      })

      console.log("Response status:", response.status)
      const data = await response.json()
      console.log("Response data:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response from tutor")
      }

      setResponse(data.response)
      setIsSpeaking(true)
      setQuestion("")

      // Simulate speaking duration based on response length
      const speakingDuration = Math.min(data.response.length * 50, 10000)
      setTimeout(() => {
        setIsSpeaking(false)
      }, speakingDuration)
    } catch (error) {
      console.error("Error details:", error)
      setError(error.message || "Failed to communicate with the tutor")
    } finally {
      setIsProcessing(false)
    }
  }

  // Toggle between chat and voice modes
  const toggleInputMode = () => {
    setInputMode(inputMode === "chat" ? "voice" : "chat")
  }

  // Simulate voice input when in voice mode
  const handleVoiceInput = () => {
    if (inputMode === "voice") {
      setIsProcessing(true)
      setError(null)
      setResponse(null)

      // Simulate voice processing
      setTimeout(() => {
        setResponse(
          "I've processed your voice input. This is a simulated response since voice recognition is not implemented in this demo.",
        )
        setIsSpeaking(true)

        // Simulate speaking duration
        setTimeout(() => {
          setIsSpeaking(false)
          setIsProcessing(false)
        }, 5000)
      }, 2000)
    }
  }

  // Fallback content if WebGL fails
  const renderFallbackContent = () => (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        textAlign: "center",
        color: "#00a2ff",
        maxWidth: "80%",
      }}
    >
      <h2
        style={{
          fontSize: "2rem",
          marginBottom: "1rem",
          textShadow: "0 0 10px rgba(0, 162, 255, 0.5)",
        }}
      >
        AI Math Tutor
      </h2>
      <p
        style={{
          fontSize: "1.2rem",
          color: "white",
          marginBottom: "2rem",
        }}
      >
        The 3D visualization couldn't be loaded. Your browser might not support WebGL, or there might be a performance
        issue.
      </p>
      <div
        style={{
          width: "200px",
          height: "200px",
          margin: "0 auto",
          borderRadius: "50%",
          background: "radial-gradient(circle at center, #00a2ff 0%, #0077cc 70%, #005599 100%)",
          boxShadow: "0 0 30px rgba(0, 162, 255, 0.7)",
          animation: "pulse 2s infinite ease-in-out",
        }}
      />
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 30px rgba(0, 162, 255, 0.7); }
          50% { transform: scale(1.05); box-shadow: 0 0 50px rgba(0, 162, 255, 0.9); }
          100% { transform: scale(0.95); box-shadow: 0 0 30px rgba(0, 162, 255, 0.7); }
        }
      `}</style>
    </div>
  )

  return (
    <div
      style={{
        position: "relative",
        height: "100vh",
        background: "radial-gradient(circle at center, #001030 0%, #000814 70%, #000000 100%)",
      }}
    >
      {!renderError && <div ref={containerRef} style={{ position: "absolute", top: 0, left: 0 }} />}
      {renderError && renderFallbackContent()}

      {/* Title at the top */}
      <div
        style={{
          position: "absolute",
          top: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <h1
          style={{
            color: "#00a2ff",
            fontSize: "2.5rem",
            fontWeight: "bold",
            textShadow: "0 0 15px rgba(0, 162, 255, 0.7), 0 0 30px rgba(0, 162, 255, 0.5)",
            margin: 0,
            padding: 0,
            letterSpacing: "2px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          QUANTUM INTELLECT
        </h1>
        <p
          style={{
            color: "rgba(255, 255, 255, 0.8)",
            fontSize: "1.2rem",
            margin: "10px 0 0 0",
            textShadow: "0 0 10px rgba(0, 162, 255, 0.5)",
            fontFamily: "Arial, sans-serif",
          }}
        >
          Your Advanced AI Learning Companion
        </p>
      </div>

      {/* Chat/Voice Toggle */}
      <div
        style={{
          position: "absolute",
          top: "120px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          backgroundColor: "rgba(0, 8, 20, 0.7)",
          borderRadius: "30px",
          padding: "5px",
          boxShadow: "0 0 15px rgba(0, 162, 255, 0.4)",
          border: "1px solid rgba(0, 162, 255, 0.5)",
          backdropFilter: "blur(10px)",
          zIndex: 10,
        }}
      >
        <button
          onClick={() => setInputMode("chat")}
          style={{
            padding: "10px 20px",
            borderRadius: "25px",
            border: "none",
            background: inputMode === "chat" ? "linear-gradient(135deg, #00a2ff 0%, #0077cc 100%)" : "transparent",
            color: inputMode === "chat" ? "white" : "rgba(255, 255, 255, 0.7)",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: inputMode === "chat" ? "0 0 10px rgba(0, 162, 255, 0.5)" : "none",
            minWidth: "80px",
          }}
        >
          Chat
        </button>
        <button
          onClick={() => setInputMode("voice")}
          style={{
            padding: "10px 20px",
            borderRadius: "25px",
            border: "none",
            background: inputMode === "voice" ? "linear-gradient(135deg, #00a2ff 0%, #0077cc 100%)" : "transparent",
            color: inputMode === "voice" ? "white" : "rgba(255, 255, 255, 0.7)",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: inputMode === "voice" ? "0 0 10px rgba(0, 162, 255, 0.5)" : "none",
            minWidth: "80px",
          }}
        >
          Voice
        </button>
      </div>

      {/* Input form */}
      <form
        onSubmit={handleQuestionSubmit}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "20px",
          backgroundColor: "rgba(0, 8, 20, 0.7)",
          borderRadius: "10px",
          boxShadow: "0 0 20px rgba(0, 162, 255, 0.4)",
          border: "1px solid rgba(0, 162, 255, 0.5)",
          width: "80%",
          maxWidth: "600px",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2
          style={{
            marginBottom: "15px",
            color: "#00a2ff",
            textShadow: "0 0 10px rgba(0, 162, 255, 0.5)",
          }}
        >
          AI Math Tutor
        </h2>
        {error && (
          <div
            style={{
              color: "#ff4d4d",
              marginBottom: "10px",
              padding: "10px",
              backgroundColor: "rgba(255, 77, 77, 0.1)",
              borderRadius: "5px",
              border: "1px solid rgba(255, 77, 77, 0.3)",
            }}
          >
            {error}
          </div>
        )}
        {response && (
          <div
            style={{
              color: "#00a2ff",
              marginBottom: "10px",
              padding: "10px",
              backgroundColor: "rgba(0, 162, 255, 0.1)",
              borderRadius: "5px",
              border: "1px solid rgba(0, 162, 255, 0.3)",
              textShadow: "0 0 5px rgba(0, 162, 255, 0.3)",
            }}
          >
            {response}
          </div>
        )}

        {inputMode === "chat" ? (
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me any math question..."
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "6px",
                border: "1px solid rgba(0, 162, 255, 0.5)",
                backgroundColor: "rgba(0, 8, 20, 0.5)",
                color: "white",
                fontSize: "16px",
                boxShadow: "inset 0 0 5px rgba(0, 162, 255, 0.2)",
              }}
            />
            <button
              type="submit"
              disabled={isProcessing}
              style={{
                padding: "12px 24px",
                background: "linear-gradient(135deg, #00a2ff 0%, #0077cc 100%)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isProcessing ? "not-allowed" : "pointer",
                opacity: isProcessing ? 0.7 : 1,
                boxShadow: "0 0 10px rgba(0, 162, 255, 0.5)",
                textShadow: "0 0 5px rgba(0, 0, 0, 0.5)",
              }}
            >
              {isProcessing ? "Thinking..." : "Ask"}
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "10px" }}>
            <button
              type="button"
              onClick={handleVoiceInput}
              disabled={isProcessing}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: isProcessing
                  ? "linear-gradient(135deg, #0077cc 0%, #005599 100%)"
                  : isSpeaking
                    ? "linear-gradient(135deg, #ff3300 0%, #cc0000 100%)"
                    : "linear-gradient(135deg, #00a2ff 0%, #0077cc 100%)",
                border: "none",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: isProcessing ? "not-allowed" : "pointer",
                boxShadow: "0 0 20px rgba(0, 162, 255, 0.6)",
                transition: "all 0.3s ease",
              }}
            >
              <div
                style={{
                  fontSize: "24px",
                  color: "white",
                }}
              >
                {isProcessing ? "..." : isSpeaking ? "■" : "▶"}
              </div>
            </button>
            <p
              style={{
                color: "rgba(255, 255, 255, 0.8)",
                marginLeft: "15px",
                fontSize: "16px",
              }}
            >
              {isProcessing ? "Processing..." : isSpeaking ? "Speaking..." : "Tap to speak"}
            </p>
          </div>
        )}
      </form>
    </div>
  )
}

export default AiTutor 
