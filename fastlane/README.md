fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew install fastlane`

# Available Actions
## Android
### android build
```
fastlane android build
```

### android bundle
```
fastlane android bundle
```

### android prod
```
fastlane android prod
```
Build and upload to App Center.
### android dev
```
fastlane android dev
```
Build and upload to App Center.
### android upload_internal
```
fastlane android upload_internal
```
Build and upload to Google Play for Internal Testing.
### android codepush
```
fastlane android codepush
```
Build and upload to App Center.
### android codepush_production
```
fastlane android codepush_production
```
Build and upload to App Center.
### android codepush_testing_production
```
fastlane android codepush_testing_production
```
Build and upload to App Center.

----

## iOS
### ios cerr
```
fastlane ios cerr
```
Fetch certificates and provisioning profiles
### ios build
```
fastlane ios build
```

### ios prod
```
fastlane ios prod
```
Build and upload to App Center.
### ios dev
```
fastlane ios dev
```
Build and upload to App Center.
### ios upload_testflight
```
fastlane ios upload_testflight
```
Build and upload to Test Flight for Beta Testing.
### ios codepush
```
fastlane ios codepush
```
Build and upload to App Center.
### ios codepush_production
```
fastlane ios codepush_production
```
Build and upload to App Center.
### ios codepush_testing_production
```
fastlane ios codepush_testing_production
```
Build and upload to App Center.

----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
