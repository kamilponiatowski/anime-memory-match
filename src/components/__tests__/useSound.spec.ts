import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

function deferred<T>() {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

describe('useSound', () => {
  let radioPlay: ReturnType<typeof deferred<void>>

  beforeEach(() => {
    vi.resetModules()
    radioPlay = deferred<void>()

    class MockAudio {
      static instances: MockAudio[] = []

      src: string
      volume = 1
      paused = true
      error = null
      listeners = new Map<string, EventListener>()

      constructor(src = '') {
        this.src = src
        MockAudio.instances.push(this)
      }

      play = vi.fn<() => Promise<void>>(() => {
        this.paused = false
        return radioPlay.promise
      })

      pause = vi.fn<() => void>(() => {
        this.paused = true
      })

      load = vi.fn<() => void>()

      removeAttribute = vi.fn<(name: string) => void>((name: string) => {
        if (name === 'src') this.src = ''
      })

      addEventListener = vi.fn<(event: string, listener: EventListener) => void>((event: string, listener: EventListener) => {
        this.listeners.set(event, listener)
      })
    }

    class MockAudioContext {
      state = 'running'
      currentTime = 0
      destination = {}

      resume = vi.fn<() => Promise<void>>(() => Promise.resolve())

      createGain() {
        return {
          connect: vi.fn<() => void>(),
          gain: {
            value: 0,
            setTargetAtTime: vi.fn<(value: number, startTime: number, timeConstant: number) => void>(),
          },
        }
      }
    }

    vi.stubGlobal('Audio', MockAudio)
    vi.stubGlobal('AudioContext', MockAudioContext)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('uses one audio element when ambient start is requested concurrently', async () => {
    const AudioMock = Audio as unknown as { instances: Array<{ play: () => Promise<void>; pause: () => void }> }
    const { useSound } = await import('@/composables/useSound')
    const sound = useSound()

    const firstStart = sound.startAmbientIfOff()
    const secondStart = sound.startAmbientIfOff()

    await Promise.resolve()

    expect(AudioMock.instances).toHaveLength(1)
    expect(AudioMock.instances[0]!.play).toHaveBeenCalledTimes(1)

    radioPlay.resolve()
    await Promise.all([firstStart, secondStart])

    expect(sound.isAmbientOn.value).toBe(true)

    await sound.toggleAmbient()

    expect(AudioMock.instances[0]!.pause).toHaveBeenCalledTimes(1)
  })
})
