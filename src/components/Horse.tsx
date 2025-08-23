import { useRef, useEffect } from 'react'
import { useGLTF, Cloud } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface HorseProps {
  platform?: 'clouds' | 'satellite' | 'ufo' | 'finger' | 'dollar'
}

const objectConfigs = {
  satellite: {
    position: { x: 0, y: -0.85, z: 1.2 },
    rotation: { x: 11.8, y: 20.4, z: 5.5 },
    scale: { x: 2, y: 2, z: 2 }
  },
  balcony: {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  },
  ufo: {
    position: { x: 0, y: -1, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 }
  },
  finger: {
    position: { x: -3.2, y: -26.32, z: -7 },
    rotation: { x: 0.005, y: 3.3, z: 1.5 },
    scale: { x: 35, y: 35, z: 35 }
  },
  dollar: {
    position: { x: 1.5, y: -2.05, z: 0.7 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x:  7, y: 7, z: 7 }
  }
}

const Horse = ({ platform = 'clouds' }: HorseProps) => {
  const horseRef = useRef<THREE.Group>(null)
  const haloRef = useRef<THREE.Group>(null)
  const { scene: horseModel } = useGLTF('/horse/source/horse.glb')
  const { scene: haloModel } = useGLTF('/models/helo.glb')
  const { scene: balconyModel } = useGLTF('/models/cloud-balcony.glb')
  const { scene: satelliteModel } = useGLTF('/models/space_satellite.glb')
  const { scene: ufoModel } = useGLTF('/models/ufo.glb')
  const { scene: fingerModel } = useGLTF('/models/finger.glb')
  const { scene: dollarSignModel } = useGLTF('/models/dolar_sign.glb')

  // Apply custom chrome metallic effect to finger model
  useEffect(() => {
    if (fingerModel) {
      fingerModel.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.color.setHex(0xCCCCCC) // Light gray for chrome
                mat.metalness = 1.0         // Full metallic
                mat.roughness = 0.05        // Very smooth/reflective (mirror-like)
                mat.envMapIntensity = 1.5   // Stronger environment reflection
                mat.needsUpdate = true      // Force material update
              }
            })
          } else {
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.color.setHex(0xCCCCCC) // Light gray for chrome
              child.material.metalness = 1.0         // Full metallic
              child.material.roughness = 0.01       // Very smooth/reflective (mirror-like)
              child.material.envMapIntensity = 2   // Stronger environment reflection
              child.material.needsUpdate = true      // Force material update
            }
          }
        }
      })
    }
  }, [fingerModel])

  // Apply golden metallic effect to dollar sign model
  useEffect(() => {
    if (dollarSignModel) {
      dollarSignModel.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.color.setHex(0xFFD700) // Golden color
                mat.metalness = 1.0         // Full metallic
                mat.roughness = 0.1         // Smooth but not mirror-like
                mat.envMapIntensity = 2.0   // Strong environment reflection
                mat.needsUpdate = true      // Force material update
              }
            })
          } else {
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.color.setHex(0xFFD700) // Golden color
              child.material.metalness = 1.0         // Full metallic
              child.material.roughness = 0.1         // Smooth but not mirror-like
              child.material.envMapIntensity = 2.0   // Strong environment reflection
              child.material.needsUpdate = true      // Force material update
            }
          }
        }
      })
    }
  }, [dollarSignModel])

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

  // Sphere spawning and collection logic
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
    
    // Get camera and calculate orbit control rotation for view-relative movement
    const camera = state.camera
    const horsePos = horseRef.current.position
    
    // Calculate screen-relative directions using camera quaternion
    const newScreenRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion).normalize()
    const newScreenUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize()
    
    // Calculate new position with screen-relative movement
    const newPos = horsePos.clone()
    
    if (keysPressed.current.has('arrowleft') || keysPressed.current.has('a')) {
      newPos.add(newScreenRight.clone().negate().multiplyScalar(moveSpeed))
    }
    if (keysPressed.current.has('arrowright') || keysPressed.current.has('d')) {
      newPos.add(newScreenRight.multiplyScalar(moveSpeed))
    }
    if (keysPressed.current.has('arrowup') || keysPressed.current.has('w')) {
      newPos.add(newScreenUp.multiplyScalar(moveSpeed))
    }
    if (keysPressed.current.has('arrowdown') || keysPressed.current.has('s')) {
      newPos.add(newScreenUp.clone().negate().multiplyScalar(moveSpeed))
    }
    
    // Apply boundary limits based on max zoom out
    const maxZoomDistance = 50 // Matches the maxDistance in OrbitControls
    const boundaryX = maxZoomDistance * 0.8 // 80% of max zoom for safety margin
    const boundaryY = maxZoomDistance * 0.6 // 60% of max zoom for vertical safety
    
    newPos.x = THREE.MathUtils.clamp(newPos.x, -boundaryX, boundaryX)
    newPos.y = THREE.MathUtils.clamp(newPos.y, -boundaryY, boundaryY)
    newPos.z = THREE.MathUtils.clamp(newPos.z, -boundaryX, boundaryX)
    
    // Apply the constrained position
    horseRef.current.position.copy(newPos)
    
  })

  return (
    <>
              <group 
          ref={horseRef} 
          position={[0, 0, 0]} 
          scale={[1, 1, 1]}
          userData={{ isHorseGroup: true }}
                >
          <primitive object={horseModel} castShadow/>
        
        {/* Platform under the horse */}
        {platform === 'clouds' ? (
          <primitive 
            object={balconyModel} 
            position={[objectConfigs.balcony.position.x, objectConfigs.balcony.position.y, objectConfigs.balcony.position.z]} 
            scale={[objectConfigs.balcony.scale.x, objectConfigs.balcony.scale.y, objectConfigs.balcony.scale.z]}
            rotation={[objectConfigs.balcony.rotation.x, objectConfigs.balcony.rotation.y, objectConfigs.balcony.rotation.z]}
          />
        ) : platform === 'satellite' ? (
          <primitive 
            object={satelliteModel} 
            position={[objectConfigs.satellite.position.x, objectConfigs.satellite.position.y, objectConfigs.satellite.position.z]} 
            scale={[objectConfigs.satellite.scale.x, objectConfigs.satellite.scale.y, objectConfigs.satellite.scale.z]}
            rotation={[objectConfigs.satellite.rotation.x, objectConfigs.satellite.rotation.y, objectConfigs.satellite.rotation.z]}
            receiveShadow
          />
        ) : platform === 'ufo' ? (
          <primitive 
            object={ufoModel} 
            position={[objectConfigs.ufo.position.x, objectConfigs.ufo.position.y, objectConfigs.ufo.position.z]} 
            scale={[objectConfigs.ufo.scale.x, objectConfigs.ufo.scale.y, objectConfigs.ufo.scale.z]}
            rotation={[objectConfigs.ufo.rotation.x, objectConfigs.ufo.rotation.y, objectConfigs.ufo.rotation.z]}
            receiveShadow
            castShadow
          />
        ) : platform === 'dollar' ? (
          <primitive 
            object={dollarSignModel} 
            position={[objectConfigs.dollar.position.x, objectConfigs.dollar.position.y, objectConfigs.dollar.position.z]} 
            scale={[objectConfigs.dollar.scale.x, objectConfigs.dollar.scale.y, objectConfigs.dollar.scale.z]}
            rotation={[objectConfigs.dollar.rotation.x, objectConfigs.dollar.rotation.y, objectConfigs.dollar.rotation.z]}
            receiveShadow
            castShadow
          />
        ) : (
          <primitive 
            object={fingerModel} 
            position={[objectConfigs.finger.position.x, objectConfigs.finger.position.y, objectConfigs.finger.position.z]} 
            scale={[objectConfigs.finger.scale.x, objectConfigs.finger.scale.y, objectConfigs.finger.scale.z]}
            rotation={[objectConfigs.finger.rotation.x, objectConfigs.finger.rotation.y, objectConfigs.finger.rotation.z]}
            receiveShadow
            castShadow
          />
        )}
        
        {/* Drei Cloud around the balcony - only show with cloud balcony */}
        {platform === 'clouds' && (
          <>
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
          </>
        )}

        {/* Halo */}
        <group 
          ref={haloRef} 
          position={[0, 1.92, 0.98]} 
          scale={[1, 1, 1]}
          rotation={[0,0,0]}
        >
          <primitive object={haloModel} />
        </group>
      

     
          
      
         
      </group>
    </>
  )
}

export default Horse