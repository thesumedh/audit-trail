"use client"

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text3D, Center, Float, Sparkles } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function FloatingCube({ position, scale, color, speed = 1 }: { 
  position: [number, number, number], 
  scale: number, 
  color: string,
  speed?: number 
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2 * speed
      meshRef.current.rotation.y += delta * 0.3 * speed
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.5
    }
  })

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={color} 
          transparent 
          opacity={0.8}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </mesh>
    </Float>
  )
}

function HolographicText() {
  const textRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    }
  })

  return (
    <Center>
      <Text3D
        ref={textRef}
        font="/fonts/helvetiker_regular.typeface.json"
        size={1.5}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.02}
        bevelSize={0.02}
        bevelOffset={0}
        bevelSegments={5}
      >
        AUDIT TRAIL
        <meshStandardMaterial 
          color="#00ffff"
          emissive="#0066ff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </Text3D>
    </Center>
  )
}

function DataStream() {
  const points = useRef<THREE.Points>(null)
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(1000 * 3)
    for (let i = 0; i < 1000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return positions
  }, [])

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.x = state.clock.elapsedTime * 0.02
      points.current.rotation.y = state.clock.elapsedTime * 0.03
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.02} 
        color="#00ffff" 
        transparent 
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={2} color="#00ffff" />
      <pointLight position={[-10, -10, -10]} intensity={1} color="#ff00ff" />
      <spotLight position={[0, 20, 0]} intensity={3} color="#ffffff" angle={0.3} />
      
      <HolographicText />
      <DataStream />
      
      <FloatingCube position={[-8, 2, -5]} scale={0.8} color="#00ffff" speed={0.8} />
      <FloatingCube position={[8, -2, -3]} scale={1.2} color="#ff00ff" speed={1.2} />
      <FloatingCube position={[3, 4, -8]} scale={0.6} color="#ffff00" speed={0.6} />
      <FloatingCube position={[-5, -3, -6]} scale={1.0} color="#00ff00" speed={1.0} />
      <FloatingCube position={[6, 1, -4]} scale={0.7} color="#ff6600" speed={0.9} />
      
      <Sparkles count={200} scale={[20, 20, 20]} size={2} speed={0.5} />
      
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  )
}

export function EnterpriseHero() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 75 }}
        style={{ background: 'radial-gradient(circle at center, #1a0033 0%, #000000 100%)' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}