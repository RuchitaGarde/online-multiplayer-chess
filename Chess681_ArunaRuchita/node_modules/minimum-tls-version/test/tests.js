// Tests. Mocha TDD/assert style. See
// http://visionmedia.github.com/mocha/
// http://nodejs.org/docs/latest/api/assert.html

//var findParentDir = require('find-parent-dir');
//var configDir = findParentDir.sync(__dirname, 'index.js');
//var config = require(configDir+'config.js')
var assert = require('assert');
var constants = require('constants');
var mimumumTLSVersion = require('../index.js');
var log = console.log.bind(console);
//require('es6-shim')

suite('TLS version values', function(){

	test('Minimum sslv3', function(done){
		assert.equal(mimumumTLSVersion('sslv3'), constants.SSL_OP_NO_SSLv2)
		done()
	})

	test('Minimum tlsv11', function(done){
		assert.equal(mimumumTLSVersion('tlsv11'), constants.SSL_OP_NO_TLSv1|constants.SSL_OP_NO_SSLv3|constants.SSL_OP_NO_SSLv2)
		done()
	})

	test('Minimum tlsv12', function(done){
		assert.equal(mimumumTLSVersion('tlsv11'), constants.SSL_OP_NO_TLSv11|constants.SSL_OP_NO_TLSv1|constants.SSL_OP_NO_SSLv3|constants.SSL_OP_NO_SSLv2)
		done()
	})
})

suite('Handles user errors', function(){
	test('non-existent TLS versions', function(done){
		assert.throws(
			function() {
			  mimumumTLSVersion('sslv4');
			},
			Error
		)
		done();
	}),

	test('Don\'t actually limit anything', function(done){
		assert.equal(mimumumTLSVersion('sslv2'), 0)
		done();
	})
})


