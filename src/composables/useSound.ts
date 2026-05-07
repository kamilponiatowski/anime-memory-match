/**
 * useSound – true module-level singleton.
 *
 * Single Responsibility:
 *  – Web Audio API for sound effects
 *  – One HTMLAudioElement for background radio (never duplicated)
 *  – Reactive state exposed via refs
 *
 * Rules:
 *  – _radioEl is only assigned after a successful play() promise
 *  – stopRadio() fully cleans up the element before nulling it
 *  – volume is stored in a ref so the slider can bind to it reactively
 */
import { ref } from 'vue'

// ── Streams ──────────────────────────────────────────────────────────────────
const RADIO_STREAMS = [
  'https://listen.moe/stream',
  'https://listen.moe/kpop/stream',
] as const

const DEFAULT_RADIO_VOLUME = 0.35

// ── Module-level singleton state (survives component re-renders / navigation) ─
let _ctx: AudioContext | null = null
let _masterGain: GainNode | null = null
let _radioEl: HTMLAudioElement | null = null
let _streamIdx = 0

/** Reactive refs – shared across ALL useSound() call-sites */
const _isAmbientOn = ref(false)
const _volume = ref(DEFAULT_RADIO_VOLUME) // 0–1, drives both radio & effects

// ── AudioContext helpers ─────────────────────────────────────────────────────
function getCtx(): AudioContext {
  if (!_ctx) {
    _ctx = new (window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    _masterGain = _ctx.createGain()
    _masterGain.gain.value = _volume.value
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
  delaySeconds = 0,
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
    const t = ctx.currentTime + delaySeconds
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(vol, t + 0.012)
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
    osc.start(t)
    osc.stop(t + duration + 0.05)
  } catch { /* AudioContext not available */ }
}

// ── Radio helpers ─────────────────────────────────────────────────────────────
/** Returns the existing element if already playing – never creates a second one */
async function startRadio(): Promise<void> {
  if (_radioEl) {
    // Already exists – just unpause if needed
    if (_radioEl.paused) await _radioEl.play()
    return
  }
  const src = RADIO_STREAMS[_streamIdx]!
  const audio = new Audio(src)
  audio.volume = _volume.value

  audio.addEventListener('error', () => {
    _streamIdx = (_streamIdx + 1) % RADIO_STREAMS.length
    if (_radioEl) {
      _radioEl.src = RADIO_STREAMS[_streamIdx]!
      _radioEl.load()
      _radioEl.play().catch(() => {})
    }
  })

  // Will throw DOMException if blocked by autoplay policy – caller must handle
  await audio.play()
  _radioEl = audio
}

function stopRadio(): void {
  if (!_radioEl) return
  _radioEl.pause()
  _radioEl.removeAttribute('src')
  _radioEl.load() // abort pending network request
  _radioEl = null
  _streamIdx = 0
}

function applyVolume(v: number): void {
  _volume.value = v
  if (_masterGain && _ctx) {
    _masterGain.gain.setTargetAtTime(v, _ctx.currentTime, 0.05)
  }
  if (_radioEl) {
    _radioEl.volume = v
  }
}

// ── Public composable ─────────────────────────────────────────────────────────
export function useSound() {
  // ── Sound effects ──────────────────────────────────────────────────────────
  async function playFlip() {
    if (_volume.value === 0) return
    await ensureRunning()
    tone(900, 0.06, 0.055)
  }

  async function playMatch() {
    if (_volume.value === 0) return
    await ensureRunning()
    tone(523.25, 0.25, 0.09)
    tone(659.25, 0.25, 0.08, 'sine', 0.06)
    tone(783.99, 0.35, 0.07, 'sine', 0.12)
  }

  async function playNoMatch() {
    if (_volume.value === 0) return
    await ensureRunning()
    tone(340, 0.1, 0.07)
    tone(290, 0.14, 0.06, 'sine', 0.08)
  }

  async function playVictory() {
    if (_volume.value === 0) return
    await ensureRunning()
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]
    notes.forEach((f, i) => tone(f, 0.5, 0.1, 'sine', i * 0.1))
  }

  // ── Ambient music ──────────────────────────────────────────────────────────
  async function toggleAmbient(): Promise<void> {
    if (_isAmbientOn.value) {
      stopRadio()
      _isAmbientOn.value = false
    } else {
      try {
        await ensureRunning()
        await startRadio()
        _isAmbientOn.value = true
      } catch {
        // Autoplay blocked – state stays false, user can retry by clicking again
      }
    }
  }

  /** Called on mount / cookie consent: silently tries to autoplay. */
  async function startAmbientIfOff(): Promise<void> {
    if (_isAmbientOn.value) return
    try {
      await ensureRunning()
      await startRadio()
      _isAmbientOn.value = true
    } catch {
      // Autoplay blocked – music button still works on first explicit click
    }
  }

  /** Bind to a range input (0–1). Persists across renders. */
  function setVolume(v: number): void {
    applyVolume(Math.max(0, Math.min(1, v)))
  }

  return {
    isAmbientOn: _isAmbientOn,
    volume: _volume,
    playFlip,
    playMatch,
    playNoMatch,
    playVictory,
    toggleAmbient,
    startAmbientIfOff,
    setVolume,
  }
}
