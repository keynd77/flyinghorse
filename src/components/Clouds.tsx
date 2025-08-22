import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Clouds, Cloud } from '@react-three/drei'

const CloudScene = () => {
  useFrame(({ camera }, delta) => {
    camera.position.z += delta * 10 // fly forward endlessly
  })

  return (
    <group position={[0, 0, 0]}>
      <Clouds material={THREE.MeshLambertMaterial} limit={400} range={150}>
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
