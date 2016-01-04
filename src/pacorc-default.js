
module.exports = {
  "traverse": true,
  "lint": true,
  "test": true,
  "build": [
    "babel src --out-dir dist"
  ],
  "bump": {
    "tag": false,
    "commit": false,
    "message": "Updates to version %s"
  },
  "release": {
    "push": false,
    "pushTags": false
  }
};
