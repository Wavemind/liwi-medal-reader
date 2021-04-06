/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import { StyleSheet } from 'react-native'
/**
 *
 * @param Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function ({ Colors, ...args }) {
  return StyleSheet.create({
    backgroundPrimary: {
      backgroundColor: Colors.primary,
    },
    backgroundWhite: {
      backgroundColor: Colors.white,
    },
    backgroundBlack: {
      backgroundColor: Colors.black,
    },
    backgroundReset: {
      backgroundColor: Colors.transparent,
    },
    textInput: {
      borderWidth: 1,
      borderColor: Colors.text,
      backgroundColor: Colors.inputBackground,
      color: Colors.text,
      minHeight: 50,
      textAlign: 'center',
      marginTop: 10,
      marginBottom: 10,
    },
  })
}
