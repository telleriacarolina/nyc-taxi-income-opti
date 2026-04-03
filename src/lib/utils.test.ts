import { describe, it, expect } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('returns a single class name', () => {
    expect(cn('foo')).toBe('foo')
  })

  it('merges multiple class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('handles conditional classes (truthy)', () => {
    expect(cn('foo', true && 'bar')).toBe('foo bar')
  })

  it('handles conditional classes (falsy)', () => {
    expect(cn('foo', false && 'bar')).toBe('foo')
  })

  it('merges Tailwind conflicting classes (last wins)', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('handles undefined and null gracefully', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar')
  })

  it('handles empty input', () => {
    expect(cn()).toBe('')
  })

  it('handles object syntax', () => {
    expect(cn({ foo: true, bar: false })).toBe('foo')
  })

  it('handles array syntax', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar')
  })
})
