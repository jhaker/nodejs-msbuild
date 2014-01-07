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

var msbuild = function(){

	this.config = {
		processor : 'x86',
		version: 'v4.0.30319',
		solutionName : '',
		solutionPath : process.cwd(),
		projectName : '',
		projectPath : process.cwd(),
		configuration : 'Debug',
		publishProfile : '',
		targetFramework : '4.0',
		deployParameters : '',
		packageOutputPath : ''
	};
	
	this.processors = {
        'x86': 'Framework',
        'x64': 'Framework64'
    };
	
	this.buildexe = function(){return ' %systemroot%/Microsoft.NET/'+this.processors[this.config.processor]+'/'+this.config.version+'/msbuild.exe';};
	
    this.path = function (newPath) {
        this.config.path = newPath;
        process.chdir(this.config.path);
        return this;
    };
	
    this.versions = {
        '1':'1.0.3705',
        '1.0':'1.0.3705',
        '1.1':'1.1.4322',
        '2': '2.0.50727',
        '2.0': '2.0.50727',
        '3.5': '3.5',
        '4.0': '4.0.30319',
        'net1.0': '1.0.3705',
        'net10': '1.0.3705',
        'net1.1': '1.1.4322',
        'net11': '1.1.4322',
        'net2.0': '2.0.50727',
        'net20': '2.0.50727',
        'net3.5': '3.5',
        'net35': '3.5',
        'net4.0': '4.0.30319',
        'net40': '4.0.30319'
    };
	
	this.targetFrameworks = ['v2.0','v3.0','v3.5','v4.0','v4.5','v4.5.1'];

};

msbuild.prototype.exec = function (cmd) {
        var childProcess = require('child_process'),
            ls;

        ls = childProcess.exec(cmd, function (error, stdout, stderr) {
            if (error) {
                console.log(error.stack);
                console.log('Error code: ' + error.code);
                console.log('Signal received: ' + error.signal);
            }
            console.log('Child Process STDOUT: ' + stdout);
        });

        ls.on('exit', function (code) {
            console.log('Child process exited with exit code ' + code);
        });
    }

msbuild.prototype.setConfig = function(cg){
		this.config.solutionName = 		cg.solutionName;
		this.config.solutionPath = 		cg.solutionPath;
		this.config.projectName = 		cg.projectName;
		this.config.projectPath = 		cg.projectPath;
		this.config.configuration = 	cg.configuration;
		this.config.publishProfile =	cg.publishProfile;
		this.config.targetFramework = 	cg.targetFramework;
		this.config.deployParameters = 	cg.deployParamters;
		this.config.packageOutputPath = cg.packageOutputPath();
}

msbuild.prototype.build = function(){
	this.exec('cd ' + this.config.solutionPath + ' & ' + this.buildexe() + ' ' + this.config.solutionName + '.sln' + ' /P:DeployOnBuild=false /P:PublishProfile=' + this.config.publishProfile + ' /P:Configuration='+this.config.configuration);
}

msbuild.prototype.packageByProj = function(){
	var packageParameters = '';
	packageParameters = packageParameters.concat(' /p:DeployOnBuild=false ');
	packageParameters = packageParameters.concat(' /t:Package '); 
	packageParameters = packageParameters.concat(' /p:OutputPath='+this.config.packageOutputPath+' '); 
	packageParameters = packageParameters.concat(' /p:PublishProfile=' + this.config.publishProfile + ' ');
	packageParameters = packageParameters.concat(' /p:Configuration='+this.config.configuration+' ');
	packageParameters = packageParameters.concat(' /tv:4.0 ');
	
	var build_cmd = 'cd ' + this.config.projectPath + ' & ' + this.buildexe() + ' ';
	var source = this.config.projectName + '.csproj ';
	var runthis = build_cmd.concat(source,packageParameters);
	this.exec(runthis);
}

msbuild.prototype.package = function(){
	var packageParameters = '';
	packageParameters = packageParameters.concat(' /p:DeployOnBuild=false ');
	packageParameters = packageParameters.concat(' /t:Package '); 
	packageParameters = packageParameters.concat(' /p:OutputPath='+this.config.packageOutputPath+' '); 
	packageParameters = packageParameters.concat(' /p:PublishProfile=' + this.config.publishProfile + ' ');
	packageParameters = packageParameters.concat(' /p:Configuration='+this.config.configuration+' ');
	packageParameters = packageParameters.concat(' /tv:4.0 ');
	
	var build_cmd = 'cd ' + this.config.projectPath + ' & ' + this.buildexe() + ' ';
	var source = this.config.projectName + '.csproj ';
	var runthis = build_cmd.concat(source,packageParameters);
	this.exec(runthis);
}

msbuild.prototype.publishPackage = function(_parameters){
	var path = this.config.packageOutputPath+'\\_PublishedWebsites\\'+this.config.projectName+'_Package';
	var cmdPath = path +'\\'+this.config.projectName+'.deploy.cmd';
	console.log(cmdPath);
	var build_cmd = 'cd ' + path + ' & ' + cmdPath + ' ';
	var runthis = build_cmd.concat(_parameters);
	this.exec(runthis);
}

msbuild.prototype.publish = function(){
	var publishParameters = '';
	publishParameters = publishParameters.concat(' /p:DeployOnBuild=true ');
	publishParameters = publishParameters.concat(' /P:Configuration='+this.config.configuration+' ');
	publishParameters = publishParameters.concat(' /p:PublishProfile=' + this.config.publishProfile + ' ');
	var build_cmd = 'cd ' + this.config.solutionPath + ' & ' + this.buildexe() + ' ';
	var source = this.config.solutionName + '.sln ';
	var runthis = build_cmd.concat(source,publishParameters);
	this.exec(runthis);
}

msbuild.prototype.test = function(){
	var publishParameters = '';
	publishParameters = publishParameters.concat(' /p:DeployOnBuild=true ');
	publishParameters = publishParameters.concat(' /P:Configuration='+this.config.configuration+' ');
	publishParameters = publishParameters.concat(' /p:PublishProfile=' + this.config.publishProfile + ' ');
	var build_cmd = 'cd ' + this.config.solutionPath + ' & ' + this.buildexe() + ' ';
	var source = this.config.solutionName + '.sln ';
	var runthis = build_cmd.concat(source,publishParameters);
	console.log(runthis);
}


module.exports = new msbuild();
