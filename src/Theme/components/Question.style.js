import { StyleSheet } from 'react-native'
import { wp } from '@/Theme/Responsive'

export default function (props) {
  const { Colors, Gutters, Layout, Fonts } = props

  return StyleSheet.create({
    wrapper: emergency => {
      let customStyle = {
        backgroundColor: Colors.transparent,
      }

      if (emergency) {
        customStyle = {
          backgroundColor: Colors.softRed,
        }
      }

      return {
        ...Gutters.regularHPadding,
        ...customStyle,
      }
    },
    container: {
      borderBottomWidth: 1,
      borderBottomColor: Colors.grey,
      ...Gutters.regularVPadding,
    },
    questionWrapper: isFullLength => ({
      ...Layout.justifyContentBetween,
      ...Layout.fullWidth,
      alignItems: isFullLength ? 'flex-start' : 'center',
      flexDirection: isFullLength ? 'column' : 'row',
    }),
    emergencyText: {
      color: Colors.red,
      ...Fonts.textSemiBold,
      ...Layout.fill,
      ...Fonts.textMedium,
    },
    text: status => {
      let customStyle = {
        color: Colors.text,
      }

      if (status === 'error') {
        customStyle = {
          color: Colors.red,
          ...Fonts.textBold,
        }
      }

      return {
        ...Layout.fill,
        ...Fonts.textMedium,
        ...customStyle,
      }
    },
    inputWrapper: {
      ...Layout.justifyContentAround,
      ...Gutters.regularLMargin,
      width: wp(33.3),
    },
    fullLengthInputWrapper: {
      ...Layout.justifyContentAround,
      ...Layout.row,
      ...Layout.grow,
    },
    messageWrapper: errorType => ({
      backgroundColor: errorType === 'warning' ? Colors.warning : Colors.red,
      borderRadius: 10,
      ...Layout.row,
      ...Layout.alignItemsCenter,
      ...Gutters.regularTMargin,
      ...Gutters.smallVPadding,
    }),
    message: {
      ...Layout.fill,
      ...Fonts.textTiny,
      ...Fonts.textSemiBold,
      color: Colors.white,
    },
  })
}
