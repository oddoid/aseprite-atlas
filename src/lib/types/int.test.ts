import {Int} from './int'

describe('Int()', () => {
  test('integer', () => expect(Int(1)).toStrictEqual(1))

  test('fraction', () => expect(Int(7 / 2)).toStrictEqual(3))

  test('min', () =>
    expect(Int(Number.MIN_SAFE_INTEGER)).toStrictEqual(Number.MIN_SAFE_INTEGER))

  test('zero', () => expect(Int(0)).toStrictEqual(0))

  test('max', () =>
    expect(Int(Number.MAX_SAFE_INTEGER)).toStrictEqual(Number.MAX_SAFE_INTEGER))
})

describe('assert()', () => {
  test('integer', () => Int.assert(1))

  test('Int', () => Int.assert(Int(2)))

  test('fraction', () => expect(() => Int.assert(7 / 2)).toThrow())

  test('min', () => Int.assert(Number.MIN_SAFE_INTEGER))

  test('zero', () => Int.assert(0))

  test('max', () => Int.assert(Number.MAX_SAFE_INTEGER))
})

describe('is()', () => {
  test('integer', () => expect(Int.is(1)).toStrictEqual(true))

  test('Int', () => expect(Int.is(Int(2))).toStrictEqual(true))

  test('fraction', () => expect(Int.is(7 / 2)).toStrictEqual(false))

  test('min', () => expect(Int.is(Number.MIN_SAFE_INTEGER)).toStrictEqual(true))

  test('zero', () => expect(Int.is(0)).toStrictEqual(true))

  test('max', () => expect(Int.is(Number.MAX_SAFE_INTEGER)).toStrictEqual(true))
})
