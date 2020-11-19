/** An integral number. */
export type Int = number & {[brand]: void}
declare const brand: unique symbol

export namespace Int {
  export function to(value: number): Int {
    return <Int>~~value
  }

  export function assert(value: number | Int): asserts value is Int {
    if (!is(value)) throw new Error(`${value} is not an integer.`)
  }

  export function is(value: number | Int): value is Int {
    return ~~value === value
  }
}
