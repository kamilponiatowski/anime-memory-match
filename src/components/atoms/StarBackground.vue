<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

const canvasRef = ref<HTMLCanvasElement | null>(null)

interface Star {
  baseX: number
  baseY: number
  x: number
  y: number
  size: number
  opacity: number
  twinklePhase: number
  twinkleSpeed: number
  parallaxFactor: number
}

let animId = 0
let mouseX = 0
let mouseY = 0
let stars: Star[] = []

function initStars(w: number, h: number) {
  const count = Math.min(Math.floor((w * h) / 4500), 220)
  stars = Array.from({ length: count }, () => {
    const bx = Math.random() * w
    const by = Math.random() * h
    return {
      baseX: bx,
      baseY: by,
      x: bx,
      y: by,
      size: Math.random() * 1.6 + 0.3,
      opacity: Math.random() * 0.55 + 0.15,
      twinklePhase: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.003 + Math.random() * 0.007,
      parallaxFactor: 0.06 + Math.random() * 0.18,
    }
  })
}

function draw(timestamp: number) {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')!
  const w = canvas.width
  const h = canvas.height

  ctx.clearRect(0, 0, w, h)

  const cx = w / 2
  const cy = h / 2
  const dx = (mouseX - cx) / cx
  const dy = (mouseY - cy) / cy

  for (const star of stars) {
    // Parallax offset from mouse
    const tx = star.baseX - dx * star.parallaxFactor * 40
    const ty = star.baseY - dy * star.parallaxFactor * 40

    // Repulsion: mouse pushes stars away
    const distX = mouseX - tx
    const distY = mouseY - ty
    const dist = Math.sqrt(distX * distX + distY * distY)
    const repulseR = 100
    let repX = tx
    let repY = ty
    if (dist < repulseR && dist > 0.1) {
      const force = (1 - dist / repulseR) * 0.4
      repX = tx - (distX / dist) * repulseR * force
      repY = ty - (distY / dist) * repulseR * force
    }

    // Lerp to target
    star.x += (repX - star.x) * 0.04
    star.y += (repY - star.y) * 0.04

    // Twinkle
    star.twinklePhase += star.twinkleSpeed
    const tw = 0.7 + Math.sin(star.twinklePhase) * 0.3
    const finalOpacity = star.opacity * tw

    ctx.beginPath()
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(200, 210, 255, ${finalOpacity})`
    ctx.fill()
  }

  animId = requestAnimationFrame(draw)
}

function resize() {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  initStars(canvas.width, canvas.height)
}

function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX
  mouseY = e.clientY
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize, { passive: true })
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  animId = requestAnimationFrame(draw)
})

onUnmounted(() => {
  cancelAnimationFrame(animId)
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', onMouseMove)
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 z-0 pointer-events-none"
    aria-hidden="true"
  />
</template>
