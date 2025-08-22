import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { Clouds, Cloud } from '@react-three/drei'

const CloudScene = () => {
  const cloudsRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (cloudsRef.current) {
      // Create endless flying effect - clouds move towards camera
      cloudsRef.current.position.z += delta * 10
      
      // Reset position when clouds get too close to create infinite loop
      if (cloudsRef.current.position.z > 20) {
        cloudsRef.current.position.z = -50
      }
    }

  })

  return (
    <group ref={cloudsRef} position={[0, 0, -50]}>
      <Clouds material={THREE.MeshLambertMaterial} limit={400} range={150}>
        {/* Cloud formations for endless flying effect */}

        <Cloud 
          seed={2}
          segments={20}
          volume={6}
          opacity={0.8}
          fade={10}
          growth={4}
          speed={0.05}
          bounds={[6, 1, 1]}
          color="white"
          position={[15, 3, 0]}
        />
        <Cloud 
          seed={3}
          segments={20}
          volume={6}
          opacity={0.8}
          fade={10}
          growth={4}
          speed={0.05}
          bounds={[6, 1, 1]}
          color="white"
          position={[-15, 3, 0]}
        />

        

        
        {/* Distant background clouds */}
        <Cloud 
          concentrate="outside"
          growth={50}
          color="white"
          opacity={1.0}
          seed={0.3}
          bounds={100}
          volume={100}
          position={[0, 10, 0]}
        />
      </Clouds>
    </group>
  )
}

export default CloudScene
