#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const configHelpers = require('./local-configs');
const npmHelpers = require('./local-npm');

module.exports.hasTask = function(task) {
  const packageJson = configHelpers.getFileAsJson(process.env.PACO_PACKAGE_JSON_PATH);

  if (!packageJson.scripts)
    return false;

  return Object.keys(packageJson.scripts).indexOf(task) >= 0;
};
