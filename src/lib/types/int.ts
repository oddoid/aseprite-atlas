import {assert as assertTrue, requireType} from '../utils/assert'

/**
 * An integer `number` in
 * [`Number.MIN_SAFE_INTEGER`, `Number.MAX_SAFE_INTEGER`].
 */
export type Int = number & {[brand]: void}
declare const brand: unique symbol

export function Int(val: number): Int {
  return requireType<Int>(Int.tryTrunc(val), 'Int')
}

// This can be made more generic as a constrained RangeInt / DomainInt / ...
export namespace Int {
  /** Truncate with saturation. */
  export function tryTrunc(value: number): Int | undefined {
    if (Number.isNaN(value)) return
    if (value > Number.MAX_SAFE_INTEGER) return <Int>Number.MAX_SAFE_INTEGER
    if (value < Number.MIN_SAFE_INTEGER) return <Int>Number.MIN_SAFE_INTEGER
    return <Int>Math.trunc(value)
  }

  export function is(val: number | Int): val is Int {
    return Number.isSafeInteger(val)
  }

  export function assert(val: number | Int): asserts val is Int {
    assertTrue(is(val), `${val} is not an Int.`)
  }

  export function require(val: number | Int): Int {
    assertTrue(is(val), `${val} is not an Int.`)
    return val
  }
}
