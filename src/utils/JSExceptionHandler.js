/*eslint-disable */

import { setJSExceptionHandler, getJSExceptionHandler } from 'react-native-exception-handler';
import { Alert } from 'react-native';
import RNRestart from 'react-native-restart';

// For most use cases:
// registering the error handler (maybe u can do this in the index.android.js or index.ios.js)
setJSExceptionHandler((error, isFatal) => {
  // This is your custom global error handler
  // You do stuff like show an error dialog
  // or hit google analytics to track crashes
  // or hit a custom api to inform the dev team.
});
//=================================================
// ADVANCED use case:
const exceptionhandler = (error, isFatal) => {
  if (error !== undefined) {
    if (isFatal) {
      Alert.alert(
        'Unexpected error occurred',
        `
        Error: ${isFatal ? 'Fatal:' : ''} ${error.name} ${error.message}
        We have reported this to our team ! Please close the app and start again!
        `,
        [
          {
            text: 'Close',
            onPress: () => {
              RNRestart.Restart();
            },
          },
        ]
      );
    } else {
      console.log(error.name, error.message, error.stack); // So that we can see it in the ADB logs in case of Android if needed
    }
  } else {
    console.warn('Unexpected error was catched but is undefined ? o.O');
  }
};
setJSExceptionHandler(exceptionhandler, true);
// - exceptionhandler is the exception handler function
// - allowInDevMode is an optional parameter is a boolean.
//   If set to true the handler to be called in place of RED screen
//   in development mode also.

// getJSExceptionHandler gives the currently set JS exception handler
const currentHandler = getJSExceptionHandler();
