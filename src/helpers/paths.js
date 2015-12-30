
const path = require('path');
const fileExists = require('file-exists');

/**
 * Returns a pathname's relative path to the paco root
 */
function pathRelativeToRoot(pathname) {
  return path.resolve(process.env.PACO_ROOT_PATH, pathname);
}

/**
 * Returns a pathname's relative path to the current
 * nearest package.
 */
function pathRelativeToPackage(pathname) {
  return path.resolve(process.env.PACO_PACKAGE_PATH, pathname);
}

/**
 * Returns the full path to the nearest file with a given name,
 * where searching starts from `startPath`.
 */
function getNearestPathToFileWithName(filename, startPath) {
  let currPath = startPath;
  let hasFile = false;
  let reachedRoot = false;

  while (hasFile === false && reachedRoot === false) {
    hasFile = fileExists(path.join(currPath, filename));

    if (!hasFile)
      currPath = path.resolve(currPath, '..');

    reachedRoot = currPath === '/';
  }

  if (hasFile)
    return path.join(currPath, filename);
  else
    return new Error(`No ${filename} available in directory tree`);
}

/**
 * Returns a path to the nearest directory containing a file
 * with a given name, where searching start from `startPath`.
 */
function getNearestDirContainingFileNamed(filename, startPath) {
  try {
    const filePath = getNearestPathToFileWithName(filename, startPath);
    return path.dirname(filePath);
  }
  catch (ex) {
    return ex;
  }
}

/**
 * Returns a path to the last occurance of a file up the
 * directory tree.
 */
function getHighestPathToFileNamed(filename, startPath) {
  let currPath = startPath;
  let lastPath;
  let reachedRoot = false;

  while (reachedRoot === false) {
    if (fileExists(path.join(currPath, filename))) {
      lastPath = currPath;
    }

    currPath = path.resolve(currPath, '..');

    reachedRoot = currPath === '/';
  }

  return lastPath
    ? path.join(lastPath, filename)
    : new Error(`No ${filename} available in directory tree`);
}

/**
 * Returns a path to the last parent directory containing a file
 * with a given name.
 */
function getHighestDirContainingFileNamed(filename, startPath) {
  return path.dirname(getHighestPathToFileNamed(filename, startPath));
}

module.exports = {
  pathRelativeToRoot,
  pathRelativeToPackage,
  getNearestPathToFileWithName,
  getNearestDirContainingFileNamed,
  getHighestPathToFileNamed,
  getHighestDirContainingFileNamed,
};
