# msbuild

Clean. Build. Package. Publish.

``` js
var _msbuild = require('msbuild');
var msbuild = new _msbuild(); 
msbuild.sourcePath = 'c:/your_app.sln';
msbuild.config('version','16.0')
msbuild.build(); 
``` 


``` js
var _msbuild = require('msbuild');
var msbuild = new _msbuild(); 
msbuild.sourcePath = 'c:/your_app.sln';
msbuild.build();
```



# install

With [npm](https://www.npmjs.com/) do:

```
npm install msbuild
```

With [bower](https://bower.io) do:

```
bower install msbuild
```



# examples
[nodejs-msbuild-examples](https://github.com/jhaker/nodejs-msbuild-examples)


# examples

### Build
*note: sourcePath .sln
``` js
var _msbuild = require('msbuild');
var msbuild = new _msbuild(); 
msbuild.sourcePath = 'c:/your_app.sln';
msbuild.build();
```


### Publish
*note: sourcePath .csproj
``` js
var _msbuild = require('msbuild');
var msbuild = new _msbuild(); 
msbuild.sourcePath = 'c:/your_app.csproj';
msbuild.overrideParams.push('/P:User=myusername');
msbuild.overrideParams.push('/P:Password=myp@assword');
msbuild.publish();
```


### Package
*note: sourcePath .csproj
``` js
var _msbuild = require('msbuild');
var msbuild = new _msbuild(); 
msbuild.sourcePath = 'c:/your_app.csproj';
msbuild.package();
```

 
### Override targets and parameters
``` js
var _msbuild = require('msbuild');
var msbuild = new _msbuild(function(){});
msbuild.sourcePath = 'c:/your_app.sln';
msbuild.configuration='Release';
msbuild.publishProfile='Production_Environment';

var overrideParams = [];
	overrideParams.push('/p:VisualStudioVersion=14.0');
	overrideParams.push('/p:allowUntrustedCertificate=true');
	overrideParams.push('/P:Password=myp@assword');
	
msbuild.config('overrideParams',overrideParams);
msbuild.publish(); 
```
'/p:VisualStudioVersion=14.0' sets version location C:\Program Files (x86)\MSBuild\Microsoft\VisualStudio\v14.0
'/tv:14.0' sets proj file targets


### Log only errors
``` js
var _msbuild = require('msbuild');
var msbuild = new _msbuild(); 
msbuild.sourcePath = 'c:/your_app.sln';
msbuild.overrideParams.push('/clp:ErrorsOnly');
msbuild.build();
```


### Preview commands and parameters by overriding exec. Can be helpful when troubleshooting.
``` js
var _msbuild = require('msbuild');
var msbuild = new _msbuild();
msbuild.sourcePath = 'c:/your_app.sln';
msbuild.configuration = 'your_app_configuration';
msbuild.publishProfile='your_app_publish_profile';
msbuild.exec  = function(cmd,params,cb){
	console.log('\nTEST 1: Preview MSBUILD Command');
	console.log('********** test - start ************');
	console.log(cmd);
	console.log(params);
	console.log('********** test - end  ************\n');
}
msbuild.publish();
```


### Adding a callback.
``` js
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



### Logging to file by overriding log method
``` js
var fs = require('fs');
var _msbuild = require('msbuild');
var msbuild = new _msbuild(); 
msbuild.logger =  function(results){
	fs.appendFile('test.txt', '\n' + results, function (err) {});
};
``` 



### Logging to file by extending events
``` js
var fs = require('fs');
var _msbuild = require('msbuild');
var msbuild = new _msbuild(); 
msbuild.on('status',function(err,results){ 
	fs.appendFile('test.txt', '\nRESULTS: ' + results, function (err) {});
});
msbuild.on('error',function(err,results){ 
	fs.appendFile('test.txt', '\nERROR: ' + results, function (err) {});
});
msbuild.on('done',function(err,results){ 
	fs.appendFile('test.txt', '\nDONE: ' + results, function (err) {});
});
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


# notes / updates

### Msbuild version "3.5.0" now available. 
```
Changes include: 
1. removed csproj and sln validation. not necessary. 
2. fixed broken tests commented out in release "3.4.0"
3. moved examples into separate repo [nodejs-msbuild-examples](https://github.com/jhaker/nodejs-msbuild-examples)
```

### Msbuild version "3.1.0" now available. 
```
Changes include: 
1. console.log extracted to allow extension 
2. minor formatting - adjustment of line indentations
```

### View git project for more examples.

### New target versions 
		'12.0': '12.0',
        '14.0': '14.0'

### Linux support added in version: "0.2.1" (thanks to richorama)

### Msbuild version "0.2.4" now available. 
```
Changes include: 
1. overrideParams validation has been corrected to support single character parameters 
  Example: "/m"
2. no longer requires "configuration" 
3. no longer requires "publishProfile"

"sourcePath" is required if the "configuration" and "publishProfile" are not defined
```


# FAQ


## error ERROR_USER_UNAUTHORIZED
build script
```
var _msbuild = require('msbuild');
var msbuild = new _msbuild(); 
msbuild.sourcePath = 'C:/myproject.sln'
msbuild.publishProfile = 'myproject';
msbuild.configuration = 'release';
msbuild.publish();
```


error 
```
"C:\myproject\myproject.csproj" (default target) (1) ->
(MSDeployPublish target) ->  C:\Program Files (x86)\MSBuild
\Microsoft\VisualStudio\v14.0\Web\Microsoft.Web.Publishing.
targets(4295,5): msdeploy error ERROR_USER_UNAUTHORIZED: 
Web deployment task failed. (Connected to the remote 
computer ("111.111.111.11") using the Web Management Service, 
but could not authorize. Make sure that you are using the 
correct user name and password, that the site you are 
connecting to exists, and that the credentials represent a 
user who has permissions to access the site.  Learn more at:
http://go.microsoft.com/fwlink/?LinkId=221672#ERROR_USER_
UNAUTHORIZED.) [C:\myproject\myproject.csproj]

    5 Warning(s)
    1 Error(s)
```



### Answer: 
Add deployment credentials. 

- Option 1: Add to publish profile (myproject.pubxml) 
- Option 2: Pass into msbuild as a configuration parameter


(Option 1)
- Open "C:\myproject\Properties\PublishProfiles\" folder 
- Open myproject.pubxml in notepad or notepad++ 
- Add "<UserName>user_name</UserName>"
- Add "<Password>user_pwd</Password>"


(Option 2)
- Modify your build script by adding "'/P:User=user_name'" and "'/P:Password=user_pwd'" overrideParams.
```
/*** modified build script ***/
var _msbuild = require('msbuild');
var msbuild = new _msbuild(); 
msbuild.sourcePath = 'C:/myproject.sln'
msbuild.publishProfile = 'myproject';
msbuild.configuration = 'release';
msbuild.overrideParams.push('/P:User=user_name');
msbuild.overrideParams.push('/P:Password=user_pwd');
msbuild.publish();
```



## error MSB8020
`C:\Program Files (x86)\MSBuild\Microsoft.Cpp\v4.0\V120\
Microsoft.Cpp.Platform.targets(64,5): error MSB8020: 
The build tools for Visual Studio 2012 (Platform Toolset 
= 'v110') cannot be found.`

### Answer: 
Include overrideParams(`--msvs_version=2012`) or update your csproj files
	

	
## error MSB3073
### I am able to build and package a project from Visual Studio but not through msbuild. 
build script
```
var _msbuild = require('msbuild');
var msbuild = new _msbuild(); 
msbuild.sourcePath = 'C:/myproject/myproject.csproj'
msbuild.package();
```

error
```
"C:\myproject\myproject.csproj" (package target) (1) ->(
BuildPackage target) ->  C:\.nuget\NuGet.targets(109,9): 
error : The imported project "C:\Program Files 
(x86)\MSBuild\Microsoft\VisualStudio\v12.0\WebApplications
\Microsoft.WebApplication.targets" was not found. 
Confirm that the path in the <Import> declaration is 
correct,and that the file exists on disk.  C:\myproject
\myproject.csproj [C:\myproject\myproject.csproj] 
C:\.nuget\NuGet.targets(109,9): error MSB3073:The 
command ""..\.nuget\NuGet.exe" pack "C:\myproject
\myproject.csproj" -Properties "Configuration=Debug;
Platform=AnyCPU" -NonInteractive -OutputDirectory 
"C:\myproject\bin" -symbols" exited with code 1. 
[C:\myproject\myproject.csproj]    7 Warning(s)
```

### Answer: 
Try removing `<BuildPackage>true</BuildPackage>` from project configuration file "*.csproj". It can be found near the top nested under `<PropertyGroup>`.

If anyone knows why this worked in Visual Studio but not cmd line please post. 
