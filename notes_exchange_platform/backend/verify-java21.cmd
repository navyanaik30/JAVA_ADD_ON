@echo off
REM Check for Java >= 21 on Windows
for /f "tokens=3" %%i in ('java -version 2^>^&1 ^| findstr /i "version"') do set JAVA_VERSION=%%i
set JAVA_VERSION=%JAVA_VERSION:"=%
for /f "tokens=1 delims=." %%a in ("%JAVA_VERSION%") do set MAJOR_VERSION=%%a
echo Detected Java version: %JAVA_VERSION% (major version: %MAJOR_VERSION%)
echo.
echo Checking if Java version is 21 or higher...
if %MAJOR_VERSION% LSS 21 (
    echo.
    echo ERROR: Java version %MAJOR_VERSION% is too old.
    echo Please install JDK 21 or newer and set JAVA_HOME appropriately.
    echo Current java -version output:
    java -version 2>&1
    exit /b 1
)
echo Java version %MAJOR_VERSION% meets minimum requirement (>=21).
echo Current java -version output:
java -version
exit /b 0
