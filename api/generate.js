const { generateSVG, getFilterNames } = require("../src/index");

module.exports = function handler(req, res) {
  if (req.method === "GET" && req.url === "/api/filters") {
    return res.json({ filters: getFilterNames() });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    width = 800,
    height = 600,
    shapeCount = 30,
    filter = null,
    background = "#1a1a2e",
  } = req.body || {};

  const validFilters = getFilterNames();
  if (filter && !validFilters.includes(filter)) {
    return res.status(400).json({
      error: `Unknown filter "${filter}". Available: ${validFilters.join(", ")}`,
    });
  }

  const svg = generateSVG({ width, height, shapeCount, filter, background });

  res.setHeader("Content-Type", "image/svg+xml");
  res.send(svg);
};
