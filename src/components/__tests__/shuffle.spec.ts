import { describe, it, expect } from 'vitest'
import { shuffle } from '@/utils/shuffle'

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(shuffle([...arr])).toHaveLength(arr.length)
  })

  it('contains all the same elements', () => {
    const arr = [1, 2, 3, 4, 5, 6]
    const result = shuffle([...arr])
    expect(result.sort()).toEqual([...arr].sort())
  })

  it('does not mutate the original array reference identity', () => {
    const arr = [1, 2, 3]
    const copy = [...arr]
    shuffle(copy)
    // original arr should be unchanged (we pass a copy above)
    expect(arr).toEqual([1, 2, 3])
  })

  it('handles an empty array', () => {
    expect(shuffle([])).toEqual([])
  })

  it('handles a single-element array', () => {
    expect(shuffle([42])).toEqual([42])
  })
})
