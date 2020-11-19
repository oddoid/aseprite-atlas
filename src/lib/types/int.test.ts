import {Integer} from './Integer'

describe('Integer()', () => {
  test('integer', () => expect(Integer(1)).toStrictEqual(1))

  test('fraction', () => expect(Integer(7 / 2)).toStrictEqual(3))
})

describe('assert()', () => {
  test('integer', () => Integer.assert(1))

  test('Integer', () => Integer.assert(Integer(2)))

  test('fraction', () => expect(() => Integer.assert(7 / 2)).toThrow())
})

describe('is()', () => {
  test('integer', () => expect(Integer.is(1)).toStrictEqual(true))

  test('Integer', () => expect(Integer.is(Integer(2))).toStrictEqual(true))

  test('fraction', () => expect(Integer.is(7 / 2)).toStrictEqual(false))
})
