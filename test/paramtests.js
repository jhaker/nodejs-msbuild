
var mocha = require('mocha'),
	should = require('should'),
	fs = require('fs'),
	_msbuild = require('../msbuild');
	
	
	/******  SETUP    ******/
	var msbuild = new _msbuild(function(){});
	msbuild.outputPath = 'c:/mydeploys';
	msbuild.configuration = 'myconfiguration';
	msbuild.publishProfile = 'mypublishprofile';
	msbuild.verbose = false;
	
	/*  prevent actual publish or deploy during test; override final exe function; return the final cmd */
	msbuild.exec  = function(cmd){ return cmd; }
	/******  END SETUP    ******/
	
	
describe('msbuild',function(){

		describe('build params',function(){
				msbuild.getBuildParams(false).should.equal(' /p:configuration=myconfiguration  /p:publishprofile=mypublishprofile ');
		})
		
		describe('package params',function(){
				msbuild.getPackageParams(false).should.equal(' /p:deployonbuild=false /t:package  /p:outputpath=c:/mydeploys ');
		})

		describe('publish params',function(){
				msbuild.getPublishParams(false).should.equal(' /p:deployonbuild=true');
		})
				
		describe('deploy params',function(){
				msbuild.getDeployOnBuildParam().should.equal(' /p:deployonbuild=false');
				msbuild.getDeployOnBuildParam(false).should.equal(' /p:deployonbuild=false');
				msbuild.getDeployOnBuildParam(true).should.equal(' /p:deployonbuild=true');
		})
		
		
		/*
		var localPath = process.cwd();
		describe('build cmd',function(){
			var expected = 'c:\\windows\\microsoft.net\\framework\\v4.0.30319\\msbuild.exe '+localPath+'  /p:deployonbuild=false /p:configuration=myconfiguration  /p:publishprofile=mypublishprofile ';
			msbuild.build().should.equal(expected);
		})
		
		describe('package cmd',function(){
			var expected = 'c:\\windows\\microsoft.net\\framework\\v4.0.30319\\msbuild.exe '+localPath+'  /p:configuration=myconfiguration  /p:publishprofile=mypublishprofile  /p:deployonbuild=false /t:package  /p:outputpath=c:/mydeploys ';
			msbuild.package().should.equal(expected);
		})
		
		describe('publish cmd',function(){
			var expected = 'c:\\windows\\microsoft.net\\framework\\v4.0.30319\\msbuild.exe '+localPath+'  /p:configuration=myconfiguration  /p:publishprofile=mypublishprofile  /p:deployonbuild=true';
			msbuild.publish().should.equal(expected);
		})
		*/

})
