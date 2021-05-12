/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, TouchableOpacity, Text, TextInput } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const SearchBar = props => {
  // Props deconstruction
  const { navigation, label, onPressIn, autoFocus = false } = props

  // Theme and style elements deconstruction
  const { Colors, Gutters, Layout } = useTheme()

  // Local state definition
  const [term, setTerm] = useState('')
  console.log(term)
  return (
    <View style={[Layout.fill]}>
      <TextInput
        style={{
          backgroundColor: Colors.white,
          height: 60,
          ...Gutters.regularTMargin,
          ...Gutters.regularVPadding,
          ...Gutters.regularHPadding,
          width: '100%',
          borderRadius: 20,
        }}
        onChangeText={setTerm}
        onPressIn={onPressIn}
        value={term}
        autoFocus={autoFocus}
        placeholder={'Search'}
      />
    </View>
  )
}

export default SearchBar
