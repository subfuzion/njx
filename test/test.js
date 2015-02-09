var assert = require('assert'),
    fsx = require('fs-extra'),
    njx = require('..'),
    path = require('path');

var sampleDir = path.join(__dirname, 'sample'),
    outputDir = path.join(__dirname, 'output');

before(function() {
  fsx.removeSync(outputDir);
  fsx.mkdirpSync(outputDir);
});

after(function() {
  fsx.removeSync(outputDir);
});

describe ('string source tests', function() {

  it ('should render using strings', function(done) {
    var expected = 'Hello World!';

    var config = {
      template: 'Hello {{ name }}!',
      data: { name: 'World' }
    };

    assertRender(config, expected, done);
  });

});



describe ('file source tests', function() {

  it ('should render using file sources', function(done) {
    var expected = 'Hello World',
        templatePath = path.join(sampleDir, 'hello.nunjucks'),
        dataPath = path.join(sampleDir, 'world.json');

    var config = {
      template: templatePath,
      data: dataPath
    };

    assertRender(config, expected, done);
  });

});


describe ('file output tests', function() {

  it ('should write results to file and create intermediate dirs', function(done) {
    var expected = 'Hello World',
        templatePath = path.join(sampleDir, 'hello.nunjucks'),
        dataPath = path.join(sampleDir, 'world.json'),
        output = path.join(outputDir, 'hello.text');

    var config = {
      template: templatePath,
      data: dataPath,
      outfile: output
    };

    assertRender(config, expected, done);
  });

});

describe ('url source tests', function() {

  it ('should render using url sources', function(done) {
    var expected = 'Hello World',
        templateUrl = 'https://gist.githubusercontent.com/tonypujals/006e0d2550881956c1c9/raw/d7732488b5a9bb63830f258c9571d3f849ba494b/hello.nunjucks',
        dataUrl = 'https://gist.githubusercontent.com/tonypujals/c77cd766397844f1fb28/raw/7f9c526ae145e6fb47fea08e957dcb775f92bf46/data.json';

    var config = {
      template: templateUrl,
      data: dataUrl
    };

    assertRender(config, expected, done);
  });

});

function assertRender(config, expected, done) {
  njx.render(config, function(err, result) {
    if (err) return done(err);

    function compare(result, expected) {
      assert.equal(result, expected);
      done();
    }

    if (config.outfile) {
      assert(!result);
      compare(readFileSync(config.outfile), expected);
    } else {
      compare(result, expected);
    }
  });
}

function readFileSync(file) {
  return fsx.readFileSync(file, { encoding: 'utf8' });
}

