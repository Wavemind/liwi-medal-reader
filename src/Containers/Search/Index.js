/**
 * The external imports
 */
import React, { useState, useEffect, useRef } from 'react'
import { ScrollView, View, TextInput } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const IndexSearchContainer = () => {
  // Theme and style elements deconstruction
  const { Colors, Gutters, Layout } = useTheme()

  // Local state definition
  const [term, setTerm] = useState('')

  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  }, [])

  return (
    <ScrollView>
      <View style={[Layout.fill]}>
        <TextInput
          ref={inputRef}
          style={{
            backgroundColor: Colors.white,
            height: 60,
            ...Gutters.regularVPadding,
            ...Gutters.regularHPadding,
            width: '100%',
          }}
          onChangeText={setTerm}
          value={term}
          placeholder={'Search'}
        />
      </View>
    </ScrollView>
  )
}

export default IndexSearchContainer
