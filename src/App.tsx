import { Canvas } from '@react-three/fiber'
import { Sky, OrbitControls, Environment, Float } from '@react-three/drei'
import { Suspense, useState, useRef, useEffect } from 'react'
import Horse from './components/Horse'
import CloudScene from './components/Clouds'
import './App.css'

function App() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Check localStorage for mute state
    const savedMuteState = localStorage.getItem('musicMuted')
    if (savedMuteState === 'true') {
      setIsMuted(true)
    }
  }, [])

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

  return (
    <div className="App">
      <Canvas camera={{ position: [-5, 0, 5], fov: 60 }} onClick={startMusicOnFirstClick}>
        <Suspense fallback={null}>
          {/* Sky and lighting */}
          <Sky />
          <Environment preset="sunset" environmentRotation={[0, Math.PI, 0]} />
          <ambientLight intensity={1.0} />
          {/* Left side lighting */}
          <directionalLight position={[-10, 10, 5]} intensity={1.8} color={0xFFE5B4} />
          {/* Right side lighting */}
          <directionalLight position={[10, 10, 5]} intensity={1.8} color={0xFFE5B4} />
          
          {/* Clouds */}
          <CloudScene />
          
          {/* Horse with Halo - Floating Effect */}
          <Float
            speed={1} 
            rotationIntensity={0.2} 
            floatIntensity={2}
            floatingRange={[-0.2, 0.2]}
          >
            <Horse />
          </Float>
          

          
          {/* Controls */}
          <OrbitControls 
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
      </div>
      
      {/* UI Overlay */}
      <div className="ui-overlay">
        <h1>Juan.</h1>
        
        {/* Music Button */}
       
      </div>
      
      {/* Bottom Text */}
      <div className="bottom-text">
        <p>ca: coming soon</p>
      </div>
      

    </div>
  )
}

export default App