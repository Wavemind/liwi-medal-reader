/**
 * The external imports
 */
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
} from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Layout,
    Colors,
    FontSize,
    Components: { autosuggest },
  } = useTheme()

  const handleChange = val => {
    setSearchTerm(val)
  }

  return (
    <View style={Layout.row}>
      <View style={autosuggest.inputWrapper}>
        <View style={Layout.colCenter}>
          <Icon name="search" color={Colors.grey} size={FontSize.regular} />
        </View>
        <View style={autosuggest.inputTextWrapper}>
          <TextInput
            style={autosuggest.inputText}
            keyboardType="default"
            onChangeText={value => handleChange(value)}
            value={searchTerm}
            placeholder='Search'
            disabled={false}
          />
        </View>
        {searchTerm.length > 0 ? (
          <TouchableOpacity onPress={() => setSearchTerm('')} style={autosuggest.clearButton}>
            <Icon name="close" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  )
}

export default SearchBar
