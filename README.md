# msbuild - msbuild.exe for node.js

basic msbuild operations (build,package,release) for node.js

##linux support added in version: "0.2.1" (thanks to richorama)

## getting started
view git project for more examples


### example - build
```
var _msbuild = require('msbuild');
var msbuild = new _msbuild(); 
msbuild.sourcePath = 'c:/your_app.sln';
msbuild.configuration = 'your_app_configuration';
msbuild.publishProfile='your_app_publish_profile';
msbuild.build();
```

### example - publish w/ verbose logging
```
var _msbuild = require('msbuild');
var msbuild = new _msbuild();
msbuild.sourcePath = 'c:/your_app.sln';
msbuild.configuration = 'your_app_configuration';
msbuild.publishProfile='your_app_publish_profile';
msbuild.verbose = true; 
msbuild.publish();
```

### example - how to override exec to preview cmd arguments
```
var _msbuild = require('msbuild');
var msbuild = new _msbuild();
msbuild.sourcePath = 'c:/your_app.sln';
msbuild.configuration = 'your_app_configuration';
msbuild.publishProfile='your_app_publish_profile';
// override the exec function to output cmd 
msbuild.exec  = function(cmd){
	console.log('\nTEST 1: Preview MSBUILD Command');
	console.log('********** test - start ************');
	console.log(cmd);
	console.log('********** test - end  ************\n');
}
msbuild.publish();
```

### example - callback
```
var your_callback = function(){
	console.log('msbuild done. move on...');
}	
var _msbuild = require('msbuild');
var msbuild = new _msbuild(your_callback); 
msbuild.sourcePath = 'c:/your_app.sln';
msbuild.configuration = 'your_app_configuration';
msbuild.publishProfile='your_app_publish_profile';
msbuild.build();
```

additional configuration parameters
- `os` currently only support windows
- `processor` 	'x86', 'x64'
- `version`	tools version; determines local path to msbuild.exe
- `sourcePath`  'c:/mypath/mysolution.sln'   or   'c:/mypath/myproject.csproj
- `configuration` 	solution configurations; targets an environment (debug,release)  
- `publishProfile`  publish profile; targets a specific machine (app01,app02)
- `outputPath`  package deploy path
- `overrideParams`  property overrides ['/p:WarningLevel=2','/p:OutputDir=bin\Debug','/tv:4.0']  


###Msbuild version "0.2.4" now available. 
```
Changes include: 
1. overrideParams validation has been corrected to support single character parameters 
  Example: "/m"
2. no longer requires "configuration" 
3. no longer requires "publishProfile"

NOTE:  "sourcePath" is required if the "configuration" and "publishProfile" are not defined
```


####ISSUES/ERRORS
ERROR: 
`C:\Program Files (x86)\MSBuild\Microsoft.Cpp\v4.0\V120\Microsoft.Cpp.Platform.targets(64,5): error MSB8020: The build to
ols for Visual Studio 2012 (Platform Toolset = 'v110') cannot be found.`

FIX: 
either include overrideParams(`--msvs_version=2012`) or update your csproj files
	
