# njx

[![NPM](https://nodei.co/npm/njx.png?compact=true)](https://nodei.co/npm/njx/)

`njx` is a template helper for [Nunjucks], a rich and powerful templating language for JavaScript. Nunjucks is essentially a port of [Jinja2], a templating language for Python.

`njx` is ideal for when you just want a quick and easy way to render something using input sources and templates that are any combination of

 * strings
 * files
 * urls

You can require it as a module:

    npm install njx

or use it as a command line tool:

    npm install -g njx


## njx command line usage

    njx [options] template
    
Examples:

    # pipe input data to the njx command, specifying the template as a string, and append the result to a file
    $ '{ "name": "World" }' | njx "Hello {{ name }}" >> hello.txt
    
or

    # provide template, data, and output options to the njx command
    njx -t "Hello {{ name }}" -d '{ "name': "World" }' -o hello.txt

or

    # provide data and template options using URLs, and write to the specified output file
    njx -d https://gist.githubusercontent.com/subfuzion/c77cd766397844f1fb28/raw/7f9cb47fea08e957dcb775f92bf46/data.json -t https://gist.githubusercontent.com/subfuzion/006e0d2550881956c1c9/raw/d7732488b5a9bb63830f258c9571d3f849ba494b/hello.nunjucks -o hello.txt

or

    # provide a "render config" option as a url to the njx command, and append the result to a file;
    # the render config provides the data and the template (in this example, they are also URLs, which njx will follow)
    njx -c https://gist.githubusercontent.com/subfuzion/d0fa251f8b4ab71928e2/raw/fd33beb96524c94b395c63935c701e98f2e72b52/sample-config.yaml -o hello.txt
    

#### template
The value for template can be a nunjucks template string, a file path, or url. To specify a file path in the current directory, use the form `./template`.

#### options

##### -c --config

A file or url to a `yaml` or `json` file with supported options, such as `data` and `template`. See this [yaml gist](https://gist.githubusercontent.com/subfuzion/d0fa251f8b4ab71928e2/raw/fd33beb96524c94b395c63935c701e98f2e72b52/sample-config.yaml) or this [json gist](https://gist.githubusercontent.com/subfuzion/995b24788aa742a11a41/raw/ebfec847636705f7820d6e3647f51d86acd5f29e/sample-config.json) for examples of both.

##### -d --data

Pipe data to njx or specify data with the `-d` or `--data` option. The value for the data option can be a json string, file path, or url. To specify a file path in the current directory, use the form `./filename`.

##### -o --out file

Specify file to write output to. If directories in the file path don't exist, also use the `-p --paths` option.

##### -p --paths

Create intermediate directories if necessary when writing to a file.


## API

```
  var njx = require('njx');
  njx.render(config, callback);
```

### Render Config

An object with at least `template` and `data` properties.

 * template - [required] a template string, filepath, or url
 * data - [required] a json string, filepath, or url
 * outfile - [optional] a filename to write the rendered result to; otherwise writes to `stdout`

The `template` and `data` properties interpret strings as a nunjucks template or json string, respectively, unless the string looks like a file path or url.  To specify a file in the current working directory, use the form: `./filename`.


### Usage examples

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
  
  var templateUrl = 'https://gist.githubusercontent.com/subfuzion/006e0d2550881956c1c9/raw/d7732488b5a9bb63830f258c9571d3f849ba494b/hello.nunjucks';
  
  var dataUrl = 'https://gist.githubusercontent.com/subfuzion/c77cd766397844f1fb28/raw/7f9c526ae145e6fb47fea08e957dcb775f92bf46/data.json'

  var spec = {
    template: templateUrl,
    data: { name: dataUrl }
  };


  njx.render(spec, function(err, result) {
    console.log(result); // Hello World
  });
```


[Nunjucks]: https://mozilla.github.io/nunjucks/  "Nunjucks home page"
[Jinja2]:   http://jinja.pocoo.org/docs/dev/     "Jinja2 templating language for Python"
