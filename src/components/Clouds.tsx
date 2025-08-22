import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Clouds, Cloud, Float } from '@react-three/drei'

const CloudScene = () => {
  useFrame(({ camera }, delta) => {
    camera.position.z += delta * 0.5 // fly forward endlessly
  })

  return (
    <group position={[0, 0, 0]}>
      <Clouds material={THREE.MeshLambertMaterial} limit={400} range={150}>
        <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
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
        </Float>

        <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
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
        </Float>

        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.4}>
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
        </Float>
      </Clouds>
    </group>
  )
}

export default CloudScene
