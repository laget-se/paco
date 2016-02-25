
const dns = require('dns');
const Q = require('q');

module.exports.hasInternetConnection = () => {
  return Q.promise((resolve, reject) => {
    dns.lookup('npmjs.com', (err, addresses, family) => {
      if (err && err.code == 'ENOTFOUND')
        resolve(false);
      else
        resolve(true);
    });
  });
};
