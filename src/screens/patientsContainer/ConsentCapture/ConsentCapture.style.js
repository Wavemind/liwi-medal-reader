import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#000',
  },
  flipButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoFocusBox: {
    position: 'absolute',
    height: 64,
    width: 64,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    opacity: 0.4,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  snapIcon: {
    color: 'white',
    fontSize: 75,
    opacity: 0.7,
  },
  flex: {
    flex: 1,
  },
  iconWrapper: {
    height: 75,
    flexDirection: 'row',
    bottom: 15,
    position: 'absolute',
    alignSelf: 'center',
  },
});
