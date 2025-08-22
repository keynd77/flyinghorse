import { useGLTF, Cloud } from '@react-three/drei'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Horse = () => {
  const horseRef = useRef<THREE.Group>(null)
  const haloRef = useRef<THREE.Group>(null)
  const { scene: horseModel } = useGLTF('/horse/source/horse.glb')
  const { scene: haloModel } = useGLTF('/models/helo.glb')
  const { scene: balconyModel } = useGLTF('/models/cloud-balcony.glb')

  // Smooth movement controls
  const keysPressed = useRef<Set<string>>(new Set())

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      keysPressed.current.add(event.key.toLowerCase())
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      keysPressed.current.delete(event.key.toLowerCase())
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Smooth movement in useFrame
  useFrame((state, delta) => {
    if (!horseRef.current) return

    const moveSpeed = 2 * delta // Smooth movement based on frame time
    
    if (keysPressed.current.has('arrowleft') || keysPressed.current.has('a')) {
      horseRef.current.position.x -= moveSpeed
    }
    if (keysPressed.current.has('arrowright') || keysPressed.current.has('d')) {
      horseRef.current.position.x += moveSpeed
    }
    if (keysPressed.current.has('arrowup') || keysPressed.current.has('w')) {
      horseRef.current.position.y += moveSpeed
    }
    if (keysPressed.current.has('arrowdown') || keysPressed.current.has('s')) {
      horseRef.current.position.y -= moveSpeed
    }
  })





  return (
    <group 
      ref={horseRef} 
      position={[0, 0, 0]} 
      scale={[1, 1, 1]}
    >
      <primitive object={horseModel} />
      
      {/* Cloud balcony under the horse */}
      <primitive object={balconyModel} position={[0, -0.1, 0]} scale={[2, 2, 2]} />
      
      {/* Drei Cloud around the balcony */}
      <Cloud 
        position={[-1.5, -0.1, 1.2]}
        scale={[0.2, 0.2, 0.2]}
        opacity={1}
        speed={0.1}
        bounds={[5, 2, 5]}
        segments={40}
        color="white"
      />
       <Cloud 
        position={[1, 0, 1.5]}
        scale={[0.2, 0.2, 0.2]}
        opacity={1}
        speed={0.1}
        bounds={[5, 3, 5]}
        segments={40}
        color="white"
      />
       <Cloud 
        position={[1, 0, -1]}
        scale={[0.2, 0.2, 0.2]}
        opacity={1}
        speed={0.1}
        bounds={[5, 3, 5]}
        segments={100}
        color="white"
      />
         <Cloud 
        position={[-1, 0.1, -0.5]}
        scale={[0.2, 0.2, 0.2]}
        opacity={1}
        speed={0.1}
        bounds={[5, 3, 5]}
        segments={40}
        color="white"
      />
          <Cloud 
        position={[-1, 0.1, -1.6]}
        scale={[0.2, 0.2, 0.2]}
        opacity={1}
        speed={0.1}
        bounds={[5, 3, 5]}
        segments={40}
        color="white"
      />

      {/* Halo */}
      <group ref={haloRef} position={[0, 1.92, 0.98]} scale={[1, 1, 1]}>
        <primitive object={haloModel} />
      </group>
      
            {/* Fixed Light Source */}
  
      
      {/* Ambient Horse Lighting */}
      <spotLight 
        position={[-1.2, 2.2, 0]} 
        color={0xffffff} 
        decay={2}
        power={20}
        penumbra={0.2}
        intensity={10} 
      />
      
          
      
         
    </group>
  )
}

export default Horse
