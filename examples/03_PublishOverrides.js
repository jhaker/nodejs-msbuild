var msbuild = require('../msbuild');

/* overriding publish for testing purposes */
/* start - comment out */
msbuild.exec  = function(cmd){
	
	console.log('\nTEST 1: Preview MSBUILD Command');
	console.log('********** test - start ************');
	console.log(cmd);
	console.log('********** test - end  ************\n');
}
/* end - comment out */




/*  configure */
console.log('\n\n');
console.log('*  OPTION 1- add configuration settings by name *');
msbuild.config('configuration','prd_release_configuration');
msbuild.config('publishProfile','server_01_publishProfile');
msbuild.config('configuration','prd_release_configuration');
msbuild.config('publishProfile','server_01_publishProfile');
msbuild.config('processor','x86');
msbuild.config('version','2.0');
msbuild.publish();
console.log('\n\n');


console.log('\n\n');
console.log('*  OPTION 2 - add configuration with object *');
var config_option_2 = function(){
		this.os 									= 'windows';  // currently only support windows
		this.processor 						=	 'x64';  //   'x86', 'x64'
		this.version							= '4.0';  //  tools version; determines local path to msbuild.exe
		this.sourcePath 					=  'c:/mypath/mysolution.sln'
		this.configuration 					= 'ppe_release';   // solution configurations; targets an environment (debug,release)  
		this.publishProfile 				= 'webserver01';   //publish profiles; targets a specific machine (webserver01,webserver02)
		//not implemented(use cmdParameters for now)				
		//this.targetFramework 			= '';  //  '2.0','3.0','3.5','4.0','4.5'  (should match destination server's iis application pool )
		
		this.outputPath 						= '';  //  'c:/deploys/release'
		this.cmdParameters		 		= ['/tv:3.5'];  /***
																		property overrides ['/p:WarningLevel=2','/p:OutputDir=bin\Debug']   
																		target overrides  ['/tv:4.0']
																***/
}
msbuild.setConfig(new config_option_2());
msbuild.publish();
console.log('\n\n');