var pkg = require('./package.json'),
    commander = require('commander'),
    njx = require('./index');

var template;

commander
    .version(pkg.version)
    .usage('[options] [template]')
    .option('-c, --config <source>', 'file/url for options in yaml/json format (command line options take precedence)')
    .option('-d, --data <source>', 'json string, or else path/url to json')
    .option('-t, --template <source>', 'template string, or else path/url to template')
    .option('-o, --out <pathname>', 'write output to file')
    .option('-p, --paths', 'create intermediate directories when writing file')
  //.option('-n, --nocache', 'do not use template cache')
;


commander.on('error', function () {
  process.exit(1);
});


commander.parse(process.argv);

if (commander.args && commander.args[0]) {
  commander.template = commander.args[0];
}

render(commander);

// ==========================

function render(options) {
  function render(data) {
    njx.render({
      data: data,
      config: options.config,
      template: options.template,
      outfile: options.out,
      paths: options.paths,
      cache: !options.nocache
    }, function (err, result) {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      if (result) process.stdout.write(result);
    });
  }

  if (options.config || options.data) {
    render(options.data);
  } else {
    readstdin(render);
  }
};


function readstdin(done) {
  var input = '';

  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', function () {
    var chunk = process.stdin.read();
    if (chunk !== null) {
      input += chunk;
    }
  });

  process.stdin.on('end', function () {
    done(input);
  });
}

