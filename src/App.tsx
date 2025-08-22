import { Canvas } from '@react-three/fiber'
import { Sky, OrbitControls, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import Horse from './components/Horse'
import CloudScene from './components/Clouds'
import './App.css'

function App() {
  return (
    <div className="App">
      <Canvas camera={{ position: [5, -5, 10], fov: 60 }}>
        <Suspense fallback={null}>
          {/* Sky and lighting */}
          <Sky />
          <Environment preset="sunset" />
          <ambientLight intensity={1.0} />
          <directionalLight position={[10, 10, 5]} intensity={1.8} />
          
          {/* Clouds */}
          <CloudScene />
          
          {/* Horse with Halo */}
          <Horse />
          
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
      
      {/* UI Overlay */}
      <div className="ui-overlay">
        <h1>Juan.</h1>
      </div>
      
      {/* Bottom Text */}
      <div className="bottom-text">
        <p>ca: coming soon</p>
      </div>
    </div>
  )
}

export default App
