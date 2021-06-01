# MedAl-reader

React native application used by clinician and feed by MedAl-creator

## Setup

This project was bootstrapped with [TheCodingMachine React Native boilerplate](https://github.com/thecodingmachine/react-native-boilerplate).

Below you'll find information about performing common tasks.

## Table of Contents

- [MedAl-reader](#medal-reader)
  - [Setup](#setup)
  - [Table of Contents](#table-of-contents)
  - [Available Scripts](#available-scripts)
    - [`yarn run android`](#yarn-run-android)
    - [`yarn test`](#yarn-test)
    - [`yarn build` only for Linux and MacOS](#yarn-build-only-for-linux-and-macos)
    - [`yarn w-build` only for Windows](#yarn-w-build-only-for-windows)
  - [Customizing App Display Name and Icon](#customizing-app-display-name-and-icon)
  - [Icons available](#icons-available)
    - [ColoredIcon](#coloredicon)
    - [Icon](#icon)
  - [Data Structure](#data-structure)
    - [Medical case](#medical-case)
  - [Writing and Running Tests](#writing-and-running-tests)
  - [Publishing](#publishing)

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

#### `yarn test` 

Runs the all the tests

#### `yarn test:watch` 

Watches your code and runs the tests everytime your code is edited

## Customizing App Display Name and Icon

Please refer to [TheCodingMachine React Native boilerplate](https://github.com/thecodingmachine/react-native-boilerplate) instruction.

## Icons available

A list of icons is available with [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons).

We also set a list of custom icons. We split it in 2 components

## Data Structure

### Medical Case

### ColoredIcon

```javascript
import { ColoredIcon } from '@/Components'

;<ColoredIcon name="about" />
```

| Name         |                                                                                                                                                      |
| ------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------: |
| about        |        ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/colored/about_color.png?raw=true 'alert')        |
| consult      |      ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/colored/consult_color.png?raw=true 'consult')      |
| home         |         ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/colored/home_color.png?raw=true 'home')         |
| logout       |       ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/colored/logout_color.png?raw=true 'logout')       |
| patient-list | ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/colored/patient-list_color.png?raw=true 'patient-list') |
| qr-scan      |      ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/colored/qr-scan_color.png?raw=true 'qr-scan')      |
| settings     |     ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/colored/settings_color.png?raw=true 'settings')     |
| summary      |      ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/colored/summary_color.png?raw=true 'summary')      |
| synchronize  |  ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/colored/synchronize_color.png?raw=true 'synchronize')  |

### Icon

```javascript
import { Icon } from '@/Components'

;<Icon name="about" />
```

| Name              |                                                                                                                                                        |
| ----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------: |
| about             |             ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/about_light.png?raw=true 'about')             |
| account-outline   |   ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/account-outline_light.png?raw=true 'account-outline')   |
| add               |               ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/add_light.png?raw=true 'add')               |
| alert             |             ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/alert_light.png?raw=true 'alert')             |
| assessment        |        ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/assessment_light.png?raw=true 'assessment')        |
| close             |             ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/close_light.png?raw=true 'close')             |
| consent-file      |      ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/consent-file_light.png?raw=true 'consent-file')      |
| consultation      |        ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/consult_light.png?raw=true 'consultation')         |
| delete            |            ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/delete_light.png?raw=true 'delete')            |
| diagnosis         |         ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/diagnosis_light.png?raw=true 'diagnosis')         |
| edit              |              ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/edit_light.png?raw=true 'edit')              |
| emergency         |         ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/emergency_light.png?raw=true 'emergency')         |
| emergency-outline | ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/emergency-outline_light.png?raw=true 'emergency-outline') |
| filters           |           ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/filtre_light.png?raw=true 'filters')            |
| home              |              ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/home_light.png?raw=true 'home')              |
| info              |              ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/info_light.png?raw=true 'info')              |
| left-arrow        |        ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/left-arrow_light.png?raw=true 'left-arrow')        |
| logout            |            ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/logout_light.png?raw=true 'logout')            |
| logout_1          |          ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/logout_light_1.png?raw=true 'logout_1')          |
| menu              |              ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/menu_light.png?raw=true 'menu')              |
| new-patient       |       ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/new-patient_light.png?raw=true 'new-patient')       |
| patient-list      |      ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/patient-list_light.png?raw=true 'patient-list')      |
| qr-scan           |           ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/qr-scan_light.png?raw=true 'qr-scan')           |
| refresh           |           ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/refresh_light.png?raw=true 'refresh')           |
| registration      |      ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/registration_light.png?raw=true 'registration')      |
| right-arrow       |       ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/right-arrow_light.png?raw=true 'right-arrow')       |
| save-quit         |         ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/save-quit_light.png?raw=true 'save-quit')         |
| search            |            ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/search_light.png?raw=true 'search')            |
| settings          |          ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/settings_light.png?raw=true 'settings')          |
| summary           |           ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/summary_light.png?raw=true 'summary')           |
| synchronize       |       ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/synchronize_light.png?raw=true 'synchronize')       |
| tests             |           ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/validate_light.png?raw=true 'tests')            |
| validate          |          ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/warning_light.png?raw=true 'validate')           |
| warning           |           ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/warning_light.png?raw=true 'warning')           |
| wifi-off          |          ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/wifi-off_light.png?raw=true 'wifi-off')          |
| wifi-on           |           ![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/wifi-on_light.png?raw=true 'wifi-on')           |

## Writing and Running Tests

This project is set up to use [jest](https://facebook.github.io/jest/) for tests. You can configure whatever testing strategy you like, but jest works out of the box. Create test files in directories called `__tests__` or with the `.test` extension to have the files loaded by jest. See the [the template project](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/App.test.js) for an example test. The [jest documentation](https://facebook.github.io/jest/docs/en/getting-started.html) is also a wonderful resource, as is the [React Native testing tutorial](https://facebook.github.io/jest/docs/en/tutorial-react-native.html).

## Publishing

Choose a version name on this [website](https://www.ikea.com/)
