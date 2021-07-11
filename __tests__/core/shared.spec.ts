import { initFirebase } from '../src'
import { walkSet } from '../../src/core'

beforeAll(() => {
  initFirebase()
})

describe('shared tools', () => {
  it('simple walkset nested access', () => {
    expect(walkSet({ a: { b: true } }, 'a.b', 2)).toBe(2)
  })
})
