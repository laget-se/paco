'use strict';

const exec = require('child_process').exec;
const Q = require('q');

module.exports.isCleanState = (opts = {}) => {
  const ignorePatterns = opts.ignorePatterns || [/^$/];

  return Q.promise((resolve, reject) => {
    exec('git status -s .', (err, stdout, stderr) => {
      if (err)
        return reject(err);

      const changedFiles = stdout.split('\n');
      const uncommitedFiles = changedFiles
        .filter(file => {
          return ignorePatterns
            .map(pattern => pattern.test(file))
            .filter(shouldIgnore => shouldIgnore === false)
            .length;
        })
        .filter(file => file.trim());

      resolve(uncommitedFiles.length === 0);
    });
  });
};
