import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Clouds, Cloud } from '@react-three/drei'

type CloudInstance = { id: number; preset: 0 | 1 | 2; seed: number }
const SPEED = 10                        // units/sec toward camera
const SCENE_DEPTH = 100                 // tune to your scene
const BACK_JITTER = 30                  // small random extra back offset
const DESPAWN_AHEAD = 30                // remove after passing camera by this much
const SPAWN_INTERVAL_MS = 3000          // one every 3 seconds

export default function OneByOneClouds() {
  const [clouds, setClouds] = useState<CloudInstance[]>([])   // logical list
  const nextId = useRef(0)
  const zPos = useRef<Record<number, number>>({})
  const refs = useRef<Record<number, THREE.Group | null>>({})

  const setRef = (id: number) => (el: THREE.Group | null) => (refs.current[id] = el)

  // spawn exactly ONE cloud every 3s, far back
  useEffect(() => {
    const spawn = () => {
      setClouds(prev => {
        const id = nextId.current++
        const preset = (Math.floor(Math.random() * 3) as 0 | 1 | 2)
        const seed = Math.random() * 1000 + preset
        zPos.current[id] = -2 * SCENE_DEPTH - Math.random() * BACK_JITTER
        return [...prev, { id, preset, seed }]
      })
    }
    const t = setInterval(spawn, SPAWN_INTERVAL_MS)
    return () => clearInterval(t)
  }, [])

  // move each cloud forward; only mutate state when despawning
  useFrame(({ camera }, dt) => {
    const camZ = camera.position.z
    let removed = false

    for (const c of clouds) {
      const z = (zPos.current[c.id] ?? -2 * SCENE_DEPTH) + dt * SPEED
      zPos.current[c.id] = z
      const g = refs.current[c.id]
      if (g) g.position.z = z
    }

    // despawn passers
    const keep = clouds.filter(c => {
      const z = zPos.current[c.id]
      const alive = z <= camZ + DESPAWN_AHEAD
      if (!alive) {
        delete zPos.current[c.id]
        delete refs.current[c.id]
        removed = true
      }
      return alive
    })
    if (removed) setClouds(keep)
  })

  return (
    <group>
      <Clouds material={THREE.MeshLambertMaterial} limit={150} range={150}>
        {clouds.map(c => {
          // your three original presets
          const preset =
            c.preset === 0
              ? {
                  position: [15, 3, 0] as [number, number, number],
                  segments: 20, volume: 6, opacity: 0.8, fade: 10,
                  growth: 4, speed: 0.05, bounds: [6, 1, 1] as [number, number, number], color: 'white',
                }
              : c.preset === 1
              ? {
                  position: [-15, 3, 0] as [number, number, number],
                  segments: 20, volume: 6, opacity: 0.8, fade: 10,
                  growth: 4, speed: 0.05, bounds: [6, 1, 1] as [number, number, number], color: 'white',
                }
              : {
                  position: [0, 10, 0] as [number, number, number],
                  concentrate: 'outside' as const, growth: 50, color: 'white',
                  opacity: 1.0, bounds: 100, volume: 100,
                }

          const [x, y] = preset.position
          const z = zPos.current[c.id] ?? -2 * SCENE_DEPTH

          return (
            <group key={c.id} ref={setRef(c.id)} position={[x, y, z]}>
              <Cloud {...preset} seed={c.seed} />
            </group>
          )
        })}
      </Clouds>
    </group>
  )
}
