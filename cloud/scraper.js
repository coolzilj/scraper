var xray = require('x-ray');
var async = require('async');

function run (callback) {
  xray('http://github.com/stars/coolzilj')
    .select([{
      $root: '.repo-list-item',
      title: '.repo-list-name',
      link: '.repo-list-name a[href]',
      description: '.repo-list-description',
      meta: {
        $root: '.repo-list-meta',
        starredOn: 'time'
      }
    }])
    .paginate('.pagination a:last-child[href]')
    // .limit(3)
    .run(function(err, repos) {
      if (err) {
        console.error("===== Error when scraping =====");
      } else {
        if (repos.length > 0) {
          async.each(repos, saveRepo, function(err){
            if(!err) {
              callback(null);
            } else {
              callback(err);
              console.error("===== Error when saving repo =====");
            }
          })
        }
      }
    });
}

function saveRepo (data, callback) {
  var Repo = AV.Object.extend("repo");
  var query = new AV.Query(Repo);

  query.equalTo("link", data["link"]);
  query.first().then(function(result) {
    if (!result) {
      var repo = new Repo();
      repo.save({
        title: data["title"],
        link: data["link"],
        description: data["description"],
        meta: {
          starredOn: data["meta"]["starredOn"]
        }
      }).then(function(repo) {
        console.log(repo.get("link") + " saved.");
        callback(null);
      }, function(repo, err) {
        console.error(err.message);
        callback(err);
      });
    } else {
      console.log(result.get("link") + " existed");
      callback(null);
    };
  }, function(err) {
    console.error("Something wrong when query");
    callback(err);
  });
}

module.exports = {
  run : run
}
