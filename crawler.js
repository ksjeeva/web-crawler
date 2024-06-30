const { crawlRecursive, saveResults } = require("./utils");

// Main fn: Recursively scan webpages & save the results
async function scanWebpage(startUrl, depth) {
  const visitedUrls = new Set();
  const results = [];

  await crawlRecursive(startUrl, depth, visitedUrls, results);
  saveResults(results);
}

// CLI Input
const input = process.argv.slice(2);
const startUrl = input[0];
const depth = input[1];

// Main function call
scanWebpage(startUrl, depth);
