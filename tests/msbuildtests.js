
/*
	
	NEED SOME TESTs

*/
var mocha = require('mocha');
var should = require('should');
var msbuild = require('../msbuild');





describe('msbuild',function(){
	describe('#indexOf()',function(){
		it('should return -1 when the value is not present',function(){
			assert.equal(-1,[1,2,3].indexOf(5));
			assert.equal(-1,[1,2,3].indexOf(0));
		})
	})
})