var constants = require('constants');
require('es6-shim');
var log = console.log.bind(console);

var TLS_VERSIONS = [
  {
    "name": "tlsv12",
    "option": constants.SSL_OP_NO_TLSv1_2
  },
  {
    "name": "tlsv11",
    "option": constants.SSL_OP_NO_TLSv1_1
  },
  {
    "name": "tlsv1",
    "option": constants.SSL_OP_NO_TLSv1
  },
  {
    "name": "sslv3",
    "option": constants.SSL_OP_NO_SSLv3
  },
  {
    "name": "sslv2",
    "option": constants.SSL_OP_NO_SSLv2
  }
]

module.exports = function(tlsVersionName){
	var index = TLS_VERSIONS.findIndex(function(tlsVersion){
		return ( tlsVersion.name === tlsVersionName )
	})
	if ( index === -1 ) {
		throw new Error('Invalid TLS version', tlsVersionName);
	}
	var relevant = TLS_VERSIONS.slice(index + 1) // +1 because we want to exclude older versions.
	var minimumTLSVersionValue = 0;
	// '|'' is a bitwise or
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#.7c_%28Bitwise_OR%29
	relevant.forEach(function (tlsVersion) {
		minimumTLSVersionValue = minimumTLSVersionValue | tlsVersion.option;
	});
	return minimumTLSVersionValue
}


