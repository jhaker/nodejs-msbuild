# msbuild - msbuild.exe for node.js

basic msbuild operations (build,package,release) for node.js

## getting started
view git project for more examples


### example - build
```
var msbuild = require('msbuild');
msbuild.configuration = 'myconfiguration';
msbuild.publishProfile='mypublishProfile';
msbuild.build();
```

### example - publish w/ console logging verbose
```
var msbuild = require('msbuild');
msbuild.configuration = 'myconfiguration';
msbuild.publishProfile='mypublishProfile';
this.overrideParams = [];
this.overrideParams.push('/clp:ErrorsOnly');  
msbuild.publish();
```

### example - how to override exec to preview cmd arguments
```
var msbuild = require('msbuild');
msbuild.configuration = 'myconfiguration';
msbuild.publishProfile='mypublishProfile';
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