
var mocha = require('mocha'),
	should = require('should'),
	fs = require('fs'),
	_msbuild = require('../msbuild');
	
	
	/******  SETUP    ******/
	var msbuild = new _msbuild(function(){});
	msbuild.outputPath = 'c:/mydeploys';
	msbuild.configuration = 'myconfiguration';
	msbuild.publishProfile = 'mypublishprofile';
	msbuild.sourcePath = 'WebApplicationExamples/MvcExample/src/webexample1/webexample1.csproj';
	msbuild.verbose = false;
	
	/*  prevent actual publish or deploy during test; override final exe function; return the final cmd */
	msbuild.exec  = function(cmd){ return cmd; }
	/******  END SETUP    ******/
	
	
describe('msbuild',function(){

		describe('build params',function(){
				//TODO: write some tests...looking help:)
		})

})
