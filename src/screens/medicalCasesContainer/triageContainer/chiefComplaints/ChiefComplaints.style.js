import { StyleSheet } from 'react-native';
import { screenHeight, screenWidth } from '../../../../utils/constants';

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },

  view: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  button: {
    width: screenWidth / 3.3,
    height: screenHeight / 6,
    justifyContent: 'center'
  },
});
