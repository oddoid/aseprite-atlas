# aseprite-atlas

(Experimental) Aseprite sprite atlas parser and animator for browser and
Node.js.

## Installation

`npm i aseprite-atlas`. See the [changelog](changelog.md) for version notes.

## Usage

### CLI

Given a directory of Aseprite files, group them into a sprite sheet and dump the
parsed output:

```sh
asepriteExportAtlas --sheet=atlas.png *.aseprite | asepriteParseAtlas > atlas.json
```

### JavaScript

todo: add documentation.

## Features

aseprite-atlas adds little:

- A utility for playing Aseprite animations (forward, reverse, or ping-pong).
- Support (by convention) for infinite durations. When a cel's duration is set
  to 65 535 (hexadecimal ffff) in the Aseprite GUI, it will be parsed in
  JavaScript as `Number.POSITIVE_INFINITY`.
- A slightly improved data structure that includes associating Aseprite slices
  with their cels. This can be useful for collision detection, for example.

You might not need it.

## Functionality Not Provided

aseprite-atlas performs light parsing to restructure the standard Aseprite
format into a more useful one for animation and slice association. Consumers
will likely need to provide additional code for creating and managing instances,
collision detection, etc. It is hoped that by focusing on a small set of
responsibilities with a simple API, it will be easy to use (or not use) this
library.

## Assumptions and Conventions

### Assumptions

The Aseprite CLI is flexible and can produce a number of different formats.
aseprite-atlas an input generated by the options used in
[asepriteExportAtlas](bin/asepriteExportAtlas).

### Conventions

Some wanted functionality is not modeled in the stock Aseprite format. This
section lists conventions used by aseprite-atlas. It's possible to forget to
apply these conventions, which can lead to bugs that aseprite-atlas cannot
detect. To the extent possible, consumers should add tests for conventions to
their code.

- A duration of 65 535 (hexadecimal ffff) is considered a special value by
  aseprite-atlas and parsed as `Number.POSITIVE_INFINITY`.
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
