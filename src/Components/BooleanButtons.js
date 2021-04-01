import React, { useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useTheme } from '@/Theme'

const BooleanButtons = props => {
  const { width, answers } = props
  const { Layout, Gutters, Common, Fonts } = useTheme()

  const [answer, setAnswer] = useState('')

  const defineBackgroundColor = ans => {
    return answer === ans ? Common.backgroundPrimary : Common.backgroundWhite
  }

  const defineTextColor = ans => {
    return answer === ans ? Fonts.textColorWhite : Fonts.textColorBlack
  }

  const buttons = [
    {
      viewStyle: { borderBottomLeftRadius: 20, borderTopLeftRadius: 20, borderRightWidth: 1 },
      text: answers[0],
    },
    {
      viewStyle: { borderBottomRightRadius: 20, borderTopRightRadius: 20 },
      text: answers[1],
    },
  ]

  return (
    <View style={[{ width }, Layout.justifyContentAround, Layout.row]}>
      {buttons.map(button => {
        return (
          <View key={`booleanButton-${button.text}`} style={[button.viewStyle, defineBackgroundColor(button.text), Layout.fill]}>
            <TouchableOpacity style={[Layout.center]} onPress={() => setAnswer(button.text)}>
              <Text style={[Gutters.smallVPadding, defineTextColor(button.text)]}>{button.text}</Text>
            </TouchableOpacity>
          </View>
        )
      })}
    </View>
  )
}

export default BooleanButtons
