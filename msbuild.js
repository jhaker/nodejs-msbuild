/*
 msbuild.js
 
 copyright (c) 2014 jonathan haker
 Licensed under the MIT license.
 https://github.com/jhaker/nodejs-msbuild

*/
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

var events = require('events'),
	async = require('async'),
	colors = require('colors'),
	fs = require('fs'),
	path = require('path'),
	spawn = require('child_process').spawn;

var default_os = require('os').platform();

if (default_os !== 'linux') default_os = "windows";

var args = [];

for (var arg in process.argv) {
     args.push(process.argv[arg]);
}

var help = args.splice(2,1);
var x = function(){};
var _ = new x();

_.isPlainObject = function (obj) {
  var ctor, key;
  if (typeof obj != 'object' || !obj || toString.call(obj) != '[object Object]') {
    return false;
  }
  ctor = typeof obj.constructor == 'function' && obj.constructor.prototype;
  if (!ctor || !hasOwnProperty.call(ctor, 'isPrototypeOf')) {
    return false;
  }
  for (key in obj) {}
  return key === void 0 || hasOwnProperty.call(obj, key);
};

var validateCmdParameter = function(param){
	if (param.length < 2)  return false;
	return true;
}

var validFrameworkDir = function(dir) {
	return dir.indexOf('1') === 0;
}

var getFrameworkDirectories = function(msbuildDir){
	if (fs.existsSync(msbuildDir)) {
		return fs.readdirSync(msbuildDir)
			.filter(validFrameworkDir);
	} else {
		return [];
	}
}

var mapProcessor = function(processor) {
	if(!isNaN(processor) && processor !== undefined){
		processor = 'x'+processor;
	}
	if(processor !== 'x64'){
		processor = 'x86';
	}
	return processor;
}

var defaultPath = process.cwd();

var lineBreak = '\n- - - - - - - - - - - - - - - -';

var msbuild = function(){
	events.EventEmitter.call(this);
	this.showHelp = help == '?';
	this.processors = { 'x86': 'Framework', 'x64': 'Framework64' };
	this.os 				= default_os;  	// windows, linux
	this.processor 			= 'x64';  		// 'x86', 'x64'
	this.version			= 'current';		// tools version; determines local path to msbuild.exe
	this.sourcePath 		= defaultPath;  // 'c:/mypath/mysolution.sln'   or   'c:/mypath/myproject.csproj
	this.configuration 		= undefined;   	// solution configurations; targets an environment (debug,release)
	this.publishProfile 	= undefined;   	// publish profiles; targets a specific machine (app01,app02)
	this.outputPath 		= ''; 			// 'c:/deploys/release'
	this.verbose 			= false;
	/***
	property overrides (example: ['/clp:ErrorsOnly;', '/p:WarningLevel=2','/p:OutputDir=bin\Debug']  )
	target framework overrides (example:  ['/tv:4.0'] )
	***/
	this.overrideParams		= [];
};

msbuild.prototype.toolsVersion = {
		'2.0': '2.0.50727', 
		'3.0':'3.0',
		'3.5': '3.5',
		'4.0': '4.0.30319', 
		'4.5': '4.0.30319',
		'12.0': '12.0',
    '14.0': '14.0',
		'15.0': '(not used)',
		'16.0': '(not used)'
	};

msbuild.prototype.__proto__ = events.EventEmitter.prototype;

msbuild.prototype.logger = function(msg){
	console.log(msg);
}

msbuild.prototype.getMSBuildPath = function(os,processor,version){
	if(os === 'linux' || os === 'darwin') return "xbuild";

	var frameworkDirectories,programFilesDir,msbuildDir,exeDir;
	var vsIdeType = {
		Pro: 'Professional',
		Enterprise: 'Enterprise',
		Community: 'Community',
		BuildTools: 'BuildTools'
	};
	
	programFilesDir = process.env['programfiles(x86)'] || process.env.PROGRAMFILES;

// For the msbuild 15.0 pr 16.0 version, use the appropriate VS2017 pr VS2019 directories
	if (version === "15.0" || version === "16.0") {

		// MSBuild 16.0 is installed in the "\current" folder under each version of Visual Studio or BuildTools folder.
		// See https://docs.microsoft.com/en-us/visualstudio/msbuild/whats-new-msbuild-16-0?view=vs-2019
		var vsIdeVersion = "2019";
		var msBuildSubDir = "current";

		// MSBuild 15.0 is installed in the "\15.0" folder under each version of Visual Studio or BuildTools folder.
		// See https://docs.microsoft.com/en-us/visualstudio/msbuild/what-s-new-in-msbuild-15-0?view=vs-2017
		if (version === "15.0") {
			vsIdeVersion = "2017";
			msBuildSubDir = version;
		}

		// If VSINSTALLDIR env. var cannot be found, see what could be the directory by searching the usual suspects
		// (while giving higher priority to the VS2017/2019 IDE installs over the Build Tools only install)
		if (process.env.vsInstallDir === undefined) {
			var possibleVSInstallDir = programFilesDir + '\\' + 'Microsoft Visual Studio\\' + vsIdeVersion + '\\';
			if (fs.existsSync(possibleVSInstallDir + vsIdeType.Pro))
				msbuildDir = possibleVSInstallDir + vsIdeType.Pro + '\\';
			else if (fs.existsSync(possibleVSInstallDir + vsIdeType.Enterprise + '\\'))
				msbuildDir = possibleVSInstallDir + vsIdeType.Enterprise + '\\';
			else if (fs.existsSync(possibleVSInstallDir + vsIdeType.Community + '\\'))
				msbuildDir = possibleVSInstallDir + vsIdeType.Community + '\\';
			else if (fs.existsSync(possibleVSInstallDir + vsIdeType.BuildTools + '\\'))
				msbuildDir = possibleVSInstallDir + vsIdeType.BuildTools + '\\';
		}
		else {
			msbuildDir = process.env.vsInstallDir;
		}

		exeDir = msbuildDir + 'MSBuild\\' + msBuildSubDir + '\\bin\\msbuild.exe';
		// console.log('found msbuild.exe dir = ' + exeDir);
	}

	// If the msbuild.exe file exists, we are done.
	if (exeDir != undefined && fs.existsSync(exeDir)) {
		// console.log('using msbuild 15.0+ exeDir = ' + exeDir)
		return exeDir;
	}

	// Otherwise, look for the older msbuild versions
	msbuildDir = programFilesDir + '\\' + 'MSBuild';
	frameworkDirectories = getFrameworkDirectories(msbuildDir);

	if(this.toolsVersion[version] == undefined ){
		if (frameworkDirectories.length > 0) 
			version = frameworkDirectories.pop();
	}

	exeDir = msbuildDir + '\\' + version + '\\' + 'bin';
	processor = mapProcessor(processor);

	if(processor === 'x64')
		exeDir = exeDir + '\\' + 'amd64';

	if (!fs.existsSync(exeDir))
		exeDir = process.env.WINDIR + '\\' + 'microsoft.net' + '\\' + this.processors[processor] + '\\' + 'v' + this.toolsVersion[version];

	return exeDir + '\\' + 'msbuild.exe';
}

msbuild.prototype.buildexe = function(){
	return this.getMSBuildPath(this.os,this.processor,this.version);
}

msbuild.prototype.config =  function(name, value) {

	if(name.toLowerCase() === 'targetframework') {
		this.logger('\n * CONFIG WARNING: \''.concat(name,'\'  has been deprecated\n   Please use overrideParams (example: overrideParams = [\'/tv:4.0\'] )\n'));
		return;
	}	
	
	var map;

	if (_.isPlainObject(name)) { map = name; } 
	else if (value !== undefined) { this[name] = value; return this;	} 
	else if (name === undefined) { return this.values; } 
	else { return this[name]; }

	for (var key in map) { this.values[name] = map[key]; }
	
	return this;
};

msbuild.prototype.setConfig = function(cg){
	this.os = 				cg.os 				|| this.os;
	this.processor =		cg.processor 		|| this.processor;
	this.version =			cg.version 			|| this.version;
	this.sourcePath = 		cg.sourcePath 		|| this.sourcePath;
	this.configuration = 	cg.configuration 	|| this.configuration;  
	this.publishProfile =	cg.publishProfile 	|| this.publishProfile;
	this.overrideParams = 	cg.overrideParams	|| this.overrideParams;
	this.outputPath  =  	cg.outputPath		|| this.outputPath;
}

msbuild.prototype.abort = function (msg) {
	var self = this;
	self.emit('error','',msg);
	return;
}

msbuild.prototype.exec = function(exe,params,cb){
	var self = this;
	if(self.showHelp) { self.printHelp(); return; } 
	
	function onClose(code) {
		var msg = '';
		if (code === 0) {
			msg = msg+('\n finished - (0) errors'.white.greenBG);
			self.emit('done',null,msg);
		 }
		else {
			msg = ('\n error code: ' + code).grey+('\n failed - errors'.white.redBG);
			msg += '\n'+exe; 
			if(params !== undefined && typeof params === 'array'){
				params.forEach(function(p){msg += ' ' + p; }); 
			}
			self.emit('error',code,msg);
			return;
		}		
		cb();
	}

    return spawn(exe, params, { stdio: 'inherit'}).on('close', onClose );
}

msbuild.prototype.getBuildParams = function(params){
	if(params.indexOf('configuration') === -1 && this.configuration)
		params.push('/p:configuration='+this.configuration);
	
	if(params.indexOf('publishprofile') === -1 && this.publishProfile)
		params.push('/p:publishprofile=' + this.publishProfile);
	
	return params;
}

msbuild.prototype.getPackageParams = function(params){
	if(params.indexOf('package') === -1)
		params.push('/t:package'); 
	
	if(params.indexOf('deployonbuild') === -1)
		params.push('/p:deployonbuild=false'); 

	if(params.indexOf('outputpath') === -1 && this.outputPath)
		params.push('/p:outputpath='+this.outputPath); 
	
	return params;
}

msbuild.prototype.getPublishParams = function(params){
	if(params.indexOf('deployonbuild') === -1)
		params.push('/p:deployonbuild=true'); 
	
	if(params.indexOf('allowUntrustedCertificate') === -1)
		params.push('/p:allowUntrustedCertificate=true'); 

	return params;
}

msbuild.prototype.getOverrideParams = function(params){
	this.overrideParams.forEach(function (param) {
		if (!validateCmdParameter(param)) {
			this.logger('error: invalid parameter "'+param+'"');
			return;
		}
		params.push(param);
	});
	return params;
}

msbuild.prototype.emitStatusStart = function(action){
	var startingMsg = ('  '+action+' starting').cyan;
	this.emit('status',null,startingMsg);
}	

msbuild.prototype.validateSourcePath = function () {
    return fs.existsSync(this.sourcePath);
}

msbuild.prototype.build = function(){
	this.emitStatusStart('build');
	
	var params = [];
	var self = this;
	params.push(this.sourcePath);
	this.getBuildParams(params);
	this.getOverrideParams(params);
	
	if(!this.validateSourcePath()){
	    this.abort('aborting...bad source path');
		return;
	} 
	
	this.exec(this.buildexe(),params,function(){
		self.logger('build done');
	});
}

msbuild.prototype.package = function(){
	this.emitStatusStart('package');
	
	var params = [];
	var self = this;
	params.push(this.sourcePath);
	this.getBuildParams(params);
	this.getOverrideParams(params);
	this.getPackageParams(params);
	
	if(!this.validateSourcePath()){
		this.abort('aborting...bad source path');
		return;
	} 

	this.exec(this.buildexe(),params,function(){self.logger('package done');});
}

msbuild.prototype.publish = function(){
	this.emitStatusStart('publish');
	
	var params = [];
	var self = this;
	params.push(this.sourcePath);
	this.getBuildParams(params);
	this.getOverrideParams(params);
	this.getPublishParams(params);
	
	if(!this.validateSourcePath()){
		this.abort('aborting...bad source path');
		return;
	} 
	
	this.exec(this.buildexe(),params,function(){self.logger('publish done');});
}

msbuild.prototype.printHelp = function(){
	var o = this;
	var helpFunctionsToIgnore = ['exec','path','buildexe','on','once','emit','addListener','removeListener','removeAllListeners','listeners','setMaxListeners','printHelp'];
	this.logger("\nfunctions".cyan.bold);
	this.logger('*******************'.cyan);
	
	for(var p in o){
		if(typeof(o[p]) == 'function'){
			if(helpFunctionsToIgnore.indexOf(p) > -1) continue;
			if(p == 'printOptions') continue;
			if(p == '?') continue;
			this.logger(p.redBG);
		}
	}
	
	this.logger("\nevents".cyan.bold + ' [err,results]'.grey);
	this.logger('*******************'.cyan);
	this.logger('status'.redBG+' // msbuild.on(\'status\',myfunc)'.grey);
	this.logger('error'.redBG+' // msbuild.on(\'error\',myfunc)'.grey);
	this.logger('done'.redBG+' // msbuild.on(\'done\',myfunc)'.grey);
}

module.exports = function(callback){
	var msb = new msbuild(callback);
	msb.on('status',function(err,results){ 
			if(this.showHelp) return; 
			if(err) this.logger(err.redBG);
			this.logger(results);
		});
	msb.on('error',
		function(err,results){ 
			this.logger('  error'.red); 
			if(err) this.logger(err.redBG);
			this.logger(results.red);
		});
	msb.on('done',function(err,results){ 
			this.logger(results); 
			this.logger(lineBreak);
			if(typeof callback == 'function') callback();
		});
	return msb;
};
