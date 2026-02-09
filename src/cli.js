#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { generateSVG, getFilterNames } = require("./index");

function printUsage() {
  console.log(`
Drawing Bot SVG Filter
======================

Usage: node src/cli.js [options]

Options:
  --width <n>        Canvas width (default: 800)
  --height <n>       Canvas height (default: 600)
  --shapes <n>       Number of shapes to draw (default: 30)
  --filter <name>    Apply an SVG filter
  --background <c>   Background color (default: #1a1a2e)
  --output <file>    Output file path (default: output/drawing.svg)
  --help             Show this help message

Available filters: ${getFilterNames().join(", ")}

Examples:
  node src/cli.js
  node src/cli.js --filter blur --shapes 50
  node src/cli.js --filter glow --output my-art.svg
  node src/cli.js --filter sketch --width 1024 --height 768
`);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    switch (argv[i]) {
      case "--help":
      case "-h":
        args.help = true;
        break;
      case "--width":
        args.width = parseInt(argv[++i], 10);
        break;
      case "--height":
        args.height = parseInt(argv[++i], 10);
        break;
      case "--shapes":
        args.shapeCount = parseInt(argv[++i], 10);
        break;
      case "--filter":
        args.filter = argv[++i];
        break;
      case "--background":
        args.background = argv[++i];
        break;
      case "--output":
        args.output = argv[++i];
        break;
      default:
        console.error(`Unknown option: ${argv[i]}`);
        process.exit(1);
    }
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv);

  if (args.help) {
    printUsage();
    process.exit(0);
  }

  const outputPath = args.output || path.join("output", "drawing.svg");
  delete args.output;
  delete args.help;

  const svg = generateSVG(args);

  // Ensure output directory exists
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(outputPath, svg, "utf-8");
  console.log(`SVG written to ${outputPath}`);
  console.log(`  Size: ${width(args)}x${height(args)}`);
  console.log(`  Shapes: ${args.shapeCount || 30}`);
  console.log(`  Filter: ${args.filter || "none"}`);
}

function width(args) {
  return args.width || 800;
}
function height(args) {
  return args.height || 600;
}

main();
