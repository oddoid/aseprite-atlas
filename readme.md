# [aseprite-atlas](https://git.io/aseprite-atlas)

Aseprite sprite atlas (or sprite sheet) parser and animator for browser and
Node.js. [See the live demo!](https://aseprite-atlas.netlify.com/demo/)

## Installation

`npm i aseprite-atlas`. See the [changelog](changelog.md) for version notes.

## Usage

See the [demo source](demo/index.js) and [demo tests](demo/AtlasID.test.ts)!

### CLI

Given a list of Aseprite files, pack all images and animations into a single
sprite sheet:

```sh
npx aseprite-atlas-pack --sheet atlas.png --data atlas.json *.aseprite
```

The contents of atlas.json are an [`Aseprite.File`](src/types/Aseprite.ts) and
ready for parsing.

### JavaScript

Parse the packed sprite sheet and play the frog's idle animation:

```js
import {Animator, Parser} from 'aseprite-atlas'
import * as asepriteJSON from './atlas.json'
// Or:
//   const {Animator, Parser} = require('aseprite-atlas')
//   const asepriteJSON = require('./atlas.json')

// Parse the Aseprite.File into an Atlas.
const atlas = Parser.parse(asepriteJSON)

// Create a mutable Animator state. Animators keep a record of the cel index
// oscillation period (which is used to derive the active index for the cels
// array) and its exposure timer (which is used to determine when the period
// should be advanced). Animators are just plain data.
let animator = {period: 0, exposure: 0}

// Retrieve the Alas.Animation tagged "frog-idle". Animations are stateless.
const animation = atlas.animations['frog-idle']

// Animate by 1/60th of a second (~16.667 milliseconds). Depending on the cel
// duration specified in Aseprite, this may or may not advance the active cel.
// For a multi-cel forward animation where the first cel has a 10 millisecond
// duration, animator's state would be {period: 1, exposure: 6.667}.
animator = Animator.animate(
  animator.period,
  animator.exposure + 16.667,
  animation
)

// Print the location of the active cel within the sprite sheet PNG.
const index = Animator.index(animator.period, animation.cels)
const {x, y} = animation.cels[index].position
const {w, h} = animation.size
console.log(x, y, w, h)
```

## Features

aseprite-atlas adds little:

- A utility for playing Aseprite animations (forward, reverse, or ping-pong).
  Mutable and immutable states are kept distinct.
- A sparser data structure that includes linking animation cels together in the
  same array and associating Aseprite slices with their cels. This can be useful
  for collision detection, for example.
- Support (by convention) for infinite durations. When a cel duration is set to
  65 535 (hexadecimal ffff) in the Aseprite GUI, it will be parsed in JavaScript
  as `Number.POSITIVE_INFINITY`.
- TypeScript typings for the Aseprite file format.
- Tests for parsing and playback.
- Open source.
- Easy to replace. If aseprite-atlas doesn't meet your needs, it should be easy
  to migrate to a solution that does.

You might not need it.

## Functionality Not Provided

aseprite-atlas performs light parsing to restructure the standard Aseprite
format into a more useful one for animation and slice association. Consumers
will likely need to provide additional code for creating and managing sprites,
collision detection, etc. It is hoped that by focusing on a small set of
responsibilities with a simple API, it will be easy to use (or not use) this
library.

Cel durations are allowed to be infinite. This means they are incompatible with
JSON (JSON5 supports infinite values).

## Assumptions and Conventions

### Assumptions

The Aseprite CLI is flexible and can produce a number of different formats.
aseprite-atlas an input generated by the options used in
[aseprite-atlas-pack](bin/aseprite-atlas-pack). Only the current
version of Aseprite, v1.2.15-x64, is tested.

### Conventions

Some wanted functionality is not modeled in the stock Aseprite format. This
section lists conventions used by aseprite-atlas. It's possible to forget to
apply these conventions, which can lead to bugs that aseprite-atlas cannot
detect. To the extent possible, consumers should add tests for conventions to
their code.

- A duration of 65 535 (hexadecimal ffff) is considered a special value by
  aseprite-atlas and parsed as `Number.POSITIVE_INFINITY`. This value is only
  permitted in the last cel of a tagged animation but can appear in multiple
  tagged animations within the same Aseprite file.
- Slices are associated to cels by tag name. This is error-prone for artists so
  consumers may wish to add tests to assure that all slices are associated to a
  cel tag.

## Development

### Publishing a New Version

1. Update the [changelog](changelog.md).
1. Execute `npm version <patch|minor|major>`.

## License

© Stephen Niedzielski.

### GPL-3.0-only

This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, version 3.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program. If not, see <https://www.gnu.org/licenses/>.
