import { Dimensions, StyleSheet } from 'react-native';
import { liwiColors, screenWidth } from '../../utils/constants';

export const styles = StyleSheet.create({
  buttonNav: {
    flex: 0.5,
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: liwiColors.redColor,
    marginLeft: 5,
    marginRight: 5,
  },

  buttonSummary: {
    flex: 0.5,
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: liwiColors.greenColor,
    marginLeft: 5,
    marginRight: 5,
  },

  buttonForceUnlock: {
    flex: 0.5,
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: liwiColors.orangeColor,
    marginLeft: 5,
    marginRight: 5,
  },

  warning: { alignSelf: 'center', color: liwiColors.redColor, fontSize: 25 },

  questions: { marginLeft: 15 },

  icon: {
    fontSize: 18,
    color: liwiColors.whiteColor,
  },

  textBold: { fontFamily: 'Roboto-Bold', color: liwiColors.redColor, marginTop: 10, textTransform: 'capitalize' },

  textSub: { alignSelf: 'center' },

  content: { textAlign: 'center' },

  modal: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 22, paddingBottom: 22, backgroundColor: 'rgba(0,0,0,0.6)' },

  modalContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    shadowColor: '#f4f4f4',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
    width: '94%',
    alignSelf: 'flex-start',
  },

  iconInfo: {
    color: liwiColors.redColor,
    marginTop: 10,
    alignSelf: 'flex-start',
  },

  touchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },

  modalContent: { paddingLeft: 30, paddingRight: 30, paddingBottom: 30 },

  closeButton: { width: 50, marginLeft: 10, marginTop: 10, marginBottom: 10, backgroundColor: liwiColors.redColor },

  description: { marginTop: 20, textAlign: 'left', flex: 1 },

  link: { color: 'blue' },

  center: { textAlign: 'center', marginTop: 10 },

  documentImage: {
    flex: 1,
    width: Dimensions.get('window').width - 20,
    height: Dimensions.get('window').height / 2,
    resizeMode: 'contain',
  },

  image: { width: screenWidth * 0.8, height: screenWidth },
});
