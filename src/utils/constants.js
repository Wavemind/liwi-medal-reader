import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

/** * COLORS **** */
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
  orangeColor: '#e8b30d',
  whiteDark: '#f9f9f9',
};

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

/** * STYLES COMMON * */
export const isTablet = DeviceInfo.isTablet();
export const marginIsTablet = () => (isTablet ? 50 : 20);

export const elementPerPage = 15;

export const screensScale = {
  xs: 360,
  s: 412,
  m: 480,
  l: 600,
  xl: 800,
};

export const MOVIES_EXTENSION = ['mp4', 'mov', 'avi'];
export const AUDIOS_EXTENSION = ['mp3', 'ogg'];
export const PICTURES_EXTENSION = ['jpg', 'jpeg', 'gif', 'png', 'tiff'];

export const responsiveUi = {
  textFontSize: () => {
    switch (true) {
      case screenWidth < screensScale.s:
        return 13;
      case screenWidth > screensScale.m && screenWidth < screensScale.l:
        return 16;
      case screenWidth > screensScale.l:
        return 18;
    }
  },
  padding: () => {
    switch (true) {
      case screenWidth < screensScale.s:
        return 5;
      case screenWidth > screensScale.s:
        return 20;
    }
  },
  iconSize: () => {
    switch (true) {
      case screenWidth < screensScale.s:
        return 30;
      case screenWidth > screensScale.m && screenWidth < screensScale.l:
        return 35;
      case screenWidth > screensScale.l:
        return 45;
    }
  },
};
