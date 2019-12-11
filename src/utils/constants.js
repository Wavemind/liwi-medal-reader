import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

/*** COLORS *****/
export const blueColor = '#fff';
export const liwiColors = {
  redColor: '#db473e',
  blackColor: '#232323',
  blackLightColor: '#3f3f3f',
  whiteColor: '#fff',
  lighterGreyColor: '#efefef',
  lightGreyColor: '#dbdbdb',
  greyColor: '#c4c4c4',
  darkGreyColor: '#a9a9a9',
  darkerGreyColor: '#757575',
  greenColor: '#4CAF50',
};
export const sessionsDuration = 30; // in minutes

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

export const marginLeftDrawer = 60;

/*** STYLES COMMON **/
const isTablet = DeviceInfo.isTablet();
export const paddingIsTablet = () => (isTablet ? 30 : 5);
export const marginIsTablet = () => (isTablet ? 50 : 20);
export const fontSizeTextIsTablet = () => (isTablet ? 20 : 13);
