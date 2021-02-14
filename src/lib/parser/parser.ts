import {Aseprite} from '../types/aseprite.js'
import {assert} from '../utils/assert.js'
import {Atlas} from '../types/atlas.js'
import {Int} from '../types/int.js'
import {Millis} from '../types/millis.js'
import {Rect} from '../types/rect.js'
import {WH} from '../types/wh.js'
import {XY} from '../types/xy.js'

export namespace Parser {
  export function parse(file: Aseprite.File): Atlas {
    return Object.freeze({
      version: file.meta.version,
      filename: file.meta.image,
      format: file.meta.format,
      size: parseWH(file.meta.size),
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
      assert(record[frameTag.name] == null, `Duplicate tag "${frameTag.name}".`)
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
    const cels = frames.map((frame, i) =>
      parseCel(frameTag, frame, Int.require(i), slices)
    )
    let duration = cels.reduce((time, {duration}) => time + duration, 0)
    const pingPong = frameTag.direction === Aseprite.Direction.PingPong
    if (pingPong && cels.length > 2)
      duration +=
        duration - (cels[0]!.duration + cels[cels.length - 1]!.duration)

    assert(cels.length > 0, `"${frameTag.name}" animation has no cels.`)
    assert(
      cels
        .slice(0, -1)
        .every(({duration}) => duration !== Number.POSITIVE_INFINITY),
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
      assert(frame != null, `Missing Frame "${name} ${from}".`)
      frames.push(frame)
    }
    return frames
  }

  /** @internal */
  export function parseDirection(
    direction: Aseprite.Direction | string
  ): Aseprite.Direction {
    assert(isDirection(direction), `"${direction}" is not a Direction.`)
    return direction
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
    const x = Int.require(frame.frame.x + padding.w / 2)
    const y = Int.require(frame.frame.y + padding.h / 2)
    return Object.freeze({x, y})
  }

  /** @internal */
  export function parsePadding({
    frame,
    sourceSize
  }: Aseprite.Frame): Readonly<WH> {
    const w = Int.require(frame.w - sourceSize.w)
    const h = Int.require(frame.h - sourceSize.h)
    return Object.freeze({w, h})
  }

  /** @internal */
  export function parseDuration(
    duration: Aseprite.Duration
  ): Millis | typeof Number.POSITIVE_INFINITY {
    assert(duration > 0, 'Cel duration is not positive.')
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
      // Get the greatest relevant Key, if any.
      const key = slice.keys.filter(key => key.frame <= index).slice(-1)[0]
      if (key != null) bounds.push(parseRect(key.bounds))
    }
    return Object.freeze(bounds)
  }

  /** @internal */
  export function parseRect(rect: Aseprite.Rect): Rect {
    assert(isRect(rect), `${rect} is not an Rect.`)
    return rect
  }

  /** @internal */
  export function isRect(rect: Aseprite.Rect): rect is Rect {
    return isXY(rect) && isWH(rect)
  }

  /** @internal */
  export function parseWH(wh: Aseprite.WH): WH {
    assert(isWH(wh), `${wh} is not an WH.`)
    return wh
  }

  /** @internal */
  export function isWH(wh: Aseprite.WH): wh is WH {
    return Int.is(wh.w) && Int.is(wh.h)
  }

  /** @internal */
  export function parseXY(xy: Aseprite.XY): XY {
    assert(isXY(xy), `${xy} is not an XY.`)
    return xy
  }

  /** @internal */
  export function isXY(xy: Aseprite.XY): xy is XY {
    return Int.is(xy.x) && Int.is(xy.y)
  }
}
