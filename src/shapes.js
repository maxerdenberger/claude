/**
 * Random shape generators for the drawing bot.
 * Each function returns an SVG element string.
 */

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(rand(min, max));
}

function randomColor() {
  const hue = randInt(0, 360);
  const sat = randInt(50, 100);
  const lit = randInt(30, 70);
  return `hsl(${hue}, ${sat}%, ${lit}%)`;
}

function circle(width, height) {
  const cx = rand(0, width);
  const cy = rand(0, height);
  const r = rand(5, Math.min(width, height) / 6);
  const fill = randomColor();
  const opacity = rand(0.3, 0.9).toFixed(2);
  return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${fill}" opacity="${opacity}" />`;
}

function rect(width, height) {
  const x = rand(0, width * 0.8);
  const y = rand(0, height * 0.8);
  const w = rand(10, width / 4);
  const h = rand(10, height / 4);
  const fill = randomColor();
  const opacity = rand(0.3, 0.9).toFixed(2);
  const rx = rand(0, 10).toFixed(1);
  return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${rx}" fill="${fill}" opacity="${opacity}" />`;
}

function line(width, height) {
  const x1 = rand(0, width);
  const y1 = rand(0, height);
  const x2 = rand(0, width);
  const y2 = rand(0, height);
  const stroke = randomColor();
  const strokeWidth = rand(1, 5).toFixed(1);
  const opacity = rand(0.4, 1.0).toFixed(2);
  return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" stroke-linecap="round" />`;
}

function polygon(width, height) {
  const sides = randInt(3, 7);
  const cx = rand(width * 0.2, width * 0.8);
  const cy = rand(height * 0.2, height * 0.8);
  const r = rand(15, Math.min(width, height) / 5);
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (Math.PI * 2 * i) / sides - Math.PI / 2;
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    points.push(`${px.toFixed(1)},${py.toFixed(1)}`);
  }
  const fill = randomColor();
  const opacity = rand(0.3, 0.8).toFixed(2);
  return `<polygon points="${points.join(" ")}" fill="${fill}" opacity="${opacity}" />`;
}

function path(width, height) {
  const startX = rand(0, width);
  const startY = rand(0, height);
  const segments = randInt(2, 5);
  let d = `M ${startX.toFixed(1)} ${startY.toFixed(1)}`;
  for (let i = 0; i < segments; i++) {
    const cp1x = rand(0, width);
    const cp1y = rand(0, height);
    const cp2x = rand(0, width);
    const cp2y = rand(0, height);
    const endX = rand(0, width);
    const endY = rand(0, height);
    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;
  }
  const stroke = randomColor();
  const strokeWidth = rand(1, 4).toFixed(1);
  const opacity = rand(0.4, 1.0).toFixed(2);
  return `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" stroke-linecap="round" />`;
}

const shapeGenerators = { circle, rect, line, polygon, path };

function randomShape(width, height) {
  const names = Object.keys(shapeGenerators);
  const name = names[randInt(0, names.length)];
  return shapeGenerators[name](width, height);
}

module.exports = { randomShape, shapeGenerators, randomColor, rand, randInt };
