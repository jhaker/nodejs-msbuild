msbuild.js
=======

about
--------
basic msbuild operations for node.js



getting started
----------
view git project for more examples





example - publish
---
var msbuild = require('msbuild');

msbuild.config('configuration','myconfiguration');

msbuild.config('publishProfile','mypublishProfile');

msbuild.publish();




example - how to override exec to preview cmd arguments
---
var msbuild = require('msbuild');

msbuild.config('configuration','myconfiguration');

msbuild.config('publishProfile','mypublishProfile');

// override the exec function to output cmd 

msbuild.exec  = function(cmd){
	
	console.log('\nTEST 1: Preview MSBUILD Command');
	console.log('********** test - start ************');
	console.log(cmd);
	console.log('********** test - end  ************\n');
}

msbuild.publish();




additional configuration parameters
---
os

	currently only support windows
	
processor

	'x86', 'x64'
	
version

	tools version; determines local path to msbuild.exe
	
sourcePath

	'c:/mypath/mysolution.sln'   or   'c:/mypath/myproject.csproj
	
configuration

	solution configurations; targets an environment (debug,release)  
	
publishProfile

	publish profile; targets a specific machine (app01,app02)
	
outputPath

	package deploy path
	
overrideParams

	property overrides ['/p:WarningLevel=2','/p:OutputDir=bin\Debug']   
	
	target overrides  ['/tv:4.0']


	
