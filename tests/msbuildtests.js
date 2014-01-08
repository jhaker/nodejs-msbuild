
/*
	
	NEED SOME TESTs

*/
var mocha = require('mocha'),
	should = require('should'),
	fs = require('fs'),
	msbuild = require('../msbuild');




var MSBuildConfigs = [
{name:'windows-x32-2.0' ,os:'windows',processor:'x32',framework:'2.0',expected:'c:\\windows\\microsoft.net\\framework\\v2.0.50727\\msbuild.exe'},
{name:'windows-x32-3.5' ,os:'windows',processor:'x32',framework:'3.5',expected:'c:\\windows\\microsoft.net\\framework\\v3.5\\msbuild.exe'},
{name:'windows-x32-4.0' ,os:'windows',processor:'x32',framework:'4.0',expected:'c:\\windows\\microsoft.net\\framework\\v4.0.30319\\msbuild.exe'},
{name:'windows-x32-4.5' ,os:'windows',processor:'x32',framework:'4.5',expected:'c:\\windows\\microsoft.net\\framework\\v4.0.30319\\msbuild.exe'},
{name:'windows-x64-2.0' ,os:'windows',processor:'x64',framework:'2.0',expected:'c:\\windows\\microsoft.net\\framework64\\v2.0.50727\\msbuild.exe'},
{name:'windows-x64-3.5' ,os:'windows',processor:'x64',framework:'3.5',expected:'c:\\windows\\microsoft.net\\framework64\\v3.5\\msbuild.exe'},
{name:'windows-x64-4.0' ,os:'windows',processor:'x64',framework:'4.0',expected:'c:\\windows\\microsoft.net\\framework64\\v4.0.30319\\msbuild.exe'},
{name:'windows-x64-4.5' ,os:'windows',processor:'x64',framework:'4.5',expected:'c:\\windows\\microsoft.net\\framework64\\v4.0.30319\\msbuild.exe'},
]



describe('msbuild',function(){
	

		describe('MSBuildPath',function(){
				for(var config in MSBuildConfigs){
					var name = MSBuildConfigs[config].name;
					var expected = MSBuildConfigs[config].expected;
					var result = msbuild.MSBuildPath(
												MSBuildConfigs[config].os,
												MSBuildConfigs[config].processor,
												MSBuildConfigs[config].framework);

					it(name + ' should match path',function(){
						result.should.equal(expected.toLowerCase());
					})
				}
		})
		
		
		describe('LocalMSBuildPath',function(){
			console.log('*********************************************'.cyan);
			console.log('Checking for local framework versions'.cyan);
			console.log('*********************************************'.cyan);
				for(var config in MSBuildConfigs){
					var name = MSBuildConfigs[config].name;
					var result = msbuild.MSBuildPath(
												MSBuildConfigs[config].os,
												MSBuildConfigs[config].processor,
												MSBuildConfigs[config].framework);
					var dir = (result.replace('msbuild.exe',''));
					fs.exists(dir, function( exists ) {        
						console.log( ( exists  ? " Folder Exists: ".green : " Folder Missing: ".red.cyanBG ) + dir.grey );         
					});
				}
			
		})

})
