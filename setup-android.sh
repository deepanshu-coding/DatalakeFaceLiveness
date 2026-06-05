#!/bin/bash

# Setup Gradle wrapper
cd android
rm -f gradlew gradlew.bat
rm -rf gradle/wrapper

mkdir -p gradle/wrapper
curl -L -o gradle/wrapper/gradle-wrapper.jar https://raw.githubusercontent.com/gradle/gradle/v8.0.2/gradle/wrapper/gradle-wrapper.jar

# Create gradle-wrapper.properties
cat > gradle/wrapper/gradle-wrapper.properties << 'EOL'
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.0.2-bin.zip
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
EOL

# Download gradlew scripts
curl -L -o gradlew https://raw.githubusercontent.com/gradle/gradle/v8.0.2/gradlew
chmod +x gradlew
curl -L -o gradlew.bat https://raw.githubusercontent.com/gradle/gradle/v8.0.2/gradlew.bat

cd ..

# Create settings.gradle
cat > android/settings.gradle << 'EOL'
rootProject.name = 'DatalakeFaceLiveness'
apply from: file("../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesSettingsGradle(settings)
include ':app'
EOL

# Create build.gradle with stable versions
cat > android/build.gradle << 'EOL'
buildscript {
    ext {
        buildToolsVersion = "33.0.0"
        minSdkVersion = 21
        compileSdkVersion = 33
        targetSdkVersion = 33
        ndkVersion = "23.1.7779620"
        kotlinVersion = "1.7.0"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:7.3.1")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url 'https://www.jitpack.io' }
    }
}
EOL

echo "Android setup complete!"
