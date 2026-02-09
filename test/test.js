const { generateSVG, getFilterNames } = require("../src/index");
const { buildFilter } = require("../src/filters");
const { randomShape } = require("../src/shapes");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  PASS: ${message}`);
  } else {
    failed++;
    console.error(`  FAIL: ${message}`);
  }
}

console.log("Drawing Bot SVG Filter - Tests\n");

// --- Filter tests ---
console.log("Filters:");
const filterNames = getFilterNames();
assert(filterNames.length > 0, "has available filters");
assert(filterNames.includes("blur"), "has blur filter");
assert(filterNames.includes("glow"), "has glow filter");
assert(filterNames.includes("sketch"), "has sketch filter");

for (const name of filterNames) {
  const xml = buildFilter(name);
  assert(xml.includes(`id="${name}"`), `${name} filter has correct id`);
  assert(xml.startsWith("<filter"), `${name} filter starts with <filter`);
}

let threw = false;
try {
  buildFilter("nonexistent");
} catch {
  threw = true;
}
assert(threw, "throws on unknown filter");

// --- Shape tests ---
console.log("\nShapes:");
for (let i = 0; i < 20; i++) {
  const shape = randomShape(800, 600);
  assert(shape.startsWith("<"), `shape ${i + 1} is valid SVG element`);
}

// --- SVG generation tests ---
console.log("\nSVG Generation:");
const svg = generateSVG();
assert(svg.includes("<svg"), "output contains <svg tag");
assert(svg.includes("</svg>"), "output contains closing </svg>");
assert(svg.includes('viewBox="0 0 800 600"'), "default viewBox is correct");

const filteredSvg = generateSVG({ filter: "blur", shapeCount: 10 });
assert(filteredSvg.includes("<defs>"), "filtered SVG has <defs>");
assert(filteredSvg.includes('filter="url(#blur)"'), "filter is applied to group");
assert(filteredSvg.includes("feGaussianBlur"), "blur filter element present");

const customSvg = generateSVG({ width: 400, height: 300, background: "#fff" });
assert(customSvg.includes('viewBox="0 0 400 300"'), "custom dimensions work");
assert(customSvg.includes('fill="#fff"'), "custom background works");

// --- Summary ---
console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
