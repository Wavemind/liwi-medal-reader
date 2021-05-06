MedAl-reader
===

React native application used by clinician and feed by MedAl-creator

## Setup

This project was bootstrapped with [TheCodingMachine React Native boilerplate](https://github.com/thecodingmachine/react-native-boilerplate).

Below you'll find information about performing common tasks.

## Table of Contents

* [Available Scripts](#available-scripts)
  * [yarn run android](#yarn-run-android)
  * [yarn test](#yarn-test)
  * [yarn build only for Linux and MacOS](#yarn-build-only-for-linux-and-macoS)
  * [yarn w-build only for Windows](#yarn-w-build-only-for-windows)
* [Customizing App Display Name and Icon](#customizing-app-display-name-and-icon)
* [Icons available](#icons-available)
  * [ColoredIcon](#coloredIcon)
  * [Icon](#icon)
* [Writing and Running Tests](#writing-and-running-tests)
* [Publishing](#publishing)

## Available Scripts

If Yarn was installed when the project was initialized, then dependencies will have been installed via Yarn, and you should probably use it to run these commands as well. Unlike dependency installation, command running syntax is identical for Yarn and NPM at the time of this writing.

#### `yarn run android`

Runs your app in development mode.

#### `yarn test`

Runs the [jest](https://github.com/facebook/jest) test runner on your tests.

#### `yarn build` only for Linux and MacOS

Generate release version of app

#### `yarn w-build` only for Windows

Generate release version of app

## Customizing App Display Name and Icon

Please refer to [TheCodingMachine React Native boilerplate](https://github.com/thecodingmachine/react-native-boilerplate) instruction.

## Icons available

A list of icons is available with [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons).

We also set a list of custom icons. We split it in 2 components

### ColoredIcon

```javascript
 import ColoredIcon from '@Components/ColoredIcon'
 
 <ColoredIcon name="about"/>
```

| Name          |                                                                                                                                           |
| ------------- |:-----------------------------------------------------------------------------------------------------------------------------------------:|
| about         | ![alt text](https://github.com/Wavemind/liwi-medal-reader/master/src/Assets/Images/logo.png "alert")               |
| consult       | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/consult.png "consult")           |
| home          | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/home.png "home")                 |
| logout        | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/logout.png "logout")             |
| patient-list  | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/patient-list.png "patient-list") |
| qr-scan       | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/qr-scan.png "qr-scan")           |
| settings      | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/settings.png "settings")         |
| summary       | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/summary.png "summary")           |
| synchronize   | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize")   |

### Icon
```javascript
 import Icon from '@Components/Icon'
 
 <Icon name="about"/>
```
| Name              |                                                                                                                                         |
| ------------------|:---------------------------------------------------------------------------------------------------------------------------------------:|
| about             | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/about.png "alert") |
| account-outline   | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/about.png "alert") |
| add               | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/about.png "alert") |
| alert             | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/about.png "alert") |
| assessment        | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/consult.png "consult") |
| close             | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/home.png "home") |
| consent-file      | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/logout.png "logout") |
| consult           | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/patient-list.png "patient-list") |
| delete            | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/qr-scan.png "qr-scan") |
| diagnosis         | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/settings.png "settings") |
| edit              | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/summary.png "summary") |
| emergency         | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| emergency-outline | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| filtre            | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| home              | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| info              | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| left-arrow        | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| logout            | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| logout_1          | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| menu              | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| new-patient       | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| patient-list      | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| qr-scan           | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| refresh           | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| registration      | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| right-arrow       | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| save-quit         | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| search            | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| settings          | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| summary           | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| synchronize       | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| tests             | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| validate          | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| warning           | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| wifi-off          | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |
| wifi-on           | ![alt text](https://raw.githubusercontent.com/Wavemind/liwi-medal-reader/feature/login/src/Assets/Images/synchronize.png "synchronize") |

## Writing and Running Tests

This project is set up to use [jest](https://facebook.github.io/jest/) for tests. You can configure whatever testing strategy you like, but jest works out of the box. Create test files in directories called `__tests__` or with the `.test` extension to have the files loaded by jest. See the [the template project](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/App.test.js) for an example test. The [jest documentation](https://facebook.github.io/jest/docs/en/getting-started.html) is also a wonderful resource, as is the [React Native testing tutorial](https://facebook.github.io/jest/docs/en/tutorial-react-native.html).

## Publishing

Choose a version name on this [website](https://www.ikea.com/) 
