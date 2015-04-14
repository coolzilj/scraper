require("cloud/app.js");
var scraper = require("cloud/scraper.js");

AV.Cloud.define("scrape", function(request, response) {
  console.log("====== scrape begin ======");
  scraper.run(function(err) {
    if(!err) {
      console.log("====== scrape end successfully ======");
      response.success();
    } else {
      console.log("====== scrape end unfortunately ======");
      response.error();
    }
  });
});
