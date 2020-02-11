/* @flow */

import { Platform, StyleSheet } from 'react-native';
import { isIPhoneX } from './iPhoneXUtils';
import { liwiColors, responsiveUi } from '../../utils/constants';

const styles: Object = StyleSheet.create({
  activeDotStyle: {
    backgroundColor: liwiColors.redColor,
  },
  pad: {
    padding: responsiveUi.padding(),
  },
  inactiveDotStyle: {
    backgroundColor: '#ededed',
  },
  activeStepStyle: {
    backgroundColor: liwiColors.redColor,
  },
  inactiveStepStyle: {
    backgroundColor: '#ededed',
  },
  activeStepTitleStyle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  inactiveStepTitleStyle: {
    fontWeight: 'normal',
    fontSize: 18,
  },
  activeStepNumberStyle: {
    color: 'white',
  },
  inactiveStepNumberStyle: {
    color: 'black',
  },
  container: {
    flex: 1,
  },
  topStepper: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    elevation: 4,
    ...Platform.select({
      ios: {
        marginVertical: 12,
        shadowOpacity: 0.1,
        shadowRadius: 0.54 * 3,
        shadowOffset: {
          height: 0.6 * 3,
        },
      },
      android: {
        height: 100,
        marginBottom: 40,
      },
    }),
    backgroundColor: 'white',
  },
  bottomStepper: {
    ...Platform.select({
      ios: {
        alignItems: 'center',
        shadowOpacity: 1,
        shadowRadius: 0.54 * 3,
        shadowOffset: {
          height: 0.6 * 3,
        },
        height: isIPhoneX ? 74 : 50,
      },
      android: { height: 50 },
    }),
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 12,
  },
  button: {
    flex: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    zIndex: 0,
  },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 20,
    backgroundColor: liwiColors.redColor,
    marginHorizontal: 5,
  },
  steps: {
    width: 45,
    height: 45,
    backgroundColor: '#cdcdcd',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 45,
    borderRadius: 45,
  },
  stepTitle: {
    fontFamily: 'Avenir',
  },
  stepContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  bottomTextButtons: {
    textTransform: 'uppercase',
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
});

export { styles };
