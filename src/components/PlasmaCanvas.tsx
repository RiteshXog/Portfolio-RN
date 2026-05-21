import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function PlasmaCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.innerWidth < 768) return
    const canvas = canvasRef.current
    if (!canvas) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    camera.position.set(0, 0, 1)
    camera.lookAt(0, 0, 0)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: false,
      alpha: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)

    // Grid dimensions
    const width = 240
    const height = 135
    const count = width * height

    // Simplex noise implementation
    const perm = new Uint8Array(512)
    const grad3: number[][] = [
      [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
      [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
      [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
    ]

    // Initialize permutation table
    const p = new Uint8Array(256)
    for (let i = 0; i < 256; i++) p[i] = i
    // Shuffle
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[p[i], p[j]] = [p[j], p[i]]
    }
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255]

    function dot3(g: number[], x: number, y: number, z: number) {
      return g[0] * x + g[1] * y + g[2] * z
    }

    function noise3D(xin: number, yin: number, zin: number): number {
      const F3 = 1.0 / 3.0
      const G3 = 1.0 / 6.0
      const s = (xin + yin + zin) * F3
      const i = Math.floor(xin + s)
      const j = Math.floor(yin + s)
      const k = Math.floor(zin + s)
      const t = (i + j + k) * G3
      const X0 = i - t, Y0 = j - t, Z0 = k - t
      const x0 = xin - X0, y0 = yin - Y0, z0 = zin - Z0
      let i1: number, j1: number, k1: number
      let i2: number, j2: number, k2: number
      if (x0 >= y0) {
        if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0 }
        else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1 }
        else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1 }
      } else {
        if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1 }
        else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1 }
        else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0 }
      }
      const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3
      const x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3
      const x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3
      const ii = i & 255, jj = j & 255, kk = k & 255
      const gi0 = perm[ii + perm[jj + perm[kk]]] % 12
      const gi1 = perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12
      const gi2 = perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12
      const gi3 = perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12
      let n0: number, n1: number, n2: number, n3: number
      let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0
      if (t0 < 0) n0 = 0
      else { t0 *= t0; n0 = t0 * t0 * dot3(grad3[gi0], x0, y0, z0) }
      let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1
      if (t1 < 0) n1 = 0
      else { t1 *= t1; n1 = t1 * t1 * dot3(grad3[gi1], x1, y1, z1) }
      let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2
      if (t2 < 0) n2 = 0
      else { t2 *= t2; n2 = t2 * t2 * dot3(grad3[gi2], x2, y2, z2) }
      let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3
      if (t3 < 0) n3 = 0
      else { t3 *= t3; n3 = t3 * t3 * dot3(grad3[gi3], x3, y3, z3) }
      return 32 * (n0 + n1 + n2 + n3)
    }

    // Instanced mesh setup
    const geometry = new THREE.PlaneGeometry(0.006, 0.006)
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#ff6f00'),
      transparent: true,
      opacity: 0.85,
    })
    const mesh = new THREE.InstancedMesh(geometry, material, count)

    // Initialize matrices
    const dummy = new THREE.Object3D()
    const imatrices = new Float32Array(count * 16)

    for (let i = 0; i < count; i++) {
      const gx = i % width
      const gy = Math.floor(i / width)
      const u = gx / (width - 1)
      const v = gy / (height - 1)

      dummy.position.set(u, v, 0)
      const scale = noise3D(u, v, 0) * 0.5 + 0.5
      dummy.scale.set(scale, scale, 1)
      dummy.updateMatrix()

      for (let j = 0; j < 16; j++) {
        imatrices[i * 16 + j] = dummy.matrix.elements[j]
      }
    }

    mesh.instanceMatrix = new THREE.InstancedBufferAttribute(imatrices, 16)
    scene.add(mesh)

    // Mouse state
    const mouse = { x: 0, y: 0, lerpX: 0, lerpY: 0 }

    function handleMouseMove(event: MouseEvent) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    function handleClick() {
      mouse.lerpX = 1.0
      mouse.lerpY = 1.0
      setTimeout(() => {
        mouse.lerpX = 0
        mouse.lerpY = 0
      }, 100)
    }

    function handleResize() {
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('click', handleClick)
    window.addEventListener('resize', handleResize)

    // Animation loop
    let t = 0
    let animationId: number

    function animate() {
      animationId = requestAnimationFrame(animate)

      t += 0.0015

      // Decay burst
      if (mouse.lerpX > 0) {
        mouse.lerpX -= 0.008
        if (mouse.lerpX < 0) mouse.lerpX = 0
      }
      if (mouse.lerpY > 0) {
        mouse.lerpY -= 0.008
        if (mouse.lerpY < 0) mouse.lerpY = 0
      }

      // Update all particles
      for (let i = 0; i < count; i++) {
        const gx = i % width
        const gy = Math.floor(i / width)
        const u = gx / (width - 1)
        const v = gy / (height - 1)

        const n1 = noise3D(u, v, t)
        const n2 = noise3D(u + 100, v + 100, t)

        dummy.position.set(
          u + n1 * 0.04 * (mouse.lerpX + 0.25),
          v + n2 * 0.04 * (mouse.lerpY + 0.25),
          0
        )

        const dx = dummy.position.x - mouse.x * 0.5 + 0.5
        const dy = dummy.position.y - mouse.y * 0.5 + 0.5
        const d = Math.sqrt(dx * dx + dy * dy)

        let scale = noise3D(u, v, t) * 0.5 + 0.5

        if (d < 0.3) {
          scale += (1.0 + noise3D(u, v, t)) * 0.2 * mouse.lerpY
          dummy.position.x += (mouse.x - dummy.position.x) * 0.01
          dummy.position.y += (mouse.y - dummy.position.y) * 0.01
        }

        dummy.scale.set(scale, scale, scale)
        dummy.updateMatrix()
        mesh.setMatrixAt(i, dummy.matrix)
      }

      mesh.instanceMatrix.needsUpdate = true
      renderer.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('click', handleClick)
      window.removeEventListener('resize', handleResize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  if (typeof window !== 'undefined' && window.innerWidth < 768) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
