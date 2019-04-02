#!/usr/bin/env node

// Command-line arguments
var argv = require('minimist')(process.argv.slice(2));

var util = require('util');
var sourceFile = argv['source-file'] || null;
var sourceDirectory = argv['source-dir'] || 'scss';
var outputDirectory = argv['source-dir'] || 'tests/output';
var outputFile = argv['outputfile'] || null;
var boilerplate = `
@import 'settings';
@import 'base';
@include vf-base;
`;

var fs = require('fs');
var sass = require('node-sass');
var components = [];
var index = 0;

if (sourceFile) {
  //TODO: add support for specifying a file
  console.log('Specifying individual files not yet supported.');
} else {
  // Load all sass file(s)
  fs.readdirSync(sourceDirectory).forEach(fileName => {
    if (fileName.startsWith('_patterns')) {
      components[index] = {};
      var fileContents = fs.readFileSync(sourceDirectory + '/' + fileName, 'utf8', function(err, data) {
        if (err) {
          return console.log(err);
        }
        return data;
      });

      components[index].fileName = fileName;
      components[index].sass = boilerplate + fileContents;
      var importString = '\n@include vf-p-' + fileName.slice(10, -5) + ';';
      components[index].sass += importString;
      try {
        components[index].css = sass
          .renderSync({
            data: components[index].sass,
            includePaths: ['scss/']
          })
          .css.toString();
        components[index].cssSize = getSizeInKb(components[index].css);
      } catch (error) {
        console.log('ERROR: Failed to build sass for: ' + fileName);
      }
    }
    index++;
  });
}

components.sort(function(a, b) {
  return b.cssSize - a.cssSize;
});

components.forEach(function(component) {
  console.log(padWithSpaces(component.fileName, 35) + ' ' + component.cssSize + 'kb');
});

function getSizeInKb(string) {
  var bytes = Buffer.byteLength(string, 'utf8');
  return Math.round(bytes / 1000) - 38; //base adds 38kb
}

function padWithSpaces(raw, length) {
  var output = raw;
  var pad = length - raw.length;

  if (pad > 0) {
    for (i = 0; i < pad; i++) {
      output = output + ' ';
    }
  }

  return output;
}
