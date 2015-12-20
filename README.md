[![view on npm](http://img.shields.io/npm/v/paco.svg)](https://www.npmjs.org/package/paco)

# paco

**paco** is a node package development/distribution utility kit.

I grew tired of defining the same or similar build scripts here and there, especially when developing package libraries with lots of npm modules in the same repo. This is an effort to abstract package-related npm/gulp/grunt/whatever scripting for both regular packages and package libraries.

For now, paco is mainly designed to be used globally installed, although it should work for local installs.

**Table of contents**

* [Installation](#installation)
* [Features](#features)
* [Configration with .pacorc](#pacorc)
* [Usage](#usage)
* [Development](#development)
* [Todos](#todos)

<a name="installation"></a>
### Installation

`npm install paco`

<a name="features"></a>
### Features

The core stuff:

* Provides cli commands for common package management tasks such as **linting**, **testing**, **building**, **version bumping** and **publishing**.
* **Highly configurable.** Enable the features you want with the libraries you want.
* **Defaults to npm tasks** when no explicit commands have been provided (`paco build` -> `npm run build` when available)

Current limitations:

* Only supports babel transpiling internally

Wishlist:

* [ ] Support for running `paco` in subdirectories
* [ ] Support for merging configs from current working directory with parent configs
* [ ] Support for defining root configs wherever you want, i.e. manually stop searching parent directories for .pacorc
* [ ] Proper release notes support, covering git releases, markdown changelog etc.

<a name="pacorc"></a>
### Configuration with .pacorc

.pacorc is the config file in which to specify paco's behavior. The defaults are:

```js
{
  "build": {
    // The transpiler to use when building
    "transpiler": "babel",
    // The relative path to the source directory
    "src": "src",
    // The relative path to the distribution directory
    "dist": "dist"
  },
  "bump": {
    // Whether to create a git tag when bumping the package version
    "tag": false,
    // Whether to create a commit when bumping the package version
    "commit": false,
    // Commit message template for bump commits
    "message": false
  },
  "release": {
    // Whether to automatically push changes to the upstream repo
    "push": false,
    // Whether to push git tags to the upstream repo
    "pushTags": false
  }
}
```

<a name="usage"></a>
### Usage

```bash
# Lists available commands
paco -h

# Show help for a given command
paco <command> -h

paco test
# -> `npm run test`

paco lint
# -> `npm run lint`

paco build
# -> `npm run build` or `babel {src} --out-dir {dest}`

paco release [bump]
# -> `paco test`
# -> `paco lint`
# -> `paco build`
# -> `paco bump`
# -> `git push` (optional)
# -> `git push --tags` (optional)
```

<a name="development"></a>
### Development

paco comes from and fills my personal needs, but if it's useful to you, please chip in!

<a name="todos"></a>
### Todos

* [ ] `paco init` -> Wizard for creating a *.pacorc*
* [ ] `paco verifiy` -> `paco lint && paco test`
* [ ] `paco prepare` -> `paco verify && paco build`
* [ ] Add support for a root/parent .pacorc
