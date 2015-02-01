var fs = require('fs'),
    path = require('path');

module.exports = {
  dump: function (pathName) {
    var baseDir = path.resolve(pathName);

    var files = fs.readdirSync(baseDir);

    return files.map(function (template) {
      var contents = fs.readFileSync(path.resolve(pathName, template)).toString(),
          modules = contents.match(/\/\*.*(MODULE)\s+(.*)\*\//),
          items = contents.match(/^\/\*.*(GET)\s+(.*) (\/.*) \*\/$/gm);

      if(!items) return null;

      return {
        module: modules[2],
        items: items.map(function (item) {
          parts = item.match(/^\/\*.*(GET)\s+(.*) (\/.*) \*\/$/);
          return {
            title: parts[2],
            link: parts[3]
          }
        })
      };
    }).filter(function (module) { return module != null; });
  }
}