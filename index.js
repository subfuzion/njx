var _ = require('lodash'),
    async = require('async'),
    debug = require('debug')('njx'),
    fs = require('fs'),
    fsx = require('fs-extra'),
    nunjucks = require('nunjucks'),
    path = require('path'),
    request = require('request'),
    yaml = require('js-yaml');

exports.render = function(config, callback) {
  debug('render config: %j', config);

  async.waterfall([
      function(cb) {
        var conf = config.config;

        if (conf) {
          if (!/\/|\\/.test(conf)) {
            conf = './' + conf;
          }

          getResource(conf, function(err, doc) {
            if (err) return cb(err);
            try {
              var spec = yaml.safeLoad(doc);
              // config options override options loaded from config.config source
              spec = _.defaults(config, spec);
              return cb(null, spec);
            } catch (err) {
              return cb(err);
            }
          })
        } else {
          cb(null, _.clone(config));
        }
      },

      function(spec, cb) {
        getResource(spec.data, { parse: true }, function(err, data) {
          if (err) return cb(err);
          spec.data = data;
          cb(null, spec);
        });
      },

      function(spec, cb) {
        getResource(spec.template, function(err, template) {
          if (err) return cb(err);
          spec.template = template;
          cb(null, spec);
        });
      }

  ], function(err, spec) {
    if (err) return callback(err);

    debug('render spec: %j', spec);
    nunjucks.renderString(spec.template, spec.data, function(err, result) {
      if (err) return callback(err);
      debug(result);
      return spec.outfile ? writeFile(spec.outfile, result, callback) : callback(null, result);
    });
  });
};

function getResource(resource, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (!resource) resource = {};

  if (typeof resource === 'object') return callback(null, resource);

  if (options.cache) {
    readCache(resource, function(err, data) {
      if (err) return callback(err);
      if (data) return callback(null, data);
      return _getResource(resource, callback);
    });
  } else {
    return _getResource(resource, callback);
  }

  function _getResource(resource, callback) {
    // try to determine if url, path, a valid json string, or else a named cache item
    if (/^http[s]*:\/\//.test(resource)) {
      fetchFile(resource, options, callback);
    } else if (/\/|\\/.test(resource)) {
      readFile(resource, options, callback);
    } else if (options.parse && /^{[^{]/.test(resource)) {
      // test looks for opening { for JSON, but not {{ for nunjucks template string
      parseString(resource, callback);
    } else {
      // then return string as is
      callback(null, resource);
    }
  }
}

function fetchFile(url, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  request(url, function(err, res, body) {
    if (err) return callback(err);
    if (res.statusCode != 200) return callback(new Error('url didn\'t return OK (status code: ' + res.statusCode + '): ' + url));
    return options.parse ? parseString(body, options, callback) : callback(null, options.trim ? body.trim() : body);
  });
}

function readFile(pathname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  fs.readFile(pathname, { encoding: 'utf8'}, function(err, data) {
    if (err) return callback(err);
    return options.parse ? parseString(data, options, callback) : callback(null, options.trim ? data.trim() : data);
  });
}

function parseString(str, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  try {
    return callback(null, JSON.parse(options.trim ? str.trim() : str));
  } catch (err) {
    console.log('syntax error parsing string as json: ' + str);
    return callback(err);
  }
}

function readCache(name, callback) {
  // stub for now
  callback();
}

function writeFile(file, data, callback) {
  debug('writing to: ' + file);
  var dir = path.dirname(file);
  fsx.mkdirs(dir, function(err) {
    if (err) return callback(err);
    fs.writeFile(file, data, callback);
  });
}

