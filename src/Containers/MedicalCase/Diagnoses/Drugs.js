/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { ScrollView, KeyboardAvoidingView } from 'react-native'
import { useDispatch } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'

/**
 * The internal imports
 */
import { ProposedDrugs, AdditionalDrugs, CustomDrugs } from '@/Components'
import SetDrugs from '@/Store/MedicalCase/Drugs/SetDrugs'

const DrugsMedicalCaseContainer = () => {
  const dispatch = useDispatch()
  const isFocused = useIsFocused()

  useEffect(() => {
    dispatch(SetDrugs.action())
  }, [isFocused])

  return (
    <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={200}>
      <ScrollView>
        <ProposedDrugs />
        <AdditionalDrugs />
        <CustomDrugs />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default DrugsMedicalCaseContainer
