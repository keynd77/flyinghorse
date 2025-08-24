import { Canvas } from '@react-three/fiber'
import { Sky, OrbitControls, Environment, Float } from '@react-three/drei'
import { Suspense, useState, useRef, useEffect } from 'react'
import Horse from './components/Horse'
import CloudScene from './components/Clouds'
import ImageGallery from './components/ImageGallery'
import './App.css'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import InfiniteCloudScroll from './components/InfiniteCloudScroll'


import { ACESFilmicToneMapping, SRGBColorSpace } from 'three'


function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isZoomingOut, setIsZoomingOut] = useState(false)
  const [isZoomingIn, setIsZoomingIn] = useState(false)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [showScreenshotPopup, setShowScreenshotPopup] = useState(false)
  const [showCopyToast, setShowCopyToast] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<'clouds' | 'satellite' | 'ufo' | 'finger' | 'dollar' | 'piece_mark' | 'pizza' | 'redbull_can'>('clouds')
  const [isLoading, setIsLoading] = useState(true)
  const [platformOrder, setPlatformOrder] = useState<('clouds' | 'satellite' | 'ufo' | 'finger' | 'dollar' | 'piece_mark' | 'pizza' | 'redbull_can')[]>([])
  const [showImageGallery, setShowImageGallery] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [showAlert, setShowAlert] = useState(() => {
    // Always show alert on page reload/fresh visit
    // Check if user has dismissed it in this session
    const sessionDismissed = sessionStorage.getItem('alertDismissed')
    return sessionDismissed !== 'true'
  })
  const audioRef = useRef<HTMLAudioElement>(null)
  const controlsRef = useRef<OrbitControlsImpl>(null)

  // Create random platform order on initial load
  useEffect(() => {
    const allPlatforms: ('clouds' | 'satellite' | 'ufo' | 'finger' | 'dollar' | 'piece_mark' | 'pizza' | 'redbull_can')[] = [
      'clouds', 'satellite', 'ufo', 'finger', 'dollar', 'piece_mark', 'pizza', 'redbull_can'
    ]
    
    // Fisher-Yates shuffle algorithm
    const shuffled = [...allPlatforms]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    
    setPlatformOrder(shuffled)
    console.log('Random platform order:', shuffled)
  }, [])

  // Read platform from URL on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const platformParam = urlParams.get('platform')
    if (platformParam && ['clouds', 'satellite', 'ufo', 'finger', 'dollar', 'piece_mark', 'pizza', 'redbull_can'].includes(platformParam)) {
      setSelectedPlatform(platformParam as 'clouds' | 'satellite' | 'ufo' | 'finger' | 'dollar' | 'piece_mark' | 'pizza' | 'redbull_can')
    }
  }, [])

  useEffect(() => {
    // Check localStorage for mute state
    const savedMuteState = localStorage.getItem('musicMuted')
    if (savedMuteState === 'true') {
      setIsMuted(true)
    }
  }, [])

  // Simple loading timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Show spinner for 2 seconds

    return () => clearTimeout(timer)
  }, [])

  // ESC key handler for closing lightbox
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedImage) {
        setSelectedImage(null)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage])

  const startMusicOnFirstClick = () => {
    if (!hasInteracted && !isMuted && audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
      setHasInteracted(true)
    }
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying && !isPaused) {
        // Pause music
        audioRef.current.pause()
        setIsPaused(true)
      } else {
        // Resume/start music (or start for first time)
        audioRef.current.play()
        setIsPlaying(true)
        setIsPaused(false)
      }
    }
  }

  const toggleMute = () => {
    const newMuteState = !isMuted
    setIsMuted(newMuteState)
    localStorage.setItem('musicMuted', newMuteState.toString())
    
    if (newMuteState && audioRef.current) {
      // Mute: pause music and stop animations
      audioRef.current.pause()
      setIsPlaying(false)
      setIsPaused(false)
    } else if (!newMuteState && hasInteracted && audioRef.current) {
      // Unmute: resume music if it was playing before
      audioRef.current.play()
      setIsPlaying(true)
      setIsPaused(false)
    }
  }

  // Auto zoom out and back in effect
  useEffect(() => {
    if (!controlsRef.current) return

    const startAutoZoom = () => {
      setIsZoomingOut(true)
      
      // Zoom out over 3 seconds
      const zoomOutDuration = 3000
      const startTime = Date.now()
      
      const zoomOut = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / zoomOutDuration, 1)
        
        if (controlsRef.current) {
          const currentDistance = controlsRef.current.getDistance()
          const targetDistance = 50 // maxDistance
          const newDistance = currentDistance + (targetDistance - currentDistance) * 0.02
          
          // Use the correct zoom method
          controlsRef.current.object.position.z = newDistance
        }
        
        if (progress < 1) {
          requestAnimationFrame(zoomOut)
        } else {
          // Start zooming back in
          setIsZoomingOut(false)
          setIsZoomingIn(true)
          zoomBackIn()
        }
      }
      
      zoomOut()
    }
    
    const zoomBackIn = () => {
      const startTime = Date.now()
      const zoomInDuration = 3000
      
      const zoomIn = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / zoomInDuration, 1)
        
        if (progress < 1) {
          requestAnimationFrame(zoomIn)
        } else {
          setIsZoomingIn(false)
        }
      }
      
      zoomIn()
    }
    
    // Start auto zoom after 2 seconds
    const timer = setTimeout(startAutoZoom, 2000)
    
    return () => clearTimeout(timer)
  }, [])

  const handleScreenshot = (image: string) => {
    console.log('Screenshot captured:', image.substring(0, 50) + '...')
    setScreenshot(image)
    setShowScreenshotPopup(true)
    console.log('Popup should be visible now')
    return null
  }

  const downloadScreenshot = () => {
    if (screenshot) {
      const link = document.createElement('a')
      link.href = screenshot
      link.download = 'juan-heaven-screenshot.png'
      link.click()
    }
  }

  const copyScreenshot = async () => {
    if (screenshot) {
      try {
        // Convert data URL to blob
        const response = await fetch(screenshot)
        const blob = await response.blob()
        
        // Try to copy to clipboard
        await navigator.clipboard.write([
          new (window as any).ClipboardItem({ [blob.type]: blob })
        ])
        
        console.log('Screenshot copied to clipboard!')
        // Show success toast
        setShowCopyToast(true)
        setTimeout(() => setShowCopyToast(false), 3000) // Hide after 3 seconds
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        // Fallback: show user how to copy manually
        alert('Copy to clipboard failed. You can right-click the image and select "Copy Image" instead.')
      }
    }
  }

  const closeScreenshotPopup = () => {
    setShowScreenshotPopup(false)
    setScreenshot(null)
  }

  const takeScreenshot = () => {
    console.log('Taking screenshot of entire scene')
    
    try {
      // Get the Three.js canvas directly
      const canvas = document.querySelector('canvas')
      if (canvas) {
        // Create a temporary canvas to add the watermark
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
        const tempCtx = tempCanvas.getContext('2d')
        
        if (tempCtx) {
          // Draw the original screenshot
          tempCtx.drawImage(canvas, 0, 0)
          
          // Add "juan." text watermark
          tempCtx.font = 'bold 72px "EB Garamond", serif'
          tempCtx.letterSpacing = '0.05em'
          tempCtx.fillStyle = 'rgba(0, 0, 0, 0.9)'
          
          // Position text more to the left and down
          const text = 'juan.'
          const textX = canvas.width - 250
          const textY = 120
          
          // Draw just the black text, no stroke
          tempCtx.fillText(text, textX, textY)
          
          // Convert to data URL
          const dataURL = tempCanvas.toDataURL('image/png')
          console.log('Screenshot with watermark created, calling handleScreenshot')
          handleScreenshot(dataURL)
        } else {
          console.error('Failed to get 2D context for temp canvas')
        }
      } else {
        console.error('Canvas not found')
      }
    } catch (error) {
      console.error('Failed to take screenshot:', error)
    }
  }

  return (
    <div className="App">
      {/* Loading Spinner Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="simple-spinner"></div>
        </div>
      )}

      <Canvas camera={{ position: [-5, 0, 5], fov: 60 }} dpr={[1, 2]} onClick={startMusicOnFirstClick}
        gl={{
          outputColorSpace: SRGBColorSpace,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1,
          preserveDrawingBuffer: true
        }}

        >
        <Suspense fallback={null}>
  {/* Sky and lighting */}
  <Sky sunPosition={[100, 20, 100]} />
  <Environment preset="sunset" /* environmentRotation={[0, Math.PI, 0]} optional */ />

  {/* ✅ add lights */}
  <ambientLight intensity={0.3} />
  <directionalLight position={[-10, 100, 5]} intensity={1} color={0xFFE5B4 as any} />
  <directionalLight position={[10, 100, 5]} intensity={1} color={0xFFE5B4 as any} />
          
          {/* Horse with platform */}
          <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
            <Horse platform={selectedPlatform} />
          </Float>
          
          {/* Clouds - always visible */}
          <CloudScene />
          
          {/* Image Gallery in Sky */}
          {showImageGallery && <ImageGallery onImageSelect={setSelectedImage} />}
          
          {/* Controls */}
          <OrbitControls 
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI / 2}
            minDistance={1}
            maxDistance={50}
            target={[0, 0, 0]}
            dampingFactor={0.05}
            enableDamping={true}
          />
        </Suspense>
      </Canvas>
      
      {/* Lightbox Overlay */}
      {selectedImage && (
        <div 
                      style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
              cursor: 'pointer'
            }}
          onClick={() => setSelectedImage(null)}

        >
          <img 
            src={selectedImage} 
            alt="Selected meme"
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              border: '2px solid white',
              borderRadius: '8px'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer'
          }}>
            ✕
          </div>
          
          {/* Save Button */}
          <button
            style={{
              position: 'absolute',
              top: '20px',
              right: '60px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid white',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onClick={(e) => {
              e.stopPropagation()
              const link = document.createElement('a')
              link.href = selectedImage
              link.download = `juan-meme-${Date.now()}.png`
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
          >
            💾 Save
          </button>
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'white',
            fontSize: '14px',
            textAlign: 'center'
          }}>
            Click to close • ESC key • Right-click for options
          </div>
        </div>
      )}
      
      {/* Alert Message - Top Center */}
      {showAlert && (
        <div className="alert-message">
          <button 
            className="alert-close-btn"
            onClick={() => {
              setShowAlert(false)
              sessionStorage.setItem('alertDismissed', 'true')
            }}
            title="Close message"
          >
            ×
          </button>
          <div className="alert-content">
            unfortunately our X account is suspended. we are working on getting it back. the x community is still up <a href="https://x.com/i/communities/1959007545399681337" target="_blank" rel="noopener noreferrer">here</a>
          </div>
        </div>
      )}
      
      {/* Audio Element */}
      <audio ref={audioRef} src="/juan-track.mp3" loop />
      
      {/* Music Button - Top Left */}
      <div className="music-button-container">
        <button 
          className={`play_music ${isPlaying && !isPaused && !isMuted ? 'playing' : ''} ${isMuted ? 'muted' : ''}`}
          onClick={isMuted ? toggleMute : toggleMusic}
          title={isMuted ? "Unmute Music" : "Toggle Music"}
        >
          <span className="play_music_text play_music_text_play">MUSIC OFF</span>
          <span className="play_music_text play_music_text_pause">MUSIC ON</span>
          <span className="play_music_text play_music_text_muted">MUSIC MUTED</span>
          <span className="play_music_icon">
            <svg id="wave" width="48" height="99" viewBox="0 0 48 99" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path id="Line_1" d="M23.5508 0H22.9009C21.7732 0.132352 20.7683 0.464282 20.0573 0.93929C19.3464 1.4143 18.9732 2.00303 19.0015 2.60526V96.3947C19.0015 97.0857 19.5282 97.7484 20.4657 98.2369C21.4033 98.7255 22.6749 99 24.0007 99C25.3266 99 26.5982 98.7255 27.5358 98.2369C28.4733 97.7484 29 97.0857 29 96.3947V2.60526C29 1.9143 28.4733 1.25165 27.5358 0.763064C26.5982 0.274482 25.3266 0 24.0007 0L23.5508 0Z" fill="white"></path>
              <path id="Line_2" d="M42.5508 18H41.9009C40.7732 18.0842 39.7683 18.2955 39.0573 18.5977C38.3464 18.9 37.9732 19.2747 38.0015 19.6579V79.3421C38.0015 79.7818 38.5282 80.2035 39.4657 80.5144C40.4033 80.8253 41.6749 81 43.0007 81C44.3266 81 45.5982 80.8253 46.5358 80.5144C47.4733 80.2035 48 79.7818 48 79.3421V19.6579C48 19.2182 47.4733 18.7965 46.5358 18.4856C45.5982 18.1747 44.3266 18 43.0007 18H42.5508Z" fill="white"></path>
              <path id="Line_3" d="M4.55081 18H3.90091C2.77317 18.0842 1.7683 18.2955 1.05733 18.5977C0.346364 18.9 -0.0267505 19.2747 0.00149344 19.6579V79.3421C0.00149344 79.7818 0.5282 80.2035 1.46574 80.5144C2.40328 80.8253 3.67486 81 5.00075 81C6.32663 81 7.59821 80.8253 8.53575 80.5144C9.47329 80.2035 10 79.7818 10 79.3421V19.6579C10 19.2182 9.47329 18.7965 8.53575 18.4856C7.59821 18.1747 6.32663 18 5.00075 18H4.55081Z" fill="white"></path>
            </svg>
          </span>
        </button>
        
        {/* Platform Selection Button */}
        <button 
          className="platform-button"
          onClick={() => {
            if (platformOrder.length === 0) return
            
            // Find current platform index in the random order
            const currentIndex = platformOrder.indexOf(selectedPlatform)
            // Get next platform (cycle back to first if at end)
            const nextIndex = (currentIndex + 1) % platformOrder.length
            const newPlatform = platformOrder[nextIndex]
            
            setSelectedPlatform(newPlatform)
            
            // Update URL with platform parameter
            const url = new URL(window.location.href)
            url.searchParams.set('platform', newPlatform)
            window.history.pushState({}, '', url.toString())
          }}
          title={`Switch to next platform in random order`}
        >
          <span className="platform-icon">
            {selectedPlatform === 'clouds' ? '☁️' : selectedPlatform === 'satellite' ? '🛰️' : selectedPlatform === 'ufo' ? '🛸' : selectedPlatform === 'finger' ? '👆' : selectedPlatform === 'dollar' ? '💰' : selectedPlatform === 'piece_mark' ? '🎯' : selectedPlatform === 'pizza' ? '🍕' : '🥤'}
          </span>
        </button>
        
                 {/* X Community Button */}
         <a 
           href="https://x.com/i/communities/1959007545399681337" 
           target="_blank" 
           rel="noopener noreferrer"
           className="twitter-button"
           title="Join our X Community"
         >
           <span className="twitter-icon">𝕏</span>
         </a>
         
         {/* Screenshot Button */}
         <button 
           className="screenshot-button" 
           title="Take Screenshot"
           onClick={() => {
             // Take screenshot using preserveDrawingBuffer
             takeScreenshot()
           }}
         >
           <img src="/cam-icon.png" alt="Camera" className="screenshot-icon" />
         </button>
         
         {/* Image Gallery Button */}
         <button 
           className="gallery-button" 
           title="Show Image Gallery in Sky"
           onClick={() => {
             setShowImageGallery(!showImageGallery)
           }}
         >
           <img src="/image-icon.png" alt="Image Gallery" className="gallery-icon" />
         </button>
       </div>
       
       {/* UI Overlay */}
       <div className="ui-overlay">
         <h1>juan.</h1>
         
         {/* Music Button */}
        
       </div>
       
       {/* Bottom Text */}
       <div className="bottom-text">
         <img 
           src="/arrow-keys.png" 
           alt="Arrow Keys Movement" 
           className="arrow-keys-image"
         />
         <p><span className="selectable">ca</span>: 5efQfRqBwYDob34CdeYyxnYAhPLKk4Y1Dy3FFNV2C777</p>
         <p className="disclaimer">
           Disclaimer: Memecoins are not investments and carry significant risk. 
           This is for entertainment purposes only. Never invest more than you can afford to lose.
         </p>
       </div>
       

       
       {/* Screenshot Popup */}
       {showScreenshotPopup && screenshot && (
         <div className="screenshot-popup-overlay" onClick={closeScreenshotPopup}>
           <div className="screenshot-popup" onClick={(e) => e.stopPropagation()}>
             <div className="screenshot-popup-header">
               <h3>Screenshot Captured!</h3>
               <button className="close-button" onClick={closeScreenshotPopup}>×</button>
             </div>
             <div className="screenshot-image-container">
               <img src={screenshot} alt="Screenshot" className="screenshot-image" />
             </div>
             <div className="screenshot-actions">
               <button className="copy-button" onClick={copyScreenshot}>
                 Copy to Clipboard
               </button>
               <button className="download-button" onClick={downloadScreenshot}>
                 Download Screenshot
               </button>
             </div>
           </div>
         </div>
       )}
       
       {/* Copy Success Toast */}
       {showCopyToast && (
         <div className="copy-toast">
           <span className="copy-toast-icon">✓</span>
           <span className="copy-toast-text">Screenshot copied to clipboard! You can now just past it on 𝕏 or anywhere else.</span>
         </div>
       )}

       {/* Debug Controls */}
       {/* Removed debug controls as per edit hint */}
     </div>
   )
 }
 
 export default App