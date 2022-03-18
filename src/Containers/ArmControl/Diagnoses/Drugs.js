/**
 * The external imports
 */
import React from 'react'
import { ScrollView, View, KeyboardAvoidingView } from 'react-native'

/**
 * The internal imports
 */
import { CustomDrugs, AdditionalDrugs } from '@/Components'

const DrugsArmControlContainer = () => {
  return (
    <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={200}>
      <ScrollView>
        <AdditionalDrugs />
        <CustomDrugs />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default DrugsArmControlContainer
