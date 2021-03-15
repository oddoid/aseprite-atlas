import {Int} from './int.js'

/** Width and height in pixels. */
export interface WH {
  w: Int
  h: Int
}

export function WH(w: number, h: number): WH {
  return {w: Int(w), h: Int(h)}
}
