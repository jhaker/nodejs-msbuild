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

//var colors = require('colors');



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
		this.configuration 					= 'debug';   // solution configurations; targets an environment (debug,release)  
		this.publishProfile 				= 'mypublishprofile';   //publish profiles; targets a specific machine (app01,app02)
		
		//not implemented(use cmdParameters for /tv:)				
		this.targetFramework 			= '';  //  '2.0','3.0','3.5','4.0','4.5'  (should match destination server's iis application pool )
		
		this.outputPath 						= '';  //  'c:/deploys/release'
		this.cmdParameters		 		= [];  /***
																		property overrides ['/p:WarningLevel=2','/p:OutputDir=bin\Debug']   
																		target overrides  ['/tv:4.0']
																***/
}

	
var msbuild = function(){

	this.processors = {
			'x86': 'Framework',
			'x64': 'Framework64'
		};
		
	this.toolsVersion = {
		'2.0': '2.0.50727',  // can only target 2.0
		'3.0':'3.0',
		'3.5': '3.5',
		'4.0': '4.0.30319', // can target 2.0, 3.0, 3.5 and 4
		'4.5': '4.0.30319'
	};

	this.targetFrameworks = ['2.0','3.0','3.5','4.0','4.5'];

	this.MSBuildPath = function(os,processor,framework){
		if(os === 'linux') return;
		
		var windir = process.env.WINDIR;
		var frameworkprocessorDirectory = processor === 'x64' ? 'framework64' : 'framework';
		var frameworkDirectory = 'v' + this.toolsVersion[framework];
		return (windir + '\\Microsoft.NET\\' + frameworkprocessorDirectory + '\\' + frameworkDirectory + '\\msbuild.exe').toLowerCase();
	}
	
	this.buildexe = function(){
		return this.MSBuildPath(this.os,this.processor,this.version)
	};
};

msbuild.prototype = new defaultValues();

msbuild.prototype.config =  function(name, value) {
			var map;
			if (_.isPlainObject(name)) {
				map = name;
			} 
			else if (value !== undefined) {
				this[name] = value;
				return this;
			} else if (name === undefined) {
				return this.values;
			} else {
				return this[name];
			}

			for (var key in map) {
					this.values[name] = map[key];
			}

			return this;
};

msbuild.prototype.setConfig = function(cg){

		this.os = 								cg.os 										|| this.os;
		this.processor =					cg.processor 						|| this.processor;
		this.version =						  	cg.version 								|| this.version;
		this.sourcePath = 					cg.sourcePath 						|| this.sourcePath;
		this.configuration = 			  	cg.configuration 					|| this.configuration;  
		this.publishProfile =			  	cg.publishProfile 					|| this.publishProfile;
		this.targetFramework = 		cg.targetFramework 			|| this.targetFramework;
		this.cmdParameters = 	  		cg.cmdParameters 				|| this.cmdParameters;
		this.outputPath  =  				cg.outputPath 						|| this.outputPath;
	
}

msbuild.prototype.exec = function (cmd) {
        var childProcess = require('child_process'),
            ls;

        ls = childProcess.exec(cmd, function (error, stdout, stderr) {
            if (error) {
                //console.log(error.stack.redBG);
				console.log(error.stack);
				var errorMessage = 'Error code: ' + error.code;
				//console.log(errorMessage.red);
				console.log(errorMessage);
            }
            //console.log('RESULT: ' + stdout.grey);
			console.log('RESULT: ' + stdout);
        });
    }

msbuild.prototype.loadCmdParameters = function(params){
		var parameters = '';
		if(!params){
			parameters = parameters.concat(params);
		}
		
		for(var param in this.cmdParameters){
			if(!validateCmdParameter(param)) continue;
			parameters = parameters.concat(' ' + param + ' ');
		}
		return parameters;
}

msbuild.prototype.loadPackageParameters = function(params){
		var parameters = '';
		if(!params){
			parameters = parameters.concat(params);
		}
		
		if(parameters.indexOf('deployonbuild') === -1){
				parameters = parameters.concat(' /p:deployonbuild=false ');
		}
		if(parameters.indexOf('package') === -1){
			parameters = parameters.concat(' /t:package '); 
		}
		if(parameters.indexOf('outputpath') === -1){
			parameters = parameters.concat(' /p:outputpath='+this.outputPath+' '); 
		}
		if(parameters.indexOf('publishprofile') === -1){
			parameters = parameters.concat(' /p:publishprofile=' + this.publishProfile + ' ');
		}
		if(parameters.indexOf('configuration') === -1){
			parameters = parameters.concat(' /p:configuration='+this.configuration+' ');
		}
		return parameters;
}

msbuild.prototype.loadPublishParameters = function(params){
		var parameters = '';
		if(!params){
			parameters = parameters.concat(params);
		}
		
		if(parameters.indexOf('deployonbuild') === -1){
				parameters = parameters.concat(' /p:deployonbuild=true ');
		}
		if(parameters.indexOf('publishprofile') === -1){
			parameters = parameters.concat(' /p:publishprofile=' + this.publishProfile + ' ');
		}
		if(parameters.indexOf('configuration') === -1){
			parameters = parameters.concat(' /p:configuration='+this.configuration+' ');
		}
		return parameters;
}
	
msbuild.prototype.build = function(){
	this.exec(this.buildexe() + '  ' + this.sourcePath + ' /P:DeployOnBuild=false /P:PublishProfile=' + this.publishProfile + ' /P:Configuration='+this.configuration);
}

msbuild.prototype.package = function(){
	var parameters = '';
	parameters = this.loadCmdParameters(parameters);
	parameters = this.loadPackageParameters(parameters);
	var cmd = this.buildexe().concat(' ',this.sourcePath,' ',parameters);
	this.exec(cmd);
}

msbuild.prototype.publish = function(){
	var parameters = this.loadCmdParameters();
	parameters = this.loadPublishParameters(parameters);
	var buildpath = this.buildexe();
	var cmd = buildpath.concat(' ',this.sourcePath,' ',parameters);
	this.exec(cmd);
}



/****  help section ****/
function printHelp(o){
	var helpFunctionsToIgnore = ['exec','path','buildexe'];
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
}

var args = [];
for(var arg in process.argv) { args.push(process.argv[arg]); }
var help = args.splice(2,1);
if(help == '?') { 	printHelp( new msbuild()); } 


module.exports = new msbuild();
