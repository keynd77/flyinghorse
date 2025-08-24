import { useRef, useEffect, useState } from 'react'
import { Float, MeshWobbleMaterial } from '@react-three/drei'
import * as THREE from 'three'
import { imageCollection, galleryConfig } from '../config/imageConfig'

// Convert object values to array for the component
const sampleImages = Object.values(imageCollection)



interface ImageGalleryProps {
  onImageSelect: (imageUrl: string) => void
}

const ImageGallery = ({ onImageSelect }: ImageGalleryProps) => {
  console.log('ImageGallery: Component rendering')
  const groupRef = useRef<THREE.Group>(null)
  const [textures, setTextures] = useState<{texture: THREE.Texture, url: string}[]>([])
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0, z: 0 })
  
  // Store random offsets once when component mounts
  const [randomOffsets] = useState(() => {
    return sampleImages.map(() => ({
      x: (Math.random() - 0.5) * 2, // ±1 unit random X offset
      y: (Math.random() - 0.5) * 2, // ±1 unit random Y offset
      z: (Math.random() - 0.5) * 1  // ±0.5 unit random Z offset
    }))
  })

  // Load textures
  useEffect(() => {
    console.log(`ImageGallery: Starting to load ${sampleImages.length} textures...`)
    const textureLoader = new THREE.TextureLoader()
    const loadedTextures: {texture: THREE.Texture, url: string}[] = []
    
    // Add timeout to prevent hanging
    const timeout = setTimeout(() => {
      console.log(`ImageGallery: Texture loading timeout - showing fallback colors. Loaded: ${loadedTextures.length}/${sampleImages.length}`)
      setTextures(loadedTextures) // Show what we have so far
    }, 10000) // 10 second timeout for more images
    
    sampleImages.forEach((url, index) => {
      console.log(`ImageGallery: Loading image ${index + 1}/${sampleImages.length}: ${url}`)
      textureLoader.load(
        url, 
        (texture) => {
          console.log(`ImageGallery: Successfully loaded texture ${index + 1}/${sampleImages.length}`)
          loadedTextures.push({texture, url})
          if (loadedTextures.length === sampleImages.length) {
            console.log(`ImageGallery: All ${loadedTextures.length} textures loaded!`)
            clearTimeout(timeout)
            setTextures(loadedTextures)
          }
        },
        undefined, // onProgress
        (error) => {
          console.error(`ImageGallery: Failed to load texture ${index + 1}/${sampleImages.length}:`, error)
          // If any image fails, show fallback after a short delay
          setTimeout(() => {
            if (textures.length === 0) {
              console.log(`ImageGallery: Some images failed - showing fallback colors. Loaded: ${loadedTextures.length}/${sampleImages.length}`)
              setTextures(loadedTextures) // Show what we have so far
            }
          }, 1000)
        }
      )
    })
    
    return () => clearTimeout(timeout)
  }, [])

  // Continuous movement based on mouse position
  useEffect(() => {
    let animationId: number
    let lastMouseX = window.innerWidth / 2
    let lastMouseY = window.innerHeight / 2
    let isMouseInWindow = true
    
    const handleMouseMove = (event: MouseEvent) => {
      lastMouseX = event.clientX
      lastMouseY = event.clientY
      isMouseInWindow = true
    }
    
    const handleMouseLeave = () => {
      isMouseInWindow = false
    }
    
    const handleMouseEnter = () => {
      isMouseInWindow = true
    }
    
    const animate = () => {
      const { innerWidth, innerHeight } = window
      const centerX = innerWidth / 2
      const centerY = innerHeight / 2
      
      // Only move if mouse is inside the window
      if (isMouseInWindow) {
                // Calculate direction vector from center to mouse
        const deltaX = lastMouseX - centerX
        const deltaY = lastMouseY - centerY
        
                // Only move if mouse is outside center safe zone (50% height, 50% width)
        const safeZoneWidth = window.innerWidth * 0.5  // 50% of window width
        const safeZoneHeight = window.innerHeight * 0.5 // 50% of window height
      
      if (Math.abs(deltaX) > safeZoneWidth / 2 || Math.abs(deltaY) > safeZoneHeight / 2) {
                  // Calculate speed based on distance from safe zone edge (farther = faster, but very subtle)
        const distanceFromSafeZoneX = Math.abs(deltaX) - safeZoneWidth / 2
        const distanceFromSafeZoneY = Math.abs(deltaY) - safeZoneHeight / 2
        const distanceFromSafeZone = Math.max(distanceFromSafeZoneX, distanceFromSafeZoneY)
        
        // Extremely slow, barely noticeable movement that increases very gradually with distance
        const speed = Math.min(0.0001, distanceFromSafeZone / 2000000) // Barely moving, minimal increase
        
        // Move gallery in EXACT OPPOSITE direction of mouse position from center
        // If mouse is on the right side, move gallery left. If mouse is on left side, move gallery right.
        // If mouse is on top side, move gallery down. If mouse is on bottom side, move gallery up.
        setCameraOffset(prev => {
          const newX = prev.x - (deltaX * speed) // Negative deltaX = opposite direction
          const newY = prev.y + (deltaY * speed) // Positive deltaY = opposite direction (Y is inverted in 3D)
          
          // Calculate gallery bounds based on image grid
          const totalImages = sampleImages.length
          const columns = 9
          const rows = Math.ceil(totalImages / columns)
          
          // Calculate actual gallery dimensions
          const galleryWidth = columns * 5 // 5 units between columns
          const galleryHeight = rows * 4   // 4 units between rows
          
          // Calculate maximum allowed movement to keep all images visible
          // We want the gallery to stay centered, so movement is limited to half the gallery size
          const maxOffsetX = Math.max(0, (galleryWidth - 20) / 2) // Keep some margin
          const maxOffsetY = Math.max(0, (galleryHeight - 15) / 2) // Keep some margin
          
          return {
            x: Math.max(-maxOffsetX, Math.min(maxOffsetX, newX)),
            y: Math.max(-maxOffsetY, Math.min(maxOffsetY, newY)),
            z: prev.z
          }
        })
        }
      }
      
      animationId = requestAnimationFrame(animate)
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    animate()
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (animationId) cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <group 
      ref={groupRef}
      position={[cameraOffset.x, cameraOffset.y, cameraOffset.z]}
    >

      


                   {/* Image Grid */}
             {textures.length === 0 ? (
                       // Show loading placeholders when no textures are loaded
        sampleImages.map((url, index) => {
          const row = Math.floor(index / galleryConfig.columns)
          const col = index % galleryConfig.columns
          // Use stored random offset to keep position consistent
          const offset = randomOffsets[index]
          
          const x = (col - Math.floor(galleryConfig.columns / 2)) * galleryConfig.spacing.x + offset.x
          const y = 15 - row * galleryConfig.spacing.y + offset.y
          const z = -20 + (index % 4) * galleryConfig.spacing.z + offset.z

          return (
            <Float 
              key={index}
              speed={1 + index * 0.2} 
              rotationIntensity={0.3} 
              floatIntensity={0.5}
              position={[x, y, z]}
            >
                                   <mesh>
                       <planeGeometry args={[galleryConfig.imageSize.width, galleryConfig.imageSize.height]} />
                       <meshBasicMaterial color="#666" />
                     </mesh>
              
              {/* Loading Spinner */}
              <mesh position={[0, 0, 0.01]} rotation={[0, 0, 0]}>
                <ringGeometry args={[0.3, 0.5, 32]} />
                <meshBasicMaterial color="#00ffff" transparent opacity={0.8} />
              </mesh>
              
              {/* Spinner Animation */}
              <Float speed={2} rotationIntensity={1} floatIntensity={0.2}>
                <mesh position={[0, 0, 0.01]}>
                  <ringGeometry args={[0.2, 0.4, 16]} />
                  <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
                </mesh>
              </Float>
            </Float>
          )
        })
      ) : (
                               // Show actual images when textures are loaded
        textures.map((texture, index) => {
          const row = Math.floor(index / galleryConfig.columns)
          const col = index % galleryConfig.columns
          // Use stored random offset to keep position consistent
          const offset = randomOffsets[index]
          
          const x = (col - Math.floor(galleryConfig.columns / 2)) * galleryConfig.spacing.x + offset.x
          const y = 15 - row * galleryConfig.spacing.y + offset.y
          const z = -20 + (index % 4) * galleryConfig.spacing.z + offset.z

          return (
            <Float 
              key={index}
              speed={1 + index * 0.2} 
              rotationIntensity={0.3} 
              floatIntensity={0.5}
              position={[x, y, z]}
            >
              <mesh
                onPointerOver={() => setHoveredIndex(index)}
                onPointerOut={() => setHoveredIndex(null)}
                onClick={() => onImageSelect(texture.url)}
                scale={hoveredIndex === index ? 1.1 : 1}
              >
                <planeGeometry args={[galleryConfig.imageSize.width, galleryConfig.imageSize.height]} />
                <MeshWobbleMaterial 
                  map={texture.texture}
                  factor={hoveredIndex === index ? galleryConfig.wobble.hoverFactor : galleryConfig.wobble.baseFactor}
                  speed={hoveredIndex === index ? galleryConfig.wobble.hoverSpeed : galleryConfig.wobble.baseSpeed}
                  transparent={false}
                  toneMapped={false}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </Float>
          )
                })
      )}


    </group>
  )
}

export default ImageGallery
