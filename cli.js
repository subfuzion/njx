var pkg = require('./package.json'),
    CLI = require('climactic').CLI;

var spec = {
  version: pkg.version,
  banner: 'njx',
  caption: 'Nunjucks Utility'
};

var cli = new CLI(spec);

cli.on('error', function() {
  process.exit(1);
});

cli.start(process.argv);

