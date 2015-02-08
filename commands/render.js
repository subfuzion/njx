var Command = require('climactic').Command,
    util = require('util'),
    njx = require('..');

module.exports = Render;
util.inherits(Render, Command);

function Render(context, config) {
  Command.call(this, context, config);
}

Render.prototype.spec = function () {
  return {
    name: 'render',
    command: 'render <template>',
    description: 'use template to render data from stdin (or use --data option)',
    options: [
      {
        name: 'data',
        option: '-d, --data <source>',
        description: 'json string, or path/url to json'
      },
      {
        name: 'template',
        option: '-t, --template <template>',
        description: 'template name, path, or url)'
      },
      {
        name: 'nocache',
        option: '-n, --nocache',
        description: 'do not use template cache'
      }
    ]
  };
};

Render.prototype.execute = function (template, options) {
  function render(data) {
    njx.render({
      data: data,
      template: template || options.template,
      cache: !options.nocache
    }, function(err, result) {
      if (err) return console.log(err);
      process.stdout.write(result);
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
