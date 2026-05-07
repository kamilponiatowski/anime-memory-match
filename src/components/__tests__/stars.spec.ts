import { describe, it, expect } from 'vitest'

/**
 * Star rating logic mirrored from ResultView.vue.
 * Keep in sync with the stars computed property there.
 */
function calculateStars(accuracy: number, timeSeconds: number, totalPairs: number): number {
  const fastThreshold = totalPairs * 10
  if (accuracy >= 100 && timeSeconds <= fastThreshold) return 6
  if (accuracy >= 90 && timeSeconds <= fastThreshold * 1.5) return 5
  if (accuracy >= 75) return 4
  if (accuracy >= 60) return 3
  if (accuracy >= 40) return 2
  return 1
}

describe('star rating', () => {
  const pairs = 8 // medium difficulty

  it('awards 6 stars for perfect accuracy within fast threshold', () => {
    expect(calculateStars(100, pairs * 10, pairs)).toBe(6)
  })

  it('awards 5 stars for ≥90% accuracy within 1.5x threshold', () => {
    expect(calculateStars(90, pairs * 15, pairs)).toBe(5)
  })

  it('awards 4 stars for ≥75% accuracy regardless of time', () => {
    expect(calculateStars(75, 9999, pairs)).toBe(4)
  })

  it('awards 3 stars for ≥60% accuracy', () => {
    expect(calculateStars(60, 9999, pairs)).toBe(3)
  })

  it('awards 2 stars for ≥40% accuracy', () => {
    expect(calculateStars(40, 9999, pairs)).toBe(2)
  })

  it('awards 1 star for accuracy below 40%', () => {
    expect(calculateStars(39, 9999, pairs)).toBe(1)
  })

  it('6 stars NOT awarded when slow even with perfect accuracy', () => {
    expect(calculateStars(100, pairs * 10 + 1, pairs)).toBeLessThan(6)
  })

  it('maximum stars never exceeds 6', () => {
    expect(calculateStars(100, 0, pairs)).toBeLessThanOrEqual(6)
  })
})
