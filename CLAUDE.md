# CLAUDE.md

This file provides guidance for AI assistants working with the `drawing-bot-svg-filter` codebase.

## Project Overview

A zero-dependency Node.js command-line tool that generates random SVG artwork with configurable visual filters. It produces SVG files by compositing randomly generated geometric shapes with optional SVG filter effects.

## Repository Structure

```
drawing-bot-svg-filter/
├── src/
│   ├── index.js      # Main module: generateSVG(), getFilterNames()
│   ├── cli.js        # CLI argument parser and entry point
│   ├── filters.js    # SVG filter definitions (blur, grayscale, noise, shadow, glow, sketch)
│   └── shapes.js     # Random shape generators (circle, rect, line, polygon, path)
├── test/
│   └── test.js       # Custom assertion-based test suite
├── package.json
└── .gitignore        # Ignores node_modules/ and output/
```

## Technology Stack

- **Language**: JavaScript (Node.js)
- **Runtime**: Node.js (no minimum version pinned; developed on v22)
- **Dependencies**: None — zero external dependencies, pure Node.js built-ins only
- **Package manager**: npm

## Common Commands

```bash
# Run tests
npm test

# Generate SVG with defaults (800x600, 30 shapes, dark background)
npm start

# Generate with options
node src/cli.js --filter blur --shapes 50
node src/cli.js --filter glow --output my-art.svg
node src/cli.js --filter sketch --width 1024 --height 768

# Show CLI help
node src/cli.js --help
```

Output files are written to `output/` by default (gitignored). The directory is created automatically if it does not exist.

## Module Responsibilities

### `src/index.js`
- Exports `generateSVG(options)` — assembles and returns a complete SVG string
- Exports `getFilterNames()` — returns the list of available filter names
- Defaults: `width=800`, `height=600`, `shapeCount=30`, `background="#1a1a2e"`, `filter=null`
- SVG is built as an array of strings joined with `\n`
- Filter is applied as a `filter="url(#<name>)"` attribute on the shape `<g>` group

### `src/filters.js`
- Exports `filters` (object), `getFilterNames()`, `buildFilter(name, options)`
- Six built-in filters: `blur`, `grayscale`, `noise`, `shadow`, `glow`, `sketch`
- Each filter function returns a `<filter id="...">...</filter>` SVG string
- `buildFilter(name, options)` spreads `Object.values(options)` as positional args to the filter function — option order matters
- Throws `Error` on unknown filter name

### `src/shapes.js`
- Exports `randomShape(width, height)`, `shapeGenerators`, `randomColor`, `rand`, `randInt`
- Five shape types: `circle`, `rect`, `line`, `polygon`, `path`
- `randomShape` picks a type at random and calls it with the canvas dimensions
- Colors use HSL: hue 0–360°, saturation 50–100%, lightness 30–70%
- Numeric values are formatted with `.toFixed(1)` or `.toFixed(2)` for coordinates/opacity
- Uses `Math.random()` — output is non-deterministic (no seeded RNG)

### `src/cli.js`
- Parses `--width`, `--height`, `--shapes` (→ `shapeCount`), `--filter`, `--background`, `--output`, `--help`
- Exits with code 1 on unknown arguments
- Writes SVG to disk, then logs path and generation summary
- **Known bug**: Lines 89–90 call `width(args)` and `height(args)` which are helper functions defined later in the file (hoisting works at runtime but the functions return `args.width || 800` and `args.height || 600`)

## Testing

The test suite (`test/test.js`) is a custom framework with a simple `assert(condition, message)` function. No external testing library is used.

```bash
npm test
```

Tests cover:
- All 6 filters: presence, correct `id` attribute, correct opening tag
- Error on unknown filter name
- 20 random shape generations (validates each starts with `<`)
- SVG generation: default output, filtered output, custom dimensions/background

Exit code 0 = all passed; exit code 1 = one or more failures. Results are printed to stdout/stderr.

## Code Conventions

- **CommonJS modules**: `require()` / `module.exports` throughout
- **No semicolon style**: The codebase does not use semicolons (standard Node.js style)
- **String templates**: SVG markup is built with template literals
- **Numeric precision**: Coordinates use `.toFixed(1)`, opacity/stroke-width use `.toFixed(2)`
- **No linter or formatter** is configured; follow the existing style when editing
- **No CI/CD** is configured

## Known Issues

- `src/cli.js:89-90`: The console.log lines reference `width(args)` and `height(args)` (helper functions at the bottom of the file). This works due to function hoisting but is stylistically inconsistent. These helpers simply return `args.width || 800` and `args.height || 600`.
- No input validation on numeric CLI args (e.g., negative width/height values are passed through unchecked)
- `buildFilter` uses `Object.values(options)` positionally, so callers must supply options in the correct key order matching the filter function's parameter list

## Adding a New Filter

1. Add a new method to the `filters` object in `src/filters.js` with the filter's name as the key
2. The function should return a `<filter id="<name>">...</filter>` string (the `id` must match the key)
3. Write a test in `test/test.js` covering: `id` attribute present, starts with `<filter`, and any custom behavior
4. The filter will be automatically picked up by `getFilterNames()` and available via the CLI `--filter` option

## Adding a New Shape

1. Add a new function to `src/shapes.js` following the `(width, height) => string` signature
2. Add it to the `shapeGenerators` object — it will automatically be included in `randomShape()`
3. The returned string must be a valid SVG element starting with `<`
4. Add assertions in `test/test.js` if the shape has specific structural requirements
