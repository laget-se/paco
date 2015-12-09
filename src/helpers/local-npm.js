#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const configHelpers = require('./local-configs');

module.exports.hasTask = function(task) {
  const packageJson = configHelpers.getLocalJSON('package.json');

  if (!packageJson.scripts)
    return false;

  return Object.keys(packageJson.scripts).indexOf(task) >= 0;
};
