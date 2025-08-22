import { useGLTF, Cloud, Html } from '@react-three/drei'
import { useRef, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Dynamic debug axes component that shows actual movement direction
const DebugAxes = ({ screenRight, screenUp, orbitAngle, polarAngle }: { screenRight: THREE.Vector3, screenUp: THREE.Vector3, orbitAngle: number, polarAngle: number }) => {
  const rightRef = useRef<THREE.Mesh>(null)
  const upRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    if (rightRef.current && screenRight) {
      const dir = screenRight.clone().normalize()
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
      rightRef.current.quaternion.copy(quat)
      rightRef.current.scale.set(1, dir.length() > 0 ? 8 / dir.length() : 1, 1) // In case not unit, but should be
    }
    if (upRef.current && screenUp) {
      const dir = screenUp.clone().normalize()
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
      upRef.current.quaternion.copy(quat)
      upRef.current.scale.set(1, dir.length() > 0 ? 8 / dir.length() : 1, 1)
    }
  }, [screenRight, screenUp])

  return (
    <>
      {/* Horse center point */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color={0x00FF00} />
      </mesh>
      
      {/* Left/Right movement axis (red arrow) - Shows actual movement direction */}
      <mesh ref={rightRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 8, 8]} />
        <meshBasicMaterial color={0xFF0000} />
      </mesh>
      
      {/* Up/Down movement axis (blue arrow) - Shows actual movement direction */}
      <mesh ref={upRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 8, 8]} />
        <meshBasicMaterial color={0x0000FF} />
      </mesh>
      
      {/* Movement direction indicator - shows where D will actually move the horse */}
      <mesh position={screenRight ? screenRight.clone().multiplyScalar(2) : [0, 0, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshBasicMaterial color={0xFF6600} />
      </mesh>
      
      {/* Debug text showing current orbit angle and polar angle */}
      <Html position={[0, 2, 0]} center>
        <div style={{ 
          background: 'rgba(0,0,0,0.8)', 
          color: 'white', 
          padding: '5px', 
          borderRadius: '3px',
          fontSize: '12px',
          whiteSpace: 'nowrap'
        }}>
          Orbit: {((orbitAngle * 180 / Math.PI) + 360) % 360}° | Polar: {polarAngle.toFixed(1)}°
        </div>
      </Html>
    </>
  )
}

export default function Horse() {
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
  
  // Store orbit angle and polar for debug display
  // Store orbit angle for debug display (using refs to prevent re-renders)
  const orbitAngle = useRef(0)
  const polarAngle = useRef(90)
  const screenRight = useRef(new THREE.Vector3())
  const screenUp = useRef(new THREE.Vector3())

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
    
    // Calculate relative camera position
    const relativeCamPos = camera.position.clone().sub(horsePos)
    
    // Calculate the horizontal rotation angle from the camera's position
    const cameraAngle = Math.atan2(relativeCamPos.x, relativeCamPos.z)
    
    // Calculate polar angle
    const camDistance = relativeCamPos.length()
    const camPolarAngle = Math.acos(relativeCamPos.y / camDistance)
    
    // Update angles for debug display
    orbitAngle.current = cameraAngle
    polarAngle.current = camPolarAngle * 180 / Math.PI
    
    // Calculate screen-relative directions using camera quaternion
    const newScreenRight = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion).normalize()
    const newScreenUp = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion).normalize()
    
    screenRight.current.copy(newScreenRight)
    screenUp.current.copy(newScreenUp)
    
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
    
    // Debug: Log orbit angle and movement direction
    if (Math.random() < 0.1) { // Only log 10% of the time to avoid spam
      const orbitAngleDegrees = ((cameraAngle * 180 / Math.PI) + 360) % 360
      const calculatedRotation = ((-cameraAngle + Math.PI/2) * 180 / Math.PI + 360) % 360
      console.log(`🎯 Orbit Angle: ${orbitAngleDegrees.toFixed(1)}°`)
      console.log(`📐 Polar Angle: ${ (camPolarAngle * 180 / Math.PI).toFixed(1) }°`)
      console.log(`🔄 Calculated Rotation: ${calculatedRotation.toFixed(1)}°`)
      console.log(`🐎 Horse at: [${newPos.x.toFixed(2)}, ${newPos.y.toFixed(2)}, ${newPos.z.toFixed(2)}]`)
      console.log(`📐 Screen Right: [${newScreenRight.x.toFixed(2)}, ${newScreenRight.y.toFixed(2)}, ${newScreenRight.z.toFixed(2)}]`)
      console.log(`📐 Screen Up: [${newScreenUp.x.toFixed(2)}, ${newScreenUp.y.toFixed(2)}, ${newScreenUp.z.toFixed(2)}]`)
    }
  })

  return (
    <>
              <group 
          ref={horseRef} 
          position={[0, 0, 0]} 
          scale={[1, 1, 1]}
          userData={{ isHorseGroup: true }}
                >
          <primitive object={horseModel}/>
        
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
          position={[1.2, 2.2, 0]} 
          color={0xffffff} 
          decay={2}
          power={2}
          penumbra={0.2}
          intensity={1} 
        />
      
          
      
         
      </group>
    </>
  )
}