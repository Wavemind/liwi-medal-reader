/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const BooleanButtons = props => {
  // Props deconstruction
  const { answers, label, warning, disabled } = props

  // Theme and style elements deconstruction
  const {
    Components: { booleanButton },
    Layout,
  } = useTheme()

  // Local state definition
  const [answer, setAnswer] = useState('')

  return (
    <View style={booleanButton.wrapper(warning)}>
      <Text style={booleanButton.label(warning)}>{label}</Text>
      <View style={booleanButton.buttonsWrapper}>
        {answers.map(ans => {
          const side = answers.indexOf(ans) === 0 ? 'left' : 'right'
          const active = answer === ans

          return (
            <View
              key={`booleanButton-${side}`}
              style={booleanButton.buttonWrapper(side, active, disabled)}
            >
              <TouchableOpacity
                style={[Layout.center]}
                onPress={() => setAnswer(ans)}
                disabled={disabled}
              >
                <Text style={booleanButton.buttonText(active)}>{ans}</Text>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export default BooleanButtons
