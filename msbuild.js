/*
msbuild.js

copyright (c) 2014

jonathan haker


THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

var events = require('events'),
	async = require('async'),
	colors = require('colors');
	
var args = [];
for(var arg in process.argv) { args.push(process.argv[arg]); }
var help = args.splice(2,1);
var x = function(){};
var _ = new x();
_.isPlainObject = function(obj){
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
	param += "";
	param = param.trim();
	if (param.length <= 2)  return false;
	if (param.substring(0, 1) !== "/")  return false;
	if (param.indexOf(":")  < 1)  return false;
	return true;
}

var defaultPath = process.cwd();

var defaultValues = function(){
		this.os 									= 'windows';  // currently only support windows
		this.processor 						=	 'x86';  //   'x86', 'x64'
		this.version							= '4.0';  //  tools version; determines local path to msbuild.exe
		this.sourcePath 					= defaultPath;  //  'c:/mypath/mysolution.sln'   or   'c:/mypath/myproject.csproj
		this.configuration 					= 'myconfiguration';   // solution configurations; targets an environment (debug,release)  
		this.publishProfile 					= 'mypublishprofile';   //publish profiles; targets a specific machine (app01,app02)
		this.outputPath 						= '';  //  'c:/deploys/release'
		this.overrideParams		 		= ['/clp:ErrorsOnly;'];  /***
																		property overrides (example: ['/p:WarningLevel=2','/p:OutputDir=bin\Debug']  ) 
																		target framework overrides (example:  ['/tv:4.0'] )
																***/
}

var msbuild = function(){
	events.EventEmitter.call(this);
	this.showHelp = help == '?';
	this.processors = { 	'x86': 'Framework', 'x64': 'Framework64'	};
	this.toolsVersion = {
		'2.0': '2.0.50727',  // can only target 2.0
		'3.0':'3.0',
		'3.5': '3.5',
		'4.0': '4.0.30319', // can target 2.0, 3.0, 3.5 and 4
		'4.5': '4.0.30319'
	};
};

msbuild.prototype = new defaultValues();

msbuild.prototype.__proto__ = events.EventEmitter.prototype;

msbuild.prototype.getMSBuildPath = function(os,processor,framework){
	if(os === 'linux') return;
	
	var windir = process.env.WINDIR;
	var frameworkprocessorDirectory = processor === 'x64' ? 'framework64' : 'framework';
	var frameworkDirectory = 'v' + this.toolsVersion[framework];
	return (windir + '\\Microsoft.NET\\' + frameworkprocessorDirectory + '\\' + frameworkDirectory + '\\msbuild.exe').toLowerCase();
}

msbuild.prototype.buildexe = function(){
	return this.getMSBuildPath(this.os,this.processor,this.version)
}

msbuild.prototype.config =  function(name, value) {

	if(name.toLowerCase() === 'targetframework') 
	{
		console.log('\n * CONFIG WARNING: \''.concat(name,'\'  has been deprecated\n   Please use overrideParams (example: overrideParams = [\'/tv:4.0\'] )\n'));
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
		this.os = 								cg.os 										|| this.os;
		this.processor =					cg.processor 						|| this.processor;
		this.version =						  	cg.version 								|| this.version;
		this.sourcePath = 					cg.sourcePath 						|| this.sourcePath;
		this.configuration = 			  	cg.configuration 					|| this.configuration;  
		this.publishProfile =			  	cg.publishProfile 					|| this.publishProfile;
		this.overrideParams = 	  		cg.overrideParams 				|| this.overrideParams;
		this.outputPath  =  				cg.outputPath 						|| this.outputPath;
}

msbuild.prototype.exec = function (cmd) {
	var self = this;
	if(self.showHelp) { self.printHelp(); return; } //abort 
	
	var childProcess = require('child_process'), ls;
	ls = childProcess.exec(cmd, function (error, stdout, stderr) {
		var msg = '';
		if (error) {
			msg = ('\nstack...\n' + error.stack).grey+('\n publish failed - errors'.white.redBG);
			self.emit('error',error.code,msg);
			return;
		}
		else{
			msg = stdout.grey+('\n publish finished - no errors'.white.greenBG);
			self.emit('done',null,msg);
		}
	});
}
	
msbuild.prototype.getDeployOnBuildParam = function(shouldDeploy){
		if(!shouldDeploy){
			shouldDeploy = false;
		}
		return ' /p:deployonbuild='.concat(shouldDeploy);
}

msbuild.prototype.getBuildParams = function(params){
		if(!params){
			params = '';
		}
		params += "";
		
		if(params.indexOf('configuration') === -1 && this.configuration){
			params += (' /p:configuration='+this.configuration+' ');
		}
		if(params.indexOf('publishprofile') === -1 && this.publishProfile){
			params += (' /p:publishprofile=' + this.publishProfile + ' ');
		}
		return params;
}

msbuild.prototype.getPackageParams = function(params){
		if(!params){
			params = '';
		}
		params += "";
		
		console.log(params.cyanBG);
		if(params.indexOf('deployonbuild') === -1){
				var deployOnBuildParam = this.getDeployOnBuildParam(false);
				params += deployOnBuildParam;
		}
		if(params.indexOf('package') === -1){
			params += (' /t:package '); 
		}
		if(params.indexOf('outputpath') === -1 && this.outputPath){
			params += (' /p:outputpath='+this.outputPath+' '); 
		}
		return params;
}

msbuild.prototype.getPublishParams = function(params){
		if(!params){
			params = '';
		}
		params += "";
		
		if(params.indexOf('deployonbuild') === -1){
				var deployOnBuildParam = this.getDeployOnBuildParam(true);
				params += (deployOnBuildParam);
		}
		return params;
}

msbuild.prototype.getOverrideParams = function(params){
		if(!params){
			params = '';
		}
		params += "";
		
		this.overrideParams.forEach(function (param) {
		    if (!validateCmdParameter(param)) return;
		    params += (' ' + param + ' ');
		});
		return params;
}
	
msbuild.prototype.build = function(){
	this.emit('status',null,'build starting');
	var params = this.getDeployOnBuildParam(false);
		 params = this.getBuildParams(params);
	var buildpath = this.buildexe();
	var cmd = buildpath.concat(' ',this.sourcePath,' ',params);
	this.exec(cmd);
}

msbuild.prototype.package = function(){
	this.emit('status',null,'package starting');
	var params = this.getBuildParams();
		 params = this.getOverrideParams(params);
		 params = this.getPackageParams(params);
	var cmd = this.buildexe().concat(' ',this.sourcePath,' ',params);
	this.exec(cmd);
}

msbuild.prototype.publish = function(){
	this.emit('status',null,'publish starting');
	var params = this.getBuildParams();
		 params = this.getOverrideParams(params);
		 params = this.getPublishParams(params);
	var buildpath = this.buildexe();
	var cmd = buildpath.concat(' ',this.sourcePath,' ',params);
	this.exec(cmd);
	
}

/****  help section ****/
msbuild.prototype.printHelp = function(){
	var o = this;
	var helpFunctionsToIgnore = ['exec','path','buildexe','on','once','emit','addListener','removeListener','removeAllListeners','listeners','setMaxListeners','printHelp'];
	console.log("\nfunctions".cyan.bold);
	console.log('*******************'.cyan);
	
	for(var p in o){
		if(typeof(o[p]) == 'function'){
			if(helpFunctionsToIgnore.indexOf(p) > -1) continue;
			if(p == 'printOptions') continue;
			if(p == '?') continue;
			console.log(p.redBG);
		}
	}
	
	console.log("\nevents".cyan.bold + ' [err,results]'.grey);
	console.log('*******************'.cyan);
	console.log('status'.redBG+' // msbuild.on(\'status\',myfunc)'.grey);
	console.log('error'.redBG+' // msbuild.on(\'error\',myfunc)'.grey);
	console.log('done'.redBG+' // msbuild.on(\'done\',myfunc)'.grey);
}


var msb = new msbuild();
msb.on('status',function(err,results){ if(this.showHelp) return; if(err){ console.log(err.redBG);}; console.log(results.cyan);});
msb.on('error',function(err,results){ console.log('error'.red); if(err){ console.log(err.redBG);}; console.log(results.red);});
msb.on('done',function(err,results){console.log(results);});
module.exports = msb;
