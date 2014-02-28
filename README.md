# msbuild - msbuild.exe for node.js

basic msbuild operations (build,package,release) for node.js

## getting started
view git project for more examples


### example - build
```
var _msbuild = require('msbuild');
var msbuild = new _msbuild(your_callback); 
msbuild.sourcePath = 'c:/your_app.sln';
msbuild.configuration = 'your_app_configuration';
msbuild.publishProfile='your_app_publish_profile';
msbuild.build();
```

### example - publish w/ verbose logging
```
var _msbuild = require('msbuild');
var msbuild = new _msbuild(your_callback);
msbuild.sourcePath = 'c:/your_app.sln';
msbuild.configuration = 'your_app_configuration';
msbuild.publishProfile='your_app_publish_profile';
msbuild.verbose = true; 
msbuild.publish();
```

### example - how to override exec to preview cmd arguments
```
var _msbuild = require('msbuild');
var msbuild = new _msbuild(your_callback);
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

additional configuration parameters
- `os` currently only support windows
- `processor` 	'x86', 'x64'
- `version`	tools version; determines local path to msbuild.exe
- `sourcePath`  'c:/mypath/mysolution.sln'   or   'c:/mypath/myproject.csproj
- `configuration` 	solution configurations; targets an environment (debug,release)  
- `publishProfile`  publish profile; targets a specific machine (app01,app02)
- `outputPath`  package deploy path
- `overrideParams`  property overrides ['/p:WarningLevel=2','/p:OutputDir=bin\Debug','/tv:4.0']  
