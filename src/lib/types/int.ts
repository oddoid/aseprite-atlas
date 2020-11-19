/** An integral number. */
export type Int = number & {[brand]: void}
declare const brand: unique symbol

export function Int(value: number): Int {
  return <Int>~~value
}

export namespace Int {
  export function assert(value: number | Int): asserts value is Int {
    if (!is(value)) throw new Error(`${value} is not an Int.`)
  }

  export function is(value: number | Int): value is Int {
    return ~~value === value
  }
}
