/**
 * An integer `number` in
 * [`Number.MIN_SAFE_INTEGER`, `Number.MAX_SAFE_INTEGER`].
 */
export type Int = number & {[brand]: void}
declare const brand: unique symbol

export function Int(value: number): Int {
  const int = Int.tryTo(value)
  if (int === undefined)
    throw new Error(`${value} cannot be converted to an Int.`)
  return int
}

// This can be made more generic as a constrained RangeInt / DomainInt / ...
export namespace Int {
  /** Truncate with saturation. */
  export function tryTo(value: number): Int | undefined {
    if (Number.isNaN(value)) return
    if (value > Number.MAX_SAFE_INTEGER) return <Int>Number.MAX_SAFE_INTEGER
    if (value < Number.MIN_SAFE_INTEGER) return <Int>Number.MIN_SAFE_INTEGER
    return <Int>Math.trunc(value)
  }

  export function assert(value: number | Int): asserts value is Int {
    if (!is(value)) throw new Error(`${value} is not an Int.`)
  }

  export function is(value: number | Int): value is Int {
    return tryTo(value) === value
  }
}
