
const exec = require('child_process').exec;
const colors = require('colors');
const Q = require('q');

const connectivity = require('./connectivity');

function parseVersion(ver) {
  const [numbers, ...suffixes] = ver.split('-');
  const [major, minor, patch] = numbers.split('.').map(num => parseInt(num));

  return { major, minor, patch };
}

function getVersionDiff(v1, v2) {
  const ver1 = parseVersion(v1);
  const ver2 = parseVersion(v2);

  return {
    major: ver2.major - ver1.major,
    minor: ver2.minor - ver1.minor,
    patch: ver2.patch - ver1.patch,
  };
}

function getLatestVersion() {
  return Q.Promise((resolve, reject) => {
    exec(`npm view paco version`, { encoding: 'utf-8' }, (err, stdout) => {
      if (err)
        return reject(err);

      resolve(stdout.trim());
    });
  });
}

function isOldVersion(v1, v2) {
  const diff = getVersionDiff(v1, v2);

  return diff.major > 0 || diff.minor >= 2;
}

function logOutdatedInfo(version, latest) {
  const dot = '· '.red;

  console.log(`${dot}
${dot}${'Your version paco is becoming outdated:'.red}
${dot}
${dot}  Your version: ${version.yellow}
${dot}  Latest version: ${latest.yellow}
${dot}
${dot}Run ${`\`npm i -g paco\``.bold} to update.
${dot}\n`);
}

module.exports.checkOutdatedVersion = () => {
  return connectivity.hasInternetConnection().then(connected => {
    if (!connected)
      return false;

    const version = require('../../package.json').version;

    return Q.any([
      getLatestVersion(),
      Q.delay(1000),
    ]).then(latest => {
      if (!latest) {
        return false;
      }

      const isOutdated = isOldVersion(version, latest);

      if (isOutdated) {
        logOutdatedInfo(version, latest);
      }

      return true;
    });
  }).catch(err => console.error(err));
};
