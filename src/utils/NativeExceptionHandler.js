/*eslint-disable */
import { setNativeExceptionHandler } from 'react-native-exception-handler';

//For most use cases:
setNativeExceptionHandler((exceptionString) => {
  // This is your custom global error handler
  // You do stuff likehit google analytics to track crashes.
  // or hit a custom api to inform the dev team.
  //NOTE: alert or showing any UI change via JS
  //WILL NOT WORK in case of NATIVE ERRORS.
  console.log(exceptionString);
});
//====================================================
// ADVANCED use case:
const exceptionhandler = (exceptionString) => {
  // your exception handler code here
};
setNativeExceptionHandler(exceptionhandler, true, true);
// - exceptionhandler is the exception handler function
// - forceAppQuit is an optional ANDROID specific parameter that defines
//    if the app should be force quit on error.  default value is true.
//    To see usecase check the common issues section.
// - executeDefaultHandler is an optional boolean (both IOS, ANDROID)
//    It executes previous exception handlers if set by some other module.
//    It will come handy when you use any other crash analytics module along with this one
//    Default value is set to false. Set to true if you are using other analytics modules.
