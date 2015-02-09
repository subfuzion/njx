njx
===

Nunjucks template helper when you just want a quick way to
render using template and data sources that are strings,
files, or urls.

You can require it as a module or use it as a command line tool.

    npm install --save njx

or

    npm install -g njx
    

Usage
-----

```
  var njx = require('njx');
  njx.render(config, callback);
```

Render Config
-------------
An object with at least `template` and `data` properties.

 * template - [required] a template string, filepath, or url
 * data - [required] a json string, filepath, or url
 * outfile - [optional] a filename to write the rendered result to; otherwise writes to `stdout`

The `template` and `data` properties interpret strings as a nunjucks template or json string, respectively, unless the string looks like a file path or url.  To specify a file in the current working directory, use the form: `./filename`.


Usage examples
--------------

#### Basic example

```
  var njx = require('njx');

  var spec = {
    template: 'Hello {{ name }}!',
    data: { name: 'World' }
  };


  njx.render(spec, function(err, result) {
    console.log(result); // Hello World
  });
```

#### Using file sources
```
  var njx = require('njx');

  var spec = {
    template: './template.nunjucks',
    data: { name: './data.json' }
  };


  njx.render(spec, function(err, result) {
    console.log(result); // Hello World
  });
```


#### Using url sources (ex: GitHub gists)

```
  var njx = require('njx'),
  
  var templateUrl = 'https://gist.githubusercontent.com/tonypujals/006e0d2550881956c1c9/raw/d7732488b5a9bb63830f258c9571d3f849ba494b/hello.nunjucks';
  
  var dataUrl = 'https://gist.githubusercontent.com/tonypujals/c77cd766397844f1fb28/raw/7f9c526ae145e6fb47fea08e957dcb775f92bf46/data.json'

  var spec = {
    template: templateUrl,
    data: { name: dataUrl }
  };


  njx.render(spec, function(err, result) {
    console.log(result); // Hello World
  });
```

## njx cli

    Usage: njx render [options] template
    

##### template
The value for template can be a nunjucks template string, a file path, or url. To specify a file path in the current directory, use the form `./template`.

##### options

###### data

You can pipe data to njx or specify data with the `-d` or `--data` option. The value for the data option can be a json string, file path, or url. To specify a file path in the current directory, use the form `./filename`.




