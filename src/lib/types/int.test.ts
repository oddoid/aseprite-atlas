import {Int} from './int'

describe('Int()', () => {
  test('integer', () => expect(Int(1)).toStrictEqual(1))

  test('fraction', () => expect(Int(7 / 2)).toStrictEqual(3))
})

describe('assert()', () => {
  test('integer', () => Int.assert(1))

  test('Int', () => Int.assert(Int(2)))

  test('fraction', () => expect(() => Int.assert(7 / 2)).toThrow())
})

describe('is()', () => {
  test('integer', () => expect(Int.is(1)).toStrictEqual(true))

  test('Int', () => expect(Int.is(Int(2))).toStrictEqual(true))

  test('fraction', () => expect(Int.is(7 / 2)).toStrictEqual(false))
})
