import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

const Airplane = () => {
  const airplaneRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (airplaneRef.current) {
      // Gentle floating animation
      airplaneRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2 + 2
      airplaneRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  return (
    <group ref={airplaneRef} position={[0, 2, 0]}>
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 2, 8]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Nose cone */}
      <mesh position={[0, 0, 1.2]}>
        <coneGeometry args={[0.1, 0.4, 8]} />
        <meshStandardMaterial color="#c0c0c0" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Wings */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[3, 0.05, 0.6]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Tail wing */}
      <mesh position={[0, 0, -0.8]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[1.2, 0.05, 0.4]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Vertical stabilizer */}
      <mesh position={[0, 0.2, -0.8]}>
        <boxGeometry args={[0.05, 0.6, 0.4]} />
        <meshStandardMaterial color="#d0d0d0" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Windows */}
      <mesh position={[0, 0.05, 0.3]}>
        <boxGeometry args={[0.08, 0.08, 0.1]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.8} />
      </mesh>

      <mesh position={[0, 0.05, 0.1]}>
        <boxGeometry args={[0.08, 0.08, 0.1]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.8} />
      </mesh>

      <mesh position={[0, 0.05, -0.1]}>
        <boxGeometry args={[0.08, 0.08, 0.1]} />
        <meshStandardMaterial color="#87ceeb" transparent opacity={0.8} />
      </mesh>

      {/* Propeller */}
      <mesh position={[0, 0, 1.4]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.8, 0.02, 0.1]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
    </group>
  )
}

export default Airplane
