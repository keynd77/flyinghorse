import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'

interface SphereCollectorProps {
  onPointsChange: (points: number) => void
}



export default function SphereCollector({ onPointsChange }: SphereCollectorProps) {
  const [points, setPoints] = useState(0)
  const [sphere, setSphere] = useState<{
    id: number
    position: [number, number, number]
  } | null>(null)
  
  const horsePosition = useRef<[number, number, number]>([0, 0, 0])

  useFrame((state) => {
    // Get horse position from the scene using Three.js - update every frame for smooth movement
    let foundHorse = false
    state.scene.traverse((child) => {
      if (child.userData.isHorseGroup && !foundHorse) {
        foundHorse = true
        // Update position immediately for smooth movement
        horsePosition.current[0] = child.position.x
        horsePosition.current[1] = child.position.y
        horsePosition.current[2] = child.position.z
      }
    })
    
    // Use the updated position for collision detection
    const horseX = horsePosition.current[0]
    const horseY = horsePosition.current[1]
    const horseZ = horsePosition.current[2]
    const collectionRadius = 2.0 // Increased distance to collect sphere - easier collision detection
    
    // Boundary limits for sphere spawning
    const maxZoomDistance = 50
    const boundaryX = maxZoomDistance * 0.8
    const boundaryY = maxZoomDistance * 0.6

    // Spawn a new sphere if there isn't one
    if (!sphere) {
      const newSphere = {
        id: Date.now() + Math.random() * 1000, // More unique ID to prevent conflicts
        position: [
          (Math.random() - 0.5) * boundaryX * 1.6, // Random X within boundaries
          (Math.random() - 0.5) * boundaryY * 1.6, // Random Y within boundaries
          (Math.random() - 0.5) * boundaryX * 1.6, // Random Z within boundaries
        ] as [number, number, number],
      }
      setSphere(newSphere)
    }

    // Collision detection
    if (sphere) {
      const distance = Math.sqrt(
        Math.pow(horseX - sphere.position[0], 2) + 
        Math.pow(horseY - sphere.position[1], 2) +
        Math.pow(horseZ - sphere.position[2], 2)
      )
      
      if (distance < collectionRadius) {
        const newPoints = points + 1
        setPoints(newPoints)
        onPointsChange(newPoints)
        setSphere(null) // Remove collected sphere; new one will spawn next frame
      }
    }
  })

  return (
    <>
      {/* Render collectible sphere */}
      {sphere && (
        <mesh key={sphere.id} position={sphere.position}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial color={0x00FF00} />
        </mesh>
      )}
      

    </>
  )
}