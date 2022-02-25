# MedAl-reader [![CI](https://github.com/Wavemind/liwi-medal-reader/actions/workflows/node.js.yml/badge.svg?branch=develop)](https://github.com/Wavemind/liwi-medal-reader/actions/workflows/node.js.yml)

React native application used by clinician and feed by MedAl-creator

## Setup

This project was bootstrapped with [TheCodingMachine React Native boilerplate](https://github.com/thecodingmachine/react-native-boilerplate).

Below you'll find information about performing common tasks.

## Table of contents

- [MedAl-reader ![CI](https://github.com/Wavemind/liwi-medal-reader/actions/workflows/node.js.yml)](#medal-reader-)
  - [Setup](#setup)
  - [Table of contents](#table-of-contents)
  - [Available scripts](#available-scripts)
      - [`yarn run android`](#yarn-run-android)
      - [`yarn test`](#yarn-test)
      - [`yarn build` only for Linux and MacOS](#yarn-build-only-for-linux-and-macos)
      - [`yarn w-build` only for Windows](#yarn-w-build-only-for-windows)
      - [`yarn test:watch`](#yarn-testwatch)
      - [`yarn np`](#yarn-np)
  - [Customizing app display name and icons](#customizing-app-display-name-and-icon)
  - [Data structure](#data-structure)
    - [Medical case](#medical-case)
  - [Icons available](#icons-available)
  - [Date](#date)
    - [ColoredIcon](#coloredicon)
    - [Icon](#i
    - [API](#api)
  - [Writing and running tests](#writing-and-running-tests)
  - [Publishing](#publishing)

## Available scripts

If Yarn was installed when the project was initialized, then dependencies will have been installed via Yarn, and you should probably use it to run these commands as well. Unlike dependency installation, command running syntax is identical for Yarn and NPM at the time of this writing.

#### `yarn run android`

Runs your app in development mode.

#### `yarn test`

Runs the [jest](https://github.com/facebook/jest) test runner on your tests.

#### `yarn build` only for Linux and MacOS

Generate release version of app

#### `yarn w-build` only for Windows

Generate release version of app

#### `yarn test:watch`

Watches your code and runs the tests everytime your code is edited

### `yarn np`

Set version number, build number, generate a new release and create a changelog


## Customizing app display name and icons

Please refer to [TheCodingMachine React Native boilerplate](https://github.com/thecodingmachine/react-native-boilerplate) instruction.

## Data structure

### Medical case

| Field           | type                         | Description                                                                  |
| --------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| activities      | Array<[Activity](#activity)> | Array of all activities related                                              |
| comment         | `text`                       | Clinician's comment set during the consultation stage                        |
| consent         | `boolean`                    | Tells if the patient consented to share his data for the clinical research   |
| created_at      | `datetime`                   | Date & Time when the patient was created                                     |
| diagnosis       | [Diagnosis](#diagnosis)      | Contains all the date related to the diagnoses                               |
| id              | `string (UUID)`              | Unique identification string for a medical case                              |
| nodes           | Array<[Node](#node)>         | Array of nodes                                                               |
| status          | `string`                     | Tells what is the status of the medical case (closed / 1st assessments /...) |
| synchronized_at | `datetime`                   | Date & Time when the patient was sent to Medal-Data or Medal-hub             |
| updated_at      | `string (UUID)`              | Date & Time when the patient was updated for the last time                   |
| version_id      | `integer`                    | Medal-Creator's id of the version used                                       |
| json_version    | `integer`                    | Medal-Creator's incremental of the version used                              |

## Icons available

A list of icons is available with [react-native-vector-icons](https://github.com/oblador/react-native-vector-icons).

We also set a list of custom icons. We split it in 2 components

## Date

We're using [date-fns](https://github.com/date-fns/date-fns) to handle date format. Good documentation can be found [here](https://github.com/you-dont-need/You-Dont-Need-Momentjs)


### ColoredIcon

```javascript
import { ColoredIcon } from '@/Components'
return <ColoredIcon name="about" />
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
return <Icon name="about" />
```

### API
[Swagger](https://wavemind.github.io/liwi-medal-reader)

![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/setIcons-1.jpg?raw=true 'section 1')
![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/setIcons-2.jpg?raw=true 'section 2')
![alt text](https://github.com/Wavemind/liwi-medal-reader/blob/develop/documentations/images/setIcons-3.jpg?raw=true 'section 3')

## Writing and running tests

This project is set up to use [jest](https://facebook.github.io/jest/) for tests. You can configure whatever testing strategy you like, but jest works out of the box. Create test files in directories called `__tests__` or with the `.test` extension to have the files loaded by jest. See the [the template project](https://github.com/react-community/create-react-native-app/blob/master/react-native-scripts/template/App.test.js) for an example test. The [jest documentation](https://facebook.github.io/jest/docs/en/getting-started.html) is also a wonderful resource, as is the [React Native testing tutorial](https://facebook.github.io/jest/docs/en/tutorial-react-native.html).

## Publishing
We're using [sementic](https://semver.org) for version number. We have set up [react-native-version-setter](https://github.com/tj-mc/react-native-version-setter) to manage version number
