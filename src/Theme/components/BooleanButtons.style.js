import {StyleSheet, Text} from 'react-native'
import React from "react";

export default function (props) {
  const { Colors, Gutters, Layout, Fonts } = props

  return StyleSheet.create({
    buttonWrapper: (side, active, disabled = false) => ({
      ...Layout.fill,
      backgroundColor: active ? Colors.primary : Colors.secondary,
      opacity: disabled ? 0.5 : 1,
      borderBottomLeftRadius: side === 'left' ? 20 : 0,
      borderTopLeftRadius: side === 'left' ? 20 : 0,
      borderBottomRightRadius: side === 'right' ? 20 : 0,
      borderTopRightRadius: side === 'right' ? 20 : 0,
      borderRightWidth: side === 'left' ? 1 : 0,
      borderRightColor: side === 'left' ? Colors.grey : Colors.transparent,
    }),
    buttonText: active => ({
      ...Gutters.smallVPadding,
      ...Fonts.textSmall,
      color: active ? Colors.secondary : Colors.primary,
    }),
  })
}
