"use client"

import * as React from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Float, useTexture } from "@react-three/drei"
import * as THREE from "three"

/**
 * Desktop 3D hero scene (React Three Fiber).
 * Maps the Figma "3D Layer / …" composition: three floating product packs and
 * the teal orbit ring, with slow pointer parallax. The scene stage is 560×900
 * CSS px; the camera is set so 1 world unit = 1 CSS px at z = 0.
 */

const STAGE_W = 560
const STAGE_H = 900
const FOV = 30
const CAMERA_Z = STAGE_H / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2))

/** Figma positions inside the stage (top-left x/y, size, CSS rotation in deg). */
const PANELS = [
  { src: "/images/hero/dried-prawns-100g.jpg", x: 160, y: 150, w: 280, h: 360, rot: 8, z: -60, speed: 1.1 },
  { src: "/images/hero/head-on-sprats-200g.jpg", x: 40, y: 250, w: 330, h: 430, rot: -4, z: 40, speed: 0.9 },
  { src: "/images/hero/baby-shrimp-100g.jpg", x: 330, y: 520, w: 190, h: 210, rot: 12, z: 90, speed: 1.3 },
] as const

/** Stage px (top-left origin) → world units (centre origin, y up). */
function toWorld(x: number, y: number, w: number, h: number) {
  return [x + w / 2 - STAGE_W / 2, -(y + h / 2 - STAGE_H / 2)] as const
}

function Panel({ src, x, y, w, h, rot, z, speed }: (typeof PANELS)[number]) {
  const texture = useTexture(src, (t) => {
    t.colorSpace = THREE.SRGBColorSpace
  })
  const [px, py] = toWorld(x, y, w, h)
  return (
    <Float speed={speed} rotationIntensity={0.12} floatIntensity={8} floatingRange={[-1, 1]}>
      <group position={[px, py, z]} rotation={[0, 0, THREE.MathUtils.degToRad(-rot)]}>
        {/* soft shadow */}
        <mesh position={[10, -16, -2]}>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial color="#05101c" transparent opacity={0.35} />
        </mesh>
        <mesh>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  )
}

function OrbitRing() {
  const ref = React.useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * 0.05
  })
  const [px, py] = toWorld(0, 150, 560, 560)
  return (
    <mesh ref={ref} position={[px, py, -120]}>
      <ringGeometry args={[279.5, 280.5, 128]} />
      <meshBasicMaterial color="#16B8B0" transparent opacity={0.35} />
    </mesh>
  )
}

function Rig({ children }: { children: React.ReactNode }) {
  const group = React.useRef<THREE.Group>(null)
  const { pointer } = useThree()
  useFrame((_, delta) => {
    const g = group.current
    if (!g) return
    const k = 1 - Math.pow(0.001, delta) // frame-rate independent easing
    g.rotation.y += (pointer.x * 0.12 - g.rotation.y) * k * 0.6
    g.rotation.x += (-pointer.y * 0.08 - g.rotation.x) * k * 0.6
  })
  return <group ref={group}>{children}</group>
}

/** Mounted inside Suspense: runs once all textures have loaded. */
function Ready({ onReady }: { onReady?: () => void }) {
  React.useEffect(() => {
    onReady?.()
  }, [onReady])
  return null
}

export default function HeroScene({ onReady }: { onReady?: () => void }) {
  const wrapper = React.useRef<HTMLDivElement>(null)
  const [visible, setVisible] = React.useState(true)

  // Pause rendering when the hero is off-screen.
  React.useEffect(() => {
    const el = wrapper.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={wrapper} className="absolute inset-0">
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: FOV, position: [0, 0, CAMERA_Z], near: 10, far: CAMERA_Z * 2 }}
        eventSource={document.body}
        eventPrefix="client"
        aria-hidden
      >
        <React.Suspense fallback={null}>
          <Rig>
            <OrbitRing />
            {PANELS.map((p) => (
              <Panel key={p.src} {...p} />
            ))}
          </Rig>
          <Ready onReady={onReady} />
        </React.Suspense>
      </Canvas>
    </div>
  )
}
