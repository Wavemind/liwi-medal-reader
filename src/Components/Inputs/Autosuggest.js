/**
 * The external imports
 */
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View, TouchableOpacity, TextInput } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const Autosuggest = ({ searchTerm, setSearchTerm, handleReset }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Layout,
    Colors,
    FontSize,
    Components: { autosuggest },
  } = useTheme()

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
            onChangeText={value => setSearchTerm(value)}
            value={searchTerm}
            placeholder={t('application.search')}
            disabled={false}
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
