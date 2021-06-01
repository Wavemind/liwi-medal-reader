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
    questionWrapper: {
      ...Layout.row,
      ...Layout.justifyContentBetween,
      ...Layout.fullWidth,
      ...Layout.alignItemsCenter,
    },
    text: status => {
      let customStyle = {
        color: Colors.text,
      }

      if (status === 'emergency') {
        customStyle = {
          color: Colors.red,
          ...Fonts.textSemiBold,
        }
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
      ...Layout.row,
      ...Gutters.regularLMargin,
      width: wp(33.3),
    },
    messageWrapper: errorType => ({
      backgroundColor: errorType === 'warning' ? Colors.warning : Colors.error,
      borderRadius: 10,
      ...Layout.row,
      ...Layout.alignItemsCenter,
      ...Gutters.regularTMargin,
      ...Gutters.smallVPadding,
    }),
    message: {
      ...Fonts.textTiny,
      ...Fonts.textSemiBold,
      color: Colors.secondary,
    },
  })
}
