/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const Picture = props => {
  // Props deconstruction
  const { navigation, label } = props

  // Theme and style elements deconstruction
  const {
    Components: { template },
    Layout,
  } = useTheme()

  // Local state definition
  const [exampleState, setExampleState] = useState('')

  // Constants definition
  const exampleConstant = 2

  return (
    <View style={template.wrapper}>
      <Text style={template.label}>{label}</Text>
      <View style={template.buttonsWrapper}>
        <View>
          <TouchableOpacity
            style={[Layout.center]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text>This is a template</Text>
            <Text>{exampleConstant}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default Picture
