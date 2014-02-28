@ECHO OFF

TITLE MSBUILDTests
rem goto FRAMEWORKTESTS
goto PARAMTESTS
goto end


:FRAMEWORKTESTS
ECHO testing frameworks
mocha test/frameworktests.js
exit /b

:PARAMTESTS
ECHO testing params
mocha test/paramtests.js
exit /b

:end
pause
@exit /B 0
