import type {Int} from './int.js'

/** Cartesian coordinates in pixels with a top-left origin. */
export interface XY {
  x: Int
  y: Int
}

export function XY(x: number, y: number): XY {
  return {x: Int(x), y: Int(y)}
}
