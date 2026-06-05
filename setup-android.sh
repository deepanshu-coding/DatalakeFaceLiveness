#!/bin/bash

# Setup Gradle wrapper
cd android
rm -f gradlew gradlew.bat
rm -rf gradle/wrapper

mkdir -p gradle/wrapper
curl -L -o gradle/wrapper/gradle-wrapper.jar https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradle/wrapper/gradle-wrapper.jar

# Create gradle-wrapper.properties
echo "distributionBase=GRADLE_USER_HOME" > gradle/wrapper/gradle-wrapper.properties
echo "distributionPath=wrapper/dists" >> gradle/wrapper/gradle-wrapper.properties
echo "distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-bin.zip" >> gradle/wrapper/gradle-wrapper.properties
echo "zipStoreBase=GRADLE_USER_HOME" >> gradle/wrapper/gradle-wrapper.properties
echo "zipStorePath=wrapper/dists" >> gradle/wrapper/gradle-wrapper.properties

# Download gradlew scripts
curl -L -o gradlew https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradlew
chmod +x gradlew
curl -L -o gradlew.bat https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradlew.bat

cd ..

# Create settings.gradle
cat > android/settings.gradle << 'EOF'
rootProject.name = 'DatalakeFaceLiveness'
apply from: file("../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesSettingsGradle(settings)
include ':app'
includeBuild('../node_modules/@react-native/gradle-plugin')
EOF

# Create build.gradle
cat > android/build.gradle << 'EOF'
buildscript {
    ext {
        buildToolsVersion = "34.0.0"
        minSdkVersion = 23
        compileSdkVersion = 34
        targetSdkVersion = 34
        ndkVersion = "25.1.8937393"
        kotlinVersion = "1.9.22"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.1.1")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin")
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://www.jitpack.io' }
    }
}
EOF

echo "Android setup complete!"
