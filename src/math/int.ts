import {assert as assertTrue} from './assert.js'
import {NumberUtil} from './number-util.js'

export const limits = <const>{
  safe: {min: -0x1f_ffff_ffff_ffff, max: 0x1f_ffff_ffff_ffff},
  u8: {min: 0, max: 0xff}
}

export namespace Limits {
  export namespace Safe {
    export type Min = typeof limits.safe.min
    export type Max = typeof limits.safe.max
  }
  export namespace U8 {
    export type Min = typeof limits.u8.min
    export type Max = typeof limits.u8.max
  }
}

type Range<Min, Max> = number & {min: Min; max: Max}

/**
 * A "[safe integer]" `number` in
 * [`Number.MIN_SAFE_INTEGER`, `Number.MAX_SAFE_INTEGER`].
 *
 * [safe integer]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
 */
export type Int = Range<Limits.Safe.Min, Limits.Safe.Max> & {[intBrand]: void}
declare const intBrand: unique symbol

export type U8 = Range<Limits.U8.Min, Limits.U8.Max> & {[u8Brand]: void}
declare const u8Brand: unique symbol

export function Int(val: Int | number): Int {
  Int.assert(val)
  return val
}

export namespace Int {
  /** Attempt to truncate a number with saturation. */
  export function tryClamp<T extends Range<number, number>>(
    val: number,
    min: T['min'],
    max: T['max']
  ): T | undefined {
    const clamped = NumberUtil.tryClamp(val, min, max)
    return clamped === undefined ? undefined : <T>Math.trunc(clamped)
  }

  export function is(val: Int | number): val is Int {
    return Number.isSafeInteger(val)
  }

  export function assert(val: Int | number): asserts val is Int {
    assertTrue(Int.is(val), `${val} is not an Int.`)
  }
}

export const foo: Int | undefined = Int.tryClamp(
  100,
  limits.safe.min,
  limits.safe.max
)
export const bar: U8 | undefined = Int.tryClamp(
  100,
  limits.u8.min,
  limits.u8.max
)

// export function U8(val: U8 | number): U8 {
//   Int.assert(val)
//   return val
// }
