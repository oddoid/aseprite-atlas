import type {Aseprite} from './aseprite.js'
import type {
  Millis,
  RInt,
  WHInt
} from '../../node_modules/matoid/dist/matoid/matoid.js'

/**
 * All `Animations` and metadata for a sprite sheet.
 *
 * All types are immutably frozen by their parsers. The reason is that this
 * data comes from the sprite sheet and is expected to be unchanging. If you
 * need a mutable copy, create a duplicate instance of the parts that change.
 */
export type Atlas<AtlasID extends Aseprite.Tag> = Readonly<{
  /** The Aseprite version of the parsed file. E.g., '1.2.8.1'. */
  version: string
  /** The atlas image basename. E.g., 'atlas.png'. */
  filename: string
  /** Atlas image format. E.g., 'RGBA8888' or 'I8'. */
  format: string
  /** Atlas image dimensions (power of 2). */
  size: Readonly<WHInt>
  animations: Atlas.AnimationRecord<AtlasID>
}>

export namespace Atlas {
  /** `Animation` look up table. */
  export type AnimationRecord<AtlasID extends Aseprite.Tag> = Readonly<
    Record<AtlasID, Animation>
  >

  /** A sequence of animation `Cel`s. */
  export type Animation = Readonly<{
    /**
     * Width and height within the source atlas image in integral pixels.
     * Dimensions are identical for every cel.
     */
    size: Readonly<WHInt>
    /** Every Animation is expected to have at least one Cel. */
    cels: readonly Cel[]
    /**
     * Positive animation length in milliseconds for a full cycle, possibly
     * infinite. For a ping-pong animation, this is a full traversal forward
     * plus the traversal backward excluding the first and last frame. E.g.,
     * in a five cel animation, the total duration would be the sum of the
     * individual durations for the initial five frames and the middle three
     * frames.
     */
    duration: Millis
    direction: Aseprite.Direction
  }>

  /** A single frame of an animation sequence. */
  export type Cel = Readonly<{
    /**
     * Location and area within the source atlas image in integral pixels from
     * the top-left. The width and height match the owning Animation's `size`
     * and are for convenience only.
     */
    bounds: Readonly<RInt>
    /** Positive cel exposure in integral milliseconds, possibly infinite. */
    duration: Millis | typeof Number.POSITIVE_INFINITY
    /** Slices within the cel in local pixels. */
    slices: readonly Readonly<RInt>[]
  }>
}
