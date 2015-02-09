var pkg = require('./package.json'),
    commander = require('commander'),
    njx = require('./index');

var template;

commander
    .version(pkg.version)
    .usage('[options] <template>')
    .option('-d, --data <source>', 'json string, or else path/url to json')
    .option('-t, --template <template>', 'template string, or else path/url to template')
    .option('-o, --out <pathname>', 'write output to file')
    .option('-p, --paths', 'create intermediate directories when writing file')
  //.option('-n, --nocache', 'do not use template cache')
;


commander.on('error', function () {
  process.exit(1);
});


commander.parse(process.argv);

template = commander.args && commander.args[0] || commander.template;
if (!template) {
  console.log('  error: missing template');
  commander.help();
}

render(template, commander);

function render(template, options) {
  function render(data) {
    njx.render({
      data: data,
      template: template || options.template,
      outfile: options.out,
      paths: options.paths,
      cache: !options.nocache
    }, function (err, result) {
      if (err) {
        console.log(err);
        process.exit(1);
      }

      if (result) process.stdout.write(result);

      // force exit due to nunjucks bug:
      // https://github.com/mozilla/nunjucks/issues/369
      process.exit();
    });
  }

  if (options.data) {
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

