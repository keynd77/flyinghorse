import { useRef, useEffect, useState } from 'react'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

// Local meme images from public/images/memes folder
const sampleImages = [
  '/images/memes/juan-1.png',
  '/images/memes/juan-2.png',
  '/images/memes/juan-3.png',
  '/images/memes/juan-4.png',
  '/images/memes/juan-5.png',
  '/images/memes/juan-6.png',
  '/images/memes/juan-7.png',
  '/images/memes/juan-8.png',
  '/images/memes/juan-9.png',
  '/images/memes/juan-10.png',
  '/images/memes/juan-11.png',
  '/images/memes/juan-12.png',
  '/images/memes/juan-13.png',
  '/images/memes/juan-14.png',
  '/images/memes/juan-15.png',
  '/images/memes/juan-16.png',
  '/images/memes/juan-17.png',
  '/images/memes/juan-18.png',
  '/images/memes/juan-19.png',
  '/images/memes/juan-20.png',
  '/images/memes/juan-21.png',
  '/images/memes/juan-22.png',
  '/images/memes/juan-23.png',
  '/images/memes/juan-24.png',
  '/images/memes/juan-25.png',
  '/images/memes/juan-26.png',
  '/images/memes/juan-27.png',
  '/images/memes/juan-28.png',
  '/images/memes/juan-29.png',
  '/images/memes/juan-30.png',
  '/images/memes/juan-31.png',
  '/images/memes/juan-32.png',
  '/images/memes/juan-33.png',
  '/images/memes/juan-34.png',
  '/images/memes/juan-35.png',
  '/images/memes/juan-36.png',
  '/images/memes/juan-37.png',
  '/images/memes/juan-38.png',
  '/images/memes/juan-39.png',
  '/images/memes/juan-40.png',
  '/images/memes/juan-41.png',
  '/images/memes/juan-42.png',
  '/images/memes/juan-43.png',
  '/images/memes/juan-44.png',
  '/images/memes/juan-45.png',
  '/images/memes/juan-46.png',
  '/images/memes/juan-47.png',
  '/images/memes/juan-48.png',
  '/images/memes/juan-49.png',
  '/images/memes/juan-50.png',
  '/images/memes/juan-51.png',
  '/images/memes/juan-52.png',
  '/images/memes/juan-53.png',
  '/images/memes/juan-54.png',
  '/images/memes/juan-55.png',
  '/images/memes/juan-56.png',
  '/images/memes/juan-57.png',
  '/images/memes/juan-58.png',
  '/images/memes/juan-59.png',
  '/images/memes/juan-60.png',
  '/images/memes/juan-61.png',
  '/images/memes/juan-62.png',
  '/images/memes/juan-63.png',
  '/images/memes/juan-64.png',
  '/images/memes/juan-65.png',
  '/images/memes/juan-66.png',
  '/images/memes/juan-67.png',
  '/images/memes/juan-68.png',
  '/images/memes/juan-69.png',
  '/images/memes/juan-70.png',
  '/images/memes/juan-71.png',
  '/images/memes/juan-72.png',
  '/images/memes/juan-73.png',
  '/images/memes/juan-74.png',
  '/images/memes/juan-75.png',
  '/images/memes/juan-76.png',
  '/images/memes/juan-77.png',
  '/images/memes/juan-78.png',
  '/images/memes/juan-79.png',
  '/images/memes/juan-80.png',
  '/images/memes/juan-81.png',
  '/images/memes/juan-82.png',
  '/images/memes/juan-83.png',
  '/images/memes/juan-84.png',
  '/images/memes/juan-85.png'
]



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
        
        // Only move if mouse is outside center safe zone (30% height, 20% width)
      const safeZoneWidth = window.innerWidth * 0.2  // 20% of window width
      const safeZoneHeight = window.innerHeight * 0.3 // 30% of window height
      
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
          const row = Math.floor(index / 9)
          const col = index % 9
          // Use stored random offset to keep position consistent
          const offset = randomOffsets[index]
          
          const x = (col - 4) * 5 + offset.x
          const y = 15 - row * 4 + offset.y
          const z = -20 + (index % 4) * 6 + offset.z

          return (
            <Float 
              key={index}
              speed={1 + index * 0.2} 
              rotationIntensity={0.3} 
              floatIntensity={0.5}
              position={[x, y, z]}
            >
                                   <mesh>
                       <planeGeometry args={[3, 2.5]} />
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
          const row = Math.floor(index / 9)
          const col = index % 9
          // Use stored random offset to keep position consistent
          const offset = randomOffsets[index]
          
          const x = (col - 4) * 5 + offset.x
          const y = 15 - row * 4 + offset.y
          const z = -20 + (index % 4) * 6 + offset.z

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
                       <planeGeometry args={[3, 2.5]} />
                       <meshBasicMaterial 
                         map={texture.texture} 
                         toneMapped={false}
                         transparent={false}
                         alphaTest={0.5}
                         side={THREE.DoubleSide}
                       />
                     </mesh>
                     
                     {/* Hover Glow Effect */}
                     {hoveredIndex === index && (
                       <mesh position={[0, 0, -0.01]}>
                         <planeGeometry args={[3.2, 2.7]} />
                         <meshBasicMaterial 
                           color="#00ffff" 
                           transparent 
                           opacity={0.3}
                           side={THREE.DoubleSide}
                         />
                       </mesh>
                     )}
            </Float>
          )
                })
      )}


    </group>
  )
}

export default ImageGallery
