import {Aseprite} from '../types/aseprite.js'
import type {Atlas} from '../types/atlas.js'
import type {Int} from '../types/int.js'
import type {Millis} from '../types/millis.js'
import type {Rect} from '../types/rect.js'
import type {WH} from '../types/wh.js'
import type {XY} from '../types/xy.js'

export namespace Parser {
  export function parse(file: Aseprite.File): Atlas {
    assertWH(file.meta.size)
    return Object.freeze({
      version: file.meta.version,
      filename: file.meta.image,
      format: file.meta.format,
      size: file.meta.size,
      animations: parseAnimationRecord(file)
    })
  }

  /** @internal */
  export function parseAnimationRecord({
    meta,
    frames
  }: Aseprite.File): Atlas.AnimationRecord {
    const {frameTags, slices} = meta
    const record: Record<Aseprite.Tag, Atlas.Animation> = {}
    for (const frameTag of frameTags) {
      // Every tag should be unique within the sheet.
      if (frameTag.name in record)
        throw new Error(`Duplicate tag "${frameTag.name}".`)
      record[frameTag.name] = parseAnimation(frameTag, frames, slices)
    }
    return Object.freeze(record)
  }

  /** @internal */
  export function parseAnimation(
    frameTag: Aseprite.FrameTag,
    frameMap: Aseprite.FrameMap,
    slices: readonly Aseprite.Slice[]
  ): Atlas.Animation {
    const frames = tagFrames(frameTag, frameMap)
    const cels = frames.map((frame, i) => {
      Int.assert(i)
      return parseCel(frameTag, frame, i, slices)
    })
    let duration = cels.reduce((time, {duration}) => time + duration, 0)
    const pingPong = frameTag.direction === Aseprite.Direction.PingPong
    if (pingPong && cels.length > 2)
      duration +=
        duration - (cels[0]!.duration + cels[cels.length - 1]!.duration)

    if (!cels.length)
      throw new Error(`"${frameTag.name}" animation missing cels.`)
    if (
      cels
        .slice(0, -1)
        .some(({duration}) => duration === Number.POSITIVE_INFINITY)
    )
      throw new Error(
        `Intermediate cel has infinite duration for "${frameTag.name}" animation.`
      )

    const {w, h} = frames[0]!.sourceSize
    Int.assert(w)
    Int.assert(h)
    return {
      size: Object.freeze({w, h}),
      cels: Object.freeze(cels),
      duration,
      direction: parseDirection(frameTag.direction)
    }
  }

  function tagFrames(
    {name, from, to}: Aseprite.FrameTag,
    frameMap: Aseprite.FrameMap
  ): readonly Aseprite.Frame[] {
    const frames = []
    for (; from <= to; ++from) {
      const frame = frameMap[`${name} ${from}`]
      if (!frame) throw new Error(`Missing Frame "${name} ${from}".`)
      frames.push(frame)
    }
    return frames
  }

  /** @internal */
  export function parseDirection(
    direction: Aseprite.Direction | string
  ): Aseprite.Direction {
    if (isDirection(direction)) return direction
    throw new Error(`"${direction}" is not a Direction.`)
  }

  /** @internal */
  export function isDirection(value: string): value is Aseprite.Direction {
    return Object.values(Aseprite.Direction).some(
      direction => value === direction
    )
  }

  /** @internal */
  export function parseCel(
    frameTag: Aseprite.FrameTag,
    frame: Aseprite.Frame,
    frameNumber: Int,
    slices: readonly Aseprite.Slice[]
  ): Atlas.Cel {
    return Object.freeze({
      position: parsePosition(frame),
      duration: parseDuration(frame.duration),
      slices: parseSlices(frameTag, frameNumber, slices)
    })
  }

  /** @internal */
  export function parsePosition(frame: Aseprite.Frame): Readonly<XY> {
    const padding = parsePadding(frame)
    const x = frame.frame.x + padding.w / 2
    const y = frame.frame.y + padding.h / 2
    Int.assert(x)
    Int.assert(y)
    return Object.freeze({x, y})
  }

  /** @internal */
  export function parsePadding({
    frame,
    sourceSize
  }: Aseprite.Frame): Readonly<WH> {
    const w = frame.w - sourceSize.w
    const h = frame.h - sourceSize.h
    Int.assert(w)
    Int.assert(h)
    return Object.freeze({w, h})
  }

  /** @internal */
  export function parseDuration(
    duration: Aseprite.Duration
  ): Millis | typeof Number.POSITIVE_INFINITY {
    if (duration <= 0) throw new Error('Expected positive cel duration.')
    return duration === Aseprite.Infinite ? Number.POSITIVE_INFINITY : duration
  }

  /** @internal */
  export function parseSlices(
    {name}: Aseprite.FrameTag,
    index: Int,
    slices: readonly Aseprite.Slice[]
  ): readonly Readonly<Rect>[] {
    const bounds = []
    for (const slice of slices) {
      // Ignore Slices not for this Tag.
      if (slice.name !== name) continue
      // Get the greatest relevant Key.
      const key = slice.keys.filter(key => key.frame <= index).slice(-1)[0]
      if (key) {
        assertRect(key.bounds)
        bounds.push(key.bounds)
      }
    }
    return Object.freeze(bounds)
  }

  /** @internal */
  export function assertRect(rect: Aseprite.Rect): asserts rect is Rect {
    assertXY(rect)
    assertWH(rect)
  }

  /** @internal */
  export function assertWH(wh: Aseprite.WH): asserts wh is WH {
    Int.assert(wh.w)
    Int.assert(wh.h)
  }

  /** @internal */
  export function assertXY(xy: Aseprite.XY): asserts xy is XY {
    Int.assert(xy.x)
    Int.assert(xy.y)
  }
}
