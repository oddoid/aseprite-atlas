/** An integral number. */
export type Int = number & {[brand]: void}
declare const brand: unique symbol

export function Int(value: number): Int {
  if (Number.isNaN(value)) throw new Error('Value is NaN.')
  if (value > Number.MAX_SAFE_INTEGER) return <Int>Number.MAX_SAFE_INTEGER
  if (value < Number.MIN_SAFE_INTEGER) return <Int>Number.MIN_SAFE_INTEGER
  return <Int>Math.trunc(value)
}

export namespace Int {
  export function assert(value: number | Int): asserts value is Int {
    if (!is(value)) throw new Error(`${value} is not an Int.`)
  }

  export function is(value: number | Int): value is Int {
    if (Number.isNaN(value)) return false
    return Int(value) === value
  }
}
