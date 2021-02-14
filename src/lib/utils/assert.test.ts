import {assert, assertType, requireType} from './assert'

test('assert(false)', () => expect(() => assert(false, 'msg')).toThrow('msg'))

test('assert(true)', () => expect(assert(true)).toBeUndefined())

describe.each([
  ['assertType()', assertType],
  ['requireType()', requireType]
])('%s', (_, fnc) =>
  test.each([
    ['undefined', undefined, true],
    ['null', null, true],
    ['boolean', false, false],
    ['number', 0, false],
    ['string', '', false],
    ['object', {}, false],
    ['array', [], false]
  ])('%# %p %p', (_, val, throws) => {
    if (throws) expect(() => fnc<typeof val>(val, 'T')).toThrow('T')
    else
      expect(fnc<typeof val>(val)).toStrictEqual(
        fnc === assertType ? undefined : val
      )
  })
)
