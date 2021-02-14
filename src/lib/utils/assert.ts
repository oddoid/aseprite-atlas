/** @internal */
export function assert(condition: boolean, msg?: string): asserts condition {
  if (!condition) throw Error(msg)
}

/** @internal */
export function assertType<T>(
  val: Readonly<T | undefined>,
  type?: string
): asserts val is T {
  const msg = `Value is not ${type == null ? 'defined' : `a ${type}`}.`
  assert(val != null, msg)
}

/** @internal */
export function requireType<T>(val: Readonly<T | undefined>, type?: string): T {
  assertType(val, type)
  return val
}
