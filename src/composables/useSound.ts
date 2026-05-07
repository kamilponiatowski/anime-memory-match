/**
 * useSound – singleton composable.
 * Efekty dźwiękowe: Web Audio API.
 * Muzyka tła: darmowe radio anime z listen.moe.
 */
import { ref } from 'vue'

// ── Radio streams — listen.moe (darmowe radio anime/J-pop) ─────────────────
// Więcej streamów: https://listen.moe
const RADIO_STREAMS: string[] = [
  'https://listen.moe/stream',       // J-POP anime (primary)
  'https://listen.moe/kpop/stream',  // K-POP (fallback)
]

// ── Singleton state ─────────────────────────────────────────────────────────
let _ctx: AudioContext | null = null
let _masterGain: GainNode | null = null
let _radioEl: HTMLAudioElement | null = null
let _streamIdx = 0

const _isMuted = ref(false)
const _isAmbientOn = ref(false)

// ── AudioContext helpers (efekty dźwiękowe) ─────────────────────────────────
function getCtx(): AudioContext {
  if (!_ctx) {
    _ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    _masterGain = _ctx.createGain()
    _masterGain.gain.value = 1
    _masterGain.connect(_ctx.destination)
  }
  return _ctx
}

async function ensureRunning(): Promise<AudioContext> {
  const ctx = getCtx()
  if (ctx.state === 'suspended') await ctx.resume()
  return ctx
}

function tone(
  freq: number,
  duration: number,
  vol = 0.1,
  type: OscillatorType = 'sine',
  delay = 0,
) {
  try {
    const ctx = getCtx()
    if (ctx.state === 'suspended' || !_masterGain) return
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.connect(g)
    g.connect(_masterGain)
    osc.type = type
    osc.frequency.value = freq
    const t = ctx.currentTime + delay
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(vol, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
    osc.start(t)
    osc.stop(t + duration + 0.05)
  } catch {}
}

// ── Radio helpers ────────────────────────────────────────────────────────────
async function startRadio(): Promise<void> {
  if (_radioEl) return
  const src = RADIO_STREAMS[_streamIdx] ?? RADIO_STREAMS[0]!
  const audio = new Audio(src)
  audio.volume = _isMuted.value ? 0 : 0.35
  audio.onerror = () => {
    // Spróbuj następnego streamu przy błędzie
    _streamIdx = (_streamIdx + 1) % RADIO_STREAMS.length
    if (_radioEl) {
      _radioEl.src = RADIO_STREAMS[_streamIdx] ?? RADIO_STREAMS[0]!
      _radioEl.play().catch(() => {})
    }
  }
  // throws DOMException if browser blocks autoplay — caller handles it
  await audio.play()
  _radioEl = audio // only assigned after successful play
}

function stopRadio() {
  if (!_radioEl) return
  _radioEl.pause()
  _radioEl.src = ''
  _radioEl = null
  _streamIdx = 0
}

// ── Public composable ────────────────────────────────────────────────────────
export function useSound() {
  async function playFlip() {
    if (_isMuted.value) return
    await ensureRunning()
    tone(900, 0.06, 0.055)
  }

  async function playMatch() {
    if (_isMuted.value) return
    await ensureRunning()
    tone(523.25, 0.25, 0.09)
    tone(659.25, 0.25, 0.08, 'sine', 0.06)
    tone(783.99, 0.35, 0.07, 'sine', 0.12)
  }

  async function playNoMatch() {
    if (_isMuted.value) return
    await ensureRunning()
    tone(340, 0.1, 0.07)
    tone(290, 0.14, 0.06, 'sine', 0.08)
  }

  async function playVictory() {
    if (_isMuted.value) return
    await ensureRunning()
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]
    notes.forEach((f, i) => tone(f, 0.5, 0.1, 'sine', i * 0.1))
  }

  function toggleMute() {
    _isMuted.value = !_isMuted.value
    // Efekty dźwiękowe
    if (_masterGain && _ctx) {
      _masterGain.gain.setTargetAtTime(_isMuted.value ? 0 : 1, _ctx.currentTime, 0.08)
    }
    // Radio
    if (_radioEl) {
      _radioEl.volume = _isMuted.value ? 0 : 0.35
    }
  }

  async function toggleAmbient() {
    if (_isAmbientOn.value) {
      stopRadio()
      _isAmbientOn.value = false
    } else {
      await ensureRunning()
      try {
        await startRadio()
        _isAmbientOn.value = true
      } catch {
        // play() unexpectedly failed — state stays false
      }
    }
  }

  async function startAmbientIfOff() {
    if (_isAmbientOn.value) return
    try {
      await ensureRunning()
      await startRadio()
      _isAmbientOn.value = true
    } catch {
      // autoplay blocked by browser — music button still works on first click
    }
  }

  return {
    isMuted: _isMuted,
    isAmbientOn: _isAmbientOn,
    playFlip,
    playMatch,
    playNoMatch,
    playVictory,
    toggleMute,
    toggleAmbient,
    startAmbientIfOff,
  }
}
