
var mocha = require('mocha'),
	colors = require('colors'),
	should = require('should'),
	fs = require('fs'),
	msbuild = require('../msbuild');
	
	
	/******  SETUP    ******/
	msbuild.outputPath = 'c:/mydeploys';
	msbuild.configuration = 'myconfiguration';
	msbuild.publishProfile = 'mypublishprofile';
	
	/* uncomment to test empty overrides */
	//msbuild.outputPath = '';
	//msbuild.configuration = '';
	//msbuild.publishProfile = '';
	
	msbuild.exec  = function(cmd){
	
	console.log('\nTEST 1: Preview MSBUILD Command');
	console.log('********** test - start ************');
	randomLog(cmd);
	console.log('********** test - end  ************\n');
	}
	/******  END SETUP    ******/
	
	

var randomLogIndex = 0;	
	
var randomLog = function(msg){
	if(randomLogIndex === 0){
		randomLogIndex = 1;
		console.log(msg.red.cyanBG);
	}
	if(randomLogIndex === 1){
		randomLogIndex = 0;
		console.log(msg.redBG);
	}
}

var ahr = '*********************************************';
var br = '\n';
var cyan = 'cyan';
var red = 'red';
var grey = 'grey';
function logTitle(msg,color){
	
	msg = ' '.concat(msg);
	msg = br.concat(br,ahr,br,' test - ',msg,br,ahr);
	log(msg,color);
}

function log(msg,color){
	if(color === 'red') {
		console.log(msg.red);
		return;
	}
	if(color === 'cyan') {
		console.log(msg.cyan);
		return;
	}
	if(color === 'grey') {
		console.log(msg.grey);
		return;
	}
	console.log(msg);
}





describe('msbuild',function(){
	
		describe('MSBUILD.msbuildtest',function(){
				logTitle('deploy params',cyan);
				log(msbuild.getDeployOnBuildParam(),red);
				log(msbuild.getDeployOnBuildParam(false),grey);
				log(msbuild.getDeployOnBuildParam(true),grey);
		})
		
		describe('MSBUILD.msbuildtest',function(){
				logTitle('build params',cyan);
				log(msbuild.getBuildParams(false),grey);
		})
		
		describe('MSBUILD.msbuildtest',function(){
				logTitle('package params',cyan);
				log(msbuild.getPackageParams(false),grey);
		})
		
		describe('MSBUILD.msbuildtest',function(){
				logTitle('build params',cyan);
				log(msbuild.getBuildParams(false),grey);
		})

		describe('MSBUILD.msbuildtest',function(){
				logTitle('publish params',cyan);
				log(msbuild.getPublishParams(false),grey);
		})
		
		describe('build package publish',function(){
				msbuild.build();
				msbuild.package();
				msbuild.publish();
		})
		

})
