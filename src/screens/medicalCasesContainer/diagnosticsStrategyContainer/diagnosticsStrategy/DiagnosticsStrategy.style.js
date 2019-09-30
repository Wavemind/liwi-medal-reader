import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  stepIndicator: {
    marginVertical: 50,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
    color: '#999999',
  },
  stepLabelSelected: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
    color: '#4aae4f',
  },
  viewPager: { flexGrow: 1 },
});

export const indicatorStyles = {
  stepIndicatorSize: 40,
  currentStepIndicatorSize: 50,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: liwiColors.redColor,
  stepStrokeWidth: 3,
  separatorStrokeFinishedWidth: 4,
  stepStrokeFinishedColor: liwiColors.redColor,
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: liwiColors.redColor,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: liwiColors.redColor,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#ffffff',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: liwiColors.redColor,
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  currentStepLabelColor: liwiColors.redColor,
};
