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

  // Smooth movement controls with acceleration
  const keysPressed = useRef<Set<string>>(new Set())
  const currentSpeed = useRef<number>(0)
  const maxSpeed = 8
  const acceleration = 4
  const deceleration = 2

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

  // Smooth movement with acceleration in useFrame
  useFrame((state, delta) => {
    if (!horseRef.current) return

    // Check if any movement keys are pressed
    const isMoving = keysPressed.current.has('arrowleft') || keysPressed.current.has('a') ||
                    keysPressed.current.has('arrowright') || keysPressed.current.has('d') ||
                    keysPressed.current.has('arrowup') || keysPressed.current.has('w') ||
                    keysPressed.current.has('arrowdown') || keysPressed.current.has('s')

    // Update speed based on input
    if (isMoving) {
      currentSpeed.current = Math.min(currentSpeed.current + acceleration * delta, maxSpeed)
    } else {
      currentSpeed.current = Math.max(currentSpeed.current - deceleration * delta, 0)
    }

    const moveSpeed = currentSpeed.current * delta
    
    // Calculate new position
    let newX = horseRef.current.position.x
    let newY = horseRef.current.position.y
    
    if (keysPressed.current.has('arrowleft') || keysPressed.current.has('a')) {
      newX -= moveSpeed
    }
    if (keysPressed.current.has('arrowright') || keysPressed.current.has('d')) {
      newX += moveSpeed
    }
    if (keysPressed.current.has('arrowup') || keysPressed.current.has('w')) {
      newY += moveSpeed
    }
    if (keysPressed.current.has('arrowdown') || keysPressed.current.has('s')) {
      newY -= moveSpeed
    }
    
    // Apply boundary limits based on max zoom out
    const maxZoomDistance = 50 // Matches the maxDistance in OrbitControls
    const boundaryX = maxZoomDistance * 0.8 // 80% of max zoom for safety margin
    const boundaryY = maxZoomDistance * 0.6 // 60% of max zoom for vertical safety
    
    newX = Math.max(-boundaryX, Math.min(boundaryX, newX))
    newY = Math.max(-boundaryY, Math.min(boundaryY, newY))
    
    // Apply the constrained position
    horseRef.current.position.x = newX
    horseRef.current.position.y = newY
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
        position={[0, -1, -0]}
        scale={[0.2, 0.2, 0.2]}
        opacity={1}
        speed={0.1}
        bounds={[6, 3, 6]}
        segments={40}
        color="white"
      />
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
