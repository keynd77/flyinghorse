import { useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect } from 'react'
import * as THREE from 'three'
import { Clouds, Cloud } from '@react-three/drei'

interface CloudConfig {
  id: number
  seed: number
  position: [number, number, number]
  bounds: [number, number, number]
  segments: number
  volume: number
  opacity: number
  fade: number
  growth: number
  speed: number
  color: string
}

const CloudScene = () => {
  const nextId = useRef(0)
  const [clouds, setClouds] = useState<CloudConfig[]>([])
  const [distantClouds, setDistantClouds] = useState<CloudConfig[]>([])

  // Function to generate a new small cloud config
  const generateSmallCloud = (): CloudConfig => {
    nextId.current += 1
    return {
      id: nextId.current,
      seed: Math.random() * 100,
      position: [
        (Math.random() - 0.5) * 50, // Random x between -25 and 25
        (Math.random() - 0.5) * 20 + 3, // Random y between -10 and 13, biased up
        -150 - Math.random() * 50 // Far back, spread out
      ],
      bounds: [6 + Math.random() * 4, 1 + Math.random() * 2, 1 + Math.random() * 2], // Varied size
      segments: 100,
      volume: 6,
      opacity: 0.8,
      fade: 100,
      growth: 10,
      speed: 0.05,
      color: 'white'
    }
  }

  // Function to generate a new distant background cloud
  const generateDistantCloud = (): CloudConfig => {
    nextId.current += 1
    return {
      id: nextId.current,
      seed: Math.random(),
      position: [
        0,
        10,
        -150 - Math.random() * 50 // Far back
      ],
      bounds: [100, 100, 100],
      segments: 200,
      volume: 100,
      opacity: 1.0,
      fade: 200,
      growth: 50,
      speed: 0.02, // Slower for distant
      color: 'white'
    }
  }

  useFrame((state, delta) => {
    // Update small clouds: move, remove gone, add new for each removed
    setClouds(prev => {
      const moved = prev.map(cloud => ({
        ...cloud,
        position: [cloud.position[0], cloud.position[1], cloud.position[2] + delta * 10] // Move forward
      }))
      const remaining = moved.filter(cloud => cloud.position[2] < 50) // Remove when past camera + margin
      const removedCount = moved.length - remaining.length
      const newOnes = Array.from({ length: removedCount }, generateSmallCloud)
      return [...remaining, ...newOnes]
    })

    // Update distant clouds: move slower, remove gone, add new for each removed
    setDistantClouds(prev => {
      const moved = prev.map(cloud => ({
        ...cloud,
        position: [cloud.position[0], cloud.position[1], cloud.position[2] + delta * 5] // Slower movement
      }))
      const remaining = moved.filter(cloud => cloud.position[2] < 50)
      const removedCount = moved.length - remaining.length
      const newOnes = Array.from({ length: removedCount }, generateDistantCloud)
      return [...remaining, ...newOnes]
    })
  })

  // Initial clouds
  useEffect(() => {
    // Spawn initial small clouds spread out in depth
    const initialSmall = Array.from({ length: 10 }, () => {
      const cloud = generateSmallCloud()
      cloud.position[2] = -Math.random() * 150 // Spread from 0 to -150
      return cloud
    })
    setClouds(initialSmall)

    // Spawn initial distant spread out
    const initialDistant = Array.from({ length: 3 }, () => {
      const cloud = generateDistantCloud()
      cloud.position[2] = -Math.random() * 150
      return cloud
    })
    setDistantClouds(initialDistant)
  }, [])

  return (
    <Clouds material={THREE.MeshLambertMaterial} limit={400} range={150}>
      {/* Render small clouds */}
      {clouds.map(cloud => (
        <Cloud
          key={cloud.id}
          seed={cloud.seed}
          position={cloud.position}
          bounds={cloud.bounds}
          segments={cloud.segments}
          volume={cloud.volume}
          opacity={cloud.opacity}
          fade={cloud.fade}
          growth={cloud.growth}
          speed={cloud.speed}
          color={cloud.color}
        />
      ))}

      {/* Render distant background clouds */}
      {distantClouds.map(cloud => (
        <Cloud
          key={cloud.id}
          concentrate="outside"
          seed={cloud.seed}
          position={cloud.position}
          bounds={cloud.bounds}
          segments={cloud.segments}
          volume={cloud.volume}
          opacity={cloud.opacity}
          fade={cloud.fade}
          growth={cloud.growth}
          speed={cloud.speed}
          color={cloud.color}
        />
      ))}
    </Clouds>
  )
}

export default CloudScene