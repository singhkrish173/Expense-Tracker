@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.
@REM ----------------------------------------------------------------------------

@echo off
set MAVEN_PROJECTBASEDIR=%~dp0
set WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"

if not exist "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper" (
    mkdir "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper"
)

if not exist %WRAPPER_JAR% (
    echo Downloading Maven Wrapper...
    powershell -Command "Invoke-WebRequest -Uri %WRAPPER_URL% -OutFile %WRAPPER_JAR%"
)

set MAVEN_OPTS=-Xmx512m

"%JAVA_HOME%\bin\java.exe" -jar %WRAPPER_JAR% %* 2>NUL
if ERRORLEVEL 1 (
    java -jar %WRAPPER_JAR% %*
)
