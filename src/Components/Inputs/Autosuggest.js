/**
 * The external imports
 */
import React, { createRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View, TouchableOpacity, TextInput } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const Autosuggest = ({ searchTerm, setSearchTerm, handleReset, autofocus }) => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Colors,
    FontSize,
    Components: { autosuggest },
  } = useTheme()

  const { t } = useTranslation()
  const inputRef = createRef()

  // setTimeout waits for the component to load and then focuses the input
  // Simulates a ComponentDidMount
  useEffect(() => {
    if (autofocus) {
      setTimeout(() => inputRef.current.focus(), 250)
    }
  }, [])

  return (
    <View style={Layout.row}>
      <View style={autosuggest.inputWrapper}>
        <View style={Layout.colCenter}>
          <Icon name="search" size={FontSize.large} />
        </View>
        <View style={autosuggest.inputTextWrapper}>
          <TextInput
            ref={inputRef}
            style={autosuggest.inputText}
            keyboardType="default"
            onChangeText={setSearchTerm}
            value={searchTerm}
            placeholder={t('application.search')}
          />
        </View>
        {searchTerm.length > 0 ? (
          <TouchableOpacity
            onPress={() => handleReset()}
            style={autosuggest.clearButton}
          >
            <Icon name="close" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  )
}

export default Autosuggest
