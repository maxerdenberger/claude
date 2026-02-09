/**
 * SVG filter definitions.
 * Each filter returns an SVG <filter> element string.
 */

const filters = {
  blur(amount = 4) {
    return `<filter id="blur">
      <feGaussianBlur in="SourceGraphic" stdDeviation="${amount}" />
    </filter>`;
  },

  grayscale() {
    return `<filter id="grayscale">
      <feColorMatrix type="saturate" values="0" />
    </filter>`;
  },

  noise(frequency = 0.05, octaves = 3) {
    return `<filter id="noise">
      <feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="${octaves}" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="20" />
    </filter>`;
  },

  shadow(dx = 3, dy = 3, blur = 4) {
    return `<filter id="shadow">
      <feDropShadow dx="${dx}" dy="${dy}" stdDeviation="${blur}" flood-color="rgba(0,0,0,0.4)" />
    </filter>`;
  },

  glow(amount = 4, color = "#ffcc00") {
    return `<filter id="glow">
      <feGaussianBlur in="SourceGraphic" stdDeviation="${amount}" result="blurred" />
      <feFlood flood-color="${color}" flood-opacity="0.6" result="color" />
      <feComposite in="color" in2="blurred" operator="in" result="coloredBlur" />
      <feMerge>
        <feMergeNode in="coloredBlur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>`;
  },

  sketch() {
    return `<filter id="sketch">
      <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="4" result="turbulence" />
      <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="6" />
    </filter>`;
  },
};

function getFilterNames() {
  return Object.keys(filters);
}

function buildFilter(name, options = {}) {
  const fn = filters[name];
  if (!fn) {
    throw new Error(`Unknown filter: "${name}". Available: ${getFilterNames().join(", ")}`);
  }
  return fn(...Object.values(options));
}

module.exports = { filters, getFilterNames, buildFilter };
