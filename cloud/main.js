require("cloud/app.js");
var scraper = require("cloud/scraper.js");

AV.Cloud.define("scrape", function(request, response) {
  console.log("====== scrape begin ======");
  scraper.run();
});
