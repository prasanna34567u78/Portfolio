/**
 * AvatarScene.tsx — Three.js / react-three-fiber 3D scene.
 *
 * This file is dynamically imported by Avatar.tsx only when:
 *  1. WebGL is available
 *  2. /avatar/me.glb exists
 *
 * The scene:
 * - Loads the GLB with useGLTF (supports Draco compression).
 * - Applies viseme blendshape weights to the mesh in useFrame.
 * - Runs idle animations: blink timer + subtle head oscillation.
 * - Renders inside a Suspense boundary — never blocks first paint.
 */

import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

// ── Blendshape weights lerp speed ────────────────────────────────────────────
const LERP_SPEED = 12 // per second

// ── Blink helper ─────────────────────────────────────────────────────────────
function useBlink() {
  const blinkState = useRef({ open: 1, nextBlink: Date.now() + 3000 })

  function tick(delta: number) {
    const now = Date.now()
    const state = blinkState.current
    if (now >= state.nextBlink) {
      state.open = Math.max(0, state.open - delta * 8)
      if (state.open <= 0) {
        state.nextBlink = now + 200 + Math.random() * 3000
        state.open = 0
      }
    } else {
      state.open = Math.min(1, state.open + delta * 8)
    }
    return 1 - state.open // eyeBlink_L/R value (1 = closed)
  }

  return tick
}

// ── Avatar mesh with viseme and idle animations ───────────────────────────────
interface AvatarMeshProps {
  speaking: boolean
  currentViseme: string
}

function AvatarMesh({ speaking, currentViseme }: AvatarMeshProps) {
  const { scene } = useGLTF('/avatar/me.glb')
  const headRef = useRef<THREE.Object3D | null>(null)
  const meshRef = useRef<THREE.SkinnedMesh | null>(null)
  const weightMap = useRef<Record<string, number>>({})
  const idleTime = useRef(0)
  const getBlink = useBlink()

  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.SkinnedMesh).isSkinnedMesh) {
        meshRef.current = obj as THREE.SkinnedMesh
      }
      if (obj.name.toLowerCase().includes('head')) {
        headRef.current = obj
      }
    })
  }, [scene])

  useFrame((_state, delta) => {
    const mesh = meshRef.current
    if (!mesh || !mesh.morphTargetDictionary || !mesh.morphTargetInfluences) return

    const dict = mesh.morphTargetDictionary
    const inf = mesh.morphTargetInfluences
    idleTime.current += delta

    // — Idle head sway —
    if (headRef.current) {
      headRef.current.rotation.y =
        Math.sin(idleTime.current * 0.4) * 0.05
      headRef.current.rotation.x =
        Math.sin(idleTime.current * 0.3 + 1) * 0.03
    }

    // — Blink —
    const blinkVal = getBlink(delta)
    const blinkLIdx = dict['eyeBlink_L']
    const blinkRIdx = dict['eyeBlink_R']
    if (blinkLIdx !== undefined) inf[blinkLIdx] = blinkVal
    if (blinkRIdx !== undefined) inf[blinkRIdx] = blinkVal

    // — Target viseme —
    const targetViseme = speaking ? currentViseme : 'viseme_sil'
    Object.keys(dict).forEach((key) => {
      if (!key.startsWith('viseme_')) return
      const idx = dict[key]
      const target = key === targetViseme ? 1 : 0
      weightMap.current[key] = weightMap.current[key] ?? 0
      weightMap.current[key] = THREE.MathUtils.lerp(
        weightMap.current[key],
        target,
        delta * LERP_SPEED,
      )
      inf[idx] = weightMap.current[key]
    })
  })

  return (
    <primitive
      object={scene}
      scale={2.2}
      position={[0, -2.2, 0]}
    />
  )
}

// ── Scene ─────────────────────────────────────────────────────────────────────
interface AvatarSceneProps {
  speaking: boolean
  currentViseme: string
}

export default function AvatarScene({ speaking, currentViseme }: AvatarSceneProps) {
  return (
    <div
      className="w-72 h-72 sm:w-80 sm:h-80 rounded-full overflow-hidden border-2 border-slate-700 relative"
      style={{ boxShadow: speaking ? '0 0 32px 4px rgba(99,102,241,0.35)' : undefined }}
      aria-label="3D avatar of Prasanna Kumar"
    >
      <Canvas
        camera={{ position: [0, 0.2, 1.8], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 4, 3]} intensity={1.2} castShadow />
        <directionalLight position={[-2, 2, -2]} intensity={0.4} color="#818cf8" />
        <Environment preset="city" />
        <AvatarMesh speaking={speaking} currentViseme={currentViseme} />
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.8}
          minAzimuthAngle={-Math.PI / 6}
          maxAzimuthAngle={Math.PI / 6}
        />
      </Canvas>
    </div>
  )
}

// Preload hint for Draco decoder (drei handles this automatically)
useGLTF.preload('/avatar/me.glb')
