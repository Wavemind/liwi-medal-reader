/* @flow */

import { Dimensions, Platform, StyleSheet } from 'react-native';

import { liwiColors, responsiveUi } from '../../utils/constants';

const X_WIDTH: number = 375;
const X_HEIGHT: number = 812;

function isIPhoneX(): boolean {
  return (
    Platform.OS === 'ios' &&
    ((Dimensions.get('window').height === X_HEIGHT && Dimensions.get('window').width === X_WIDTH) || (Dimensions.get('window').height === X_WIDTH && Dimensions.get('window').width === X_HEIGHT))
  );
}

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
    fontSize: 14,
  },
  inactiveStepTitleStyle: {
    fontWeight: 'normal',
    fontSize: 14,
  },
  activeStepNumberStyle: {
    color: 'white',
  },
  inactiveStepNumberStyle: {
    color: 'black',
  },

  topStepper: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingBottom: 5,
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
    borderRadius: 45,
  },
  container: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'Avenir',
    textAlign: 'center',
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: 5,
  },
  bottomTextButtons: {
    textTransform: 'uppercase',
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'Roboto-Light',
      },
    }),
  },
  saveButton: {
    justifyContent: 'flex-end',
    flex: 1,
    alignContent: 'flex-end',
    alignItems: 'flex-end',
  },
});

export { styles };
