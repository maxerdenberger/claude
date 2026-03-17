const { getFilterNames } = require("../src/index");

module.exports = function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  res.json({ filters: getFilterNames() });
};
