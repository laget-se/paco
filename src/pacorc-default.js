
module.exports = {
  "build": [
    "babel src --out-dir dist"
  ],
  "bump": {
    "tag": false,
    "commit": false,
    "message": false
  },
  "release": {
    "push": false,
    "pushTags": false
  }
};
