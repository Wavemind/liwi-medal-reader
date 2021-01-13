import { StyleSheet } from 'react-native';
import { liwiColors } from '../../../utils/constants';

export const styles = StyleSheet.create({
  content: {
    backgroundColor: liwiColors.blackColor,
    margin: 0,
    padding: 0,
    flex: 1,
  },
  button: {
    height: 70,
    justifyContent: 'center',
    width: 65,
  },
  buttonWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    alignContent: 'space-between',
    bottom: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 25,
  },
  buttonIcon: {
    color: 'white',
    fontSize: 65,
    alignSelf: 'center',
    marginBottom: 3,
  },
  cameraButton: {
    backgroundColor: 'white',
    borderRadius: 50,
    flex: 1,
    margin: 3,
  },
  cameraOutline: {
    borderColor: 'white',
    borderRadius: 50,
    borderWidth: 3,
    height: 70,
    width: 70,
  },
  container: {
    backgroundColor: 'black',
    flex: 1,
  },
  scannerWrapper: {
    width: '100%',
    height: undefined,
    aspectRatio: 3 / 4,
  },
});
