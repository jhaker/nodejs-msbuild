@ECHO OFF

TITLE MSBUILDTests
goto FRAMEWORKTESTS
goto PARAMTESTS
goto end


:FRAMEWORKTESTS
ECHO testing frameworks
mocha tests/frameworktests.js
exit /b

:PARAMTESTS
ECHO testing params
mocha tests/paramtests.js
exit /b

:end
pause
@exit /B 0
