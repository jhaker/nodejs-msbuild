
var mocha = require('mocha'),
	colors = require('colors'),
	should = require('should'),
	fs = require('fs'),
	_msbuild = require('../msbuild');
	
	/******  SETUP    ******/
	var msbuild = new _msbuild(function(){});
		msbuild.exec  = function(cmd){
			//do nothing (prevent from publishing)
	}
	msbuild.publish(); 
	/******  END SETUP    ******/


	var randomLogIndex = 0;	
		
	var randomLog = function(msg){
		if(randomLogIndex === 0){
			randomLogIndex = 1;
			console.log(msg.red.cyanBG);
		}
		if(randomLogIndex === 1){
			randomLogIndex = 0;
			console.log(msg.redBG);
		}
	}

	var ahr = '*********************************************';
	var br = '\n';
	var cyan = 'cyan';
	var red = 'red';
	var grey = 'grey';
	function logTitle(msg,color){
		
		msg = ' '.concat(msg);
		msg = br.concat(br,ahr,br,' test - ',msg,br,ahr);
		log(msg,color);
	}

	function log(msg,color){
		if(color === 'red') {
			console.log(msg.red);
			return;
		}
		if(color === 'cyan') {
			console.log(msg.cyan);
			return;
		}
		if(color === 'grey') {
			console.log(msg.grey);
			return;
		}
		console.log(msg);
	}


	var MSBuildConfigs = [
	{name:'windows-x32-2.0' ,os:'windows',processor:'x32',framework:'2.0',expected:'c:\\Program Files (x86)\\MSBuild\\v2.0.50727\\bin\\msbuild.exe'},
	{name:'windows-x32-3.5' ,os:'windows',processor:'x32',framework:'3.5',expected:'c:\\Program Files (x86)\\MSBuild\\v3.5\\bin\\msbuild.exe'},
	{name:'windows-x32-4.0' ,os:'windows',processor:'x32',framework:'4.0',expected:'c:\\Program Files (x86)\\MSBuild\\14.0\\bin\\msbuild.exe'},
	{name:'windows-x32-4.5' ,os:'windows',processor:'x32',framework:'4.5',expected:'c:\\Program Files (x86)\\MSBuild\\14.0\\bin\\msbuild.exe'},
	{name:'windows-x64-2.0' ,os:'windows',processor:'x64',framework:'2.0',expected:'c:\\Program Files (x86)\\MSBuild\\14.0\\bin\\amd64\\msbuild.exe'},
	{name:'windows-x64-3.5' ,os:'windows',processor:'x64',framework:'3.5',expected:'c:\\Program Files (x86)\\MSBuild\\14.0\\bin\\amd64\\msbuild.exe'},
	{name:'windows-x64-4.0' ,os:'windows',processor:'x64',framework:'4.0',expected:'c:\\Program Files (x86)\\MSBuild\\14.0\\bin\\amd64\\msbuild.exe'},
	{name:'windows-x64-4.5' ,os:'windows',processor:'x64',framework:'4.5',expected:'c:\\Program Files (x86)\\MSBuild\\14.0\\bin\\amd64\\msbuild.exe'},
	]


	describe('msbuild',function(){
			 describe('MSBuildPath',function(){
					 for(var config in MSBuildConfigs){
						 var name = MSBuildConfigs[config].name;
						 var expected = MSBuildConfigs[config].expected;
						 var result = msbuild.getMSBuildPath(
													 MSBuildConfigs[config].os,
													 MSBuildConfigs[config].processor,
													 MSBuildConfigs[config].framework);
		
						 it(name + ' should match path',function(){
							 result.toLowerCase().should.equal(expected.toLowerCase());
						 })
					 }
			 })
			
		
			describe('LocalMSBuildPath',function(){			
					for(var config in MSBuildConfigs){
						var name = MSBuildConfigs[config].name;
						var result = msbuild.getMSBuildPath(
													MSBuildConfigs[config].os,
													MSBuildConfigs[config].processor,
													MSBuildConfigs[config].framework);
						var dir = (result.replace('msbuild.exe',''));
						fs.exists(dir, function( exists ) {        
							log( ( exists  ? " Folder Exists: ".green : " Folder Missing: ".red.cyanBG ) + dir.grey );         
						});
					}
			})


	})
