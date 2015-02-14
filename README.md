njx
===

Nunjucks template helper when you just want a quick way to
render using template and data sources that are strings,
files, or urls.

[![NPM](https://nodei.co/npm/njx.png?compact=true)](https://nodei.co/npm/njx/)

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

    usage: njx [options] template
    
Examples:

    $ '{ "name": "World" }' | njx "Hello {{ name }}" >> hello.txt
    
or

    njx -t "Hello {{ name }}" -d '{ "name': "World" }' -o hello.txt

or

    njx -c https://gist.githubusercontent.com/tonypujals/d0fa251f8b4ab71928e2/raw/4a5cd80b1aa8ab9ddcfd8971f7755ba573ab3174/sample-config.yaml >> hello.txt
    

#### template
The value for template can be a nunjucks template string, a file path, or url. To specify a file path in the current directory, use the form `./template`.

#### options

##### -c --config

A file or url to a `yaml` or `json` file with supported options, such as `data` and `template`. See this [yaml gist](https://gist.githubusercontent.com/tonypujals/d0fa251f8b4ab71928e2/raw/4a5cd80b1aa8ab9ddcfd8971f7755ba573ab3174/sample-config.yaml) or this [json gist](https://gist.githubusercontent.com/tonypujals/995b24788aa742a11a41/raw/d4a55f316dddc118bebd6316fc069378b20768e4/sample-config.json) for examples.

##### -d --data


Pipe data to njx or specify data with the `-d` or `--data` option. The value for the data option can be a json string, file path, or url. To specify a file path in the current directory, use the form `./filename`.

##### -o --out file

Specify file to write output to. If directories in the file path don't exist, also set the `-p --paths` option.

##### -p --paths

Create intermediate directories if necessary when writing to a file.

