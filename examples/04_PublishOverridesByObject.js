var _msbuild = require('../msbuild');
var msbuild = new _msbuild(function(){});


// TEST SETUP
	/* overriding publish for testing purposes */
	/* start - comment out */
	msbuild.exec  = function(cmd){
		
		console.log('\nTEST 1: Preview MSBUILD Command');
		console.log('********** test - start ************');
		console.log(cmd);
		console.log('********** test - end  ************\n');
	}
/* end setup */

/*  configure */
	var config_option= function(){
			this.os 									= 'windows';  // currently only support windows
			this.processor 						=	 'x64';  //   'x86', 'x64'
			this.version							= '4.0';  //  tools version; determines local path to msbuild.exe
			this.sourcePath 					=  'c:/mypath/mysolution.sln'
			this.configuration 					= 'myconfiguration';   // solution configurations; targets an environment (debug,release)  
			this.publishProfile 					= 'mypublishprofile';   //publish profiles; targets a specific machine (webserver01,webserver02)
			this.outputPath 						= '';  //  'c:/deploys/release'
			this.cmdParameters		 		= ['/tv:3.5'];  /***
																			property overrides ['/p:WarningLevel=2','/p:OutputDir=bin\Debug']   
																			target overrides  ['/tv:4.0']
																	***/
	}

msbuild.setConfig(new config_option());

// call publish as the last step
msbuild.publish();