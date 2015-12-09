#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports.getLocalJSON = function(filename) {
  return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), filename)));
};

module.exports.getPackageJson = function() {
  return getLocalJSON('package.json');
};

module.exports.getPacorc = function() {
  return getLocalJSON('.pacorc');
};
