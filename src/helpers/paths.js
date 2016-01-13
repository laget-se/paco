
const path = require('path');
const fileExists = require('file-exists');
const uppity = require('uppity');

/**
 * Returns an interpolated string where path variables has been
 * replaced with actual paths.
 */
function getInterpolatedPaths(pathStr) {
  if (!pathStr)
    return pathStr;

  return pathStr
    .replace(/%root_paco_path%/g, process.env.PACO_ROOT_PATH)
    .replace(/%package_path%/g, process.env.PACO_PACKAGE_PATH);
}

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
 * Traverses the directory tree from a starting point and returns
 * an array of all files with a given filename.
 */
function getTraversedFilesNamed(filename, options = {}) {
  options.startAt = options.startAt || process.cwd();
  options.stopAt  = options.stopAt  || path.parse(options.startAt).root;

  const lowestDepth = options.stopAt.split(path.sep).length;

  return uppity(filename).filter(file => {
    return path.dirname(file).split(path.sep).length >= lowestDepth;
  });
}

/**
 * Returns the full path to the nearest file with a given name,
 * where searching starts from `startPath`.
 */
function getNearestPathToFileWithName(filename, startPath) {
  const allMatches = getTraversedFilesNamed(filename, { startAt: startPath });

  return allMatches && allMatches.length > 0
    ? allMatches[0]
    : new Error(`No ${filename} available in directory tree`);
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
  const allMatches = getTraversedFilesNamed(filename, { startAt: startPath });

  return allMatches && allMatches.length > 0
    ? allMatches[allMatches.length - 1]
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
  getInterpolatedPaths,
  pathRelativeToRoot,
  pathRelativeToPackage,
  getTraversedFilesNamed,
  getNearestPathToFileWithName,
  getNearestDirContainingFileNamed,
  getHighestPathToFileNamed,
  getHighestDirContainingFileNamed,
};
