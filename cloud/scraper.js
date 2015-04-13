var xray = require('x-ray');

function run () {
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
    // .limit(10)
    .run(function(err, repos) {
      var Repo = AV.Object.extend("repo");

      if (err) {
        console.log("===== something wrong =====");
      } else {
        if (repos.length > 0) {
          for (var i = repos.length - 1; i >= 0; i--) {
            var obj = repos[i];
            var query = new AV.Query(Repo);
            query.equalTo("link", obj["link"]);
            (function(obj) {
              query.first({
                success: function(result) {
                  if(!result) {
                    var repo = new Repo();
                    repo.save({
                      title: obj["title"],
                      link: obj["link"],
                      description: obj["description"],
                      meta: {
                        starredOn: obj["meta"]["starredOn"]
                      }
                    }, {
                      success: function(repo) {
                        console.log(repo.get("link") + " saved.");
                      },
                      error: function(repo, err) {
                        console.log(err.message);
                      }
                    });
                  } else {
                    console.log(result.get("link") + " existed");
                  }
                },
                error: function(err) {
                  console.log("Something wrong when query: " + err.message);
                }
              });
            })(obj)
          };
        }
      }
    })
}

module.exports = {
  run : run
}
