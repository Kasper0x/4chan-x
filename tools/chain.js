var fs = require('fs');
var template = require('./template');
var coffee = require('coffee-script');
var globalize = require('./globalize');

for (var name of process.argv.slice(2)) {
  try {
    var parts = name.match(/^tmp\/([^_]*)(?:_(.*))?-(.*)\.js$/);
    var basename = fs.readdirSync(`src/${parts[1]}`).filter(x => (x === `${parts[3]}.coffee` || x === `${parts[3]}.js`))[0];
    var script = fs.readFileSync(`src/${parts[1]}/${basename}`, 'utf8');
    script = script.replace(/\r\n/g, '\n');
    script = template(script, {type: parts[2]});
    if (/\.coffee$/.test(basename)) {
      script = coffee.compile(script);
      if (/^([$A-Z][$\w]*)\.coffee$/.test(basename)) {
        script = globalize.globalize(script, [parts[3]]);
      }
    }
    fs.writeFileSync(name, script);
  } catch (err) {
    console.error(`Error processing ${name}`);
    throw err;
  }
}

