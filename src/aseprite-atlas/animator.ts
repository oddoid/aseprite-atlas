import type {Aseprite} from './aseprite.js'
import type {Atlas} from './atlas.js'
import {
  Int,
  Millis,
  NumberUtil
} from '../../node_modules/matoid/dist/matoid/matoid.js'

export function Animator(animation: Atlas.Animation): Animator {
  return {animation, period: Int(0), exposure: 0}
}

/** Record and update playback state for an `Animation`. */
export type Animator = {
  animation: Atlas.Animation

  /**
   * `Cel` index oscillation state. This integer may fall outside of animation
   * bounds (even negative) depending on the animation interval selected by
   * direction. This value should be carried over from each call unless the
   * `Cel` is manually set. Any integer in [0, `Animation.cels.length`) is
   * always valid. Aseprite indices are u16s but a period can be negative.
   *
   * Every `Animation` is expected to have at least one `Cel` as validated by
   * the parser.
   */
  period: Int

  /**
   * Current `Cel` exposure in milliseconds. When the fractional value meets or
   * exceeds the `Cel` exposure duration, the `Cel` is advanced according to
   * direction. This value should be carried over from each call with the
   * current time step added, and zeroed on manual `Cel` change. Any number in
   * [0, ∞) is valid.
   */
  exposure: Millis
}

export namespace Animator {
  /**
   * Clear the exposure time and set the animation to the starting cel. This is
   * useful when changing animations.
   */
  export function reset(
    animator: Animator,
    animation: Atlas.Animation = animator.animation
  ): void {
    animator.animation = animation
    animator.period = Int(0)
    animator.exposure = 0
  }

  /**
   * Apply the time since last frame was shown, possibly advancing the
   * `Animation` period. The worst case scenario is when `exposure` is
   * `animation.duration - 1` which would iterate over every `Cel` in the
   * `Animation`. Since `Animation`s are usually animated every frame, this
   * is expected to be a rarity.
   *
   * @arg exposure The time delta since the last call to animate(). For example,
   *  in a 60 frames per second animation, this is often ~16.667 milliseconds.
   */
  export function animate(animator: Animator, exposure: Millis): void {
    // Avoid unnecessary iterations by skipping complete `Animation` cycles.
    // `animation.duration` may be infinite but the modulo of any number and
    // infinity is that number. Duration is positive.
    animator.exposure =
      (animator.exposure + exposure) % animator.animation.duration
    for (;;) {
      const {duration} = cel(animator)
      if (animator.exposure < duration) break

      animator.exposure -= duration
      animator.period = nextPeriod[animator.animation.direction](
        animator.period,
        animator.animation.cels.length
      )
    }
  }

  /** @return The `Animation` `Cel` for period. */
  export function cel(animator: Readonly<Animator>): Atlas.Cel {
    return animator.animation.cels[index(animator)]!
  }

  /** @return The `Animation` `Cel` index for period. */
  export function index({animation, period}: Readonly<Animator>): number {
    return Math.abs(period % animation.cels.length)
  }
}

/** Given a period and `Animation` size, advance to the next period. */
const nextPeriod: Readonly<
  Record<Aseprite.Direction, (period: Int, len: number) => Int>
> = Object.freeze({
  /** @arg period An integer in the domain [0, len - 1]. */
  forward(period) {
    return Int((period % Number.MAX_SAFE_INTEGER) + 1)
  },

  /** @arg period An integer in the domain (-∞, len - 1]. */
  reverse(period, len) {
    return Int((period % Number.MIN_SAFE_INTEGER) - 1 + len)
  },

  /** @arg period An integer in the domain [2 - len, len - 1]. */
  pingpong(period, len) {
    return Int(NumberUtil.wrap(period - 1, 2 - len, len))
  }
})
