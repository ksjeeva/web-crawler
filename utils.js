const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

async function crawlRecursive(url, depth, visitedUrls, results) {
  // Base condition to stop recursion
  if (depth < 0 || visitedUrls.has(url)) {
    return;
  }

  // Marking visited URLs
  visitedUrls.add(url);

  try {
    const response = await axios.get(url);
    const loadedHTML = cheerio.load(response.data);

    // Find and save images on the current page
    loadedHTML("img").each((index, element) => {
      const imageUrl = loadedHTML(element).attr("src");
      results.push({
        imageUrl,
        sourceUrl: url,
        depth: depth,
      });
    });

    // Crawl links on the current page
    if (depth > 0) {
      const links = [];
      loadedHTML("a").each((index, element) => {
        const link = loadedHTML(element).attr("href");
        links.push(link);
      });

      for (const link of links) {
        if (link.startsWith("http")) {
          await crawlRecursive(link, depth - 1, visitedUrls, results);
        } else if (link.startsWith("/")) {
          const absoluteLink = new URL(link, url).href;
          await crawlRecursive(absoluteLink, depth - 1, visitedUrls, results);
        }
      }
    }
  } catch (error) {
    console.error(`Error crawling ${url}: ${error.message}`);
  }
}

function saveResults(results) {
  const data = { results };
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync("results.json", jsonData);
}

module.exports = { crawlRecursive, saveResults };
