/**
 * Drawing Bot SVG Filter
 *
 * Generates random SVG artwork with configurable filters.
 */

const { randomShape } = require("./shapes");
const { buildFilter, getFilterNames } = require("./filters");

const DEFAULTS = {
  width: 800,
  height: 600,
  shapeCount: 30,
  filter: null,
  background: "#1a1a2e",
};

/**
 * Generate a complete SVG drawing with an optional filter applied.
 *
 * @param {object} options
 * @param {number} options.width       - Canvas width (default 800)
 * @param {number} options.height      - Canvas height (default 600)
 * @param {number} options.shapeCount  - Number of random shapes (default 30)
 * @param {string} options.filter      - Filter name to apply (blur, grayscale, noise, shadow, glow, sketch)
 * @param {object} options.filterOpts  - Options passed to the filter builder
 * @param {string} options.background  - Background fill color
 * @returns {string} Complete SVG markup
 */
function generateSVG(options = {}) {
  const { width, height, shapeCount, filter, filterOpts, background } = {
    ...DEFAULTS,
    ...options,
  };

  const parts = [];

  // SVG header
  parts.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">`
  );

  // Filter defs (if requested)
  if (filter) {
    parts.push("  <defs>");
    parts.push(`    ${buildFilter(filter, filterOpts)}`);
    parts.push("  </defs>");
  }

  // Background
  parts.push(
    `  <rect width="${width}" height="${height}" fill="${background}" />`
  );

  // Shape group (with filter applied)
  const filterAttr = filter ? ` filter="url(#${filter})"` : "";
  parts.push(`  <g${filterAttr}>`);

  for (let i = 0; i < shapeCount; i++) {
    parts.push(`    ${randomShape(width, height)}`);
  }

  parts.push("  </g>");
  parts.push("</svg>");

  return parts.join("\n");
}

module.exports = { generateSVG, getFilterNames };
