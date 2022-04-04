/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { ScrollView, KeyboardAvoidingView } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { CustomDrugs, AdditionalDrugs } from '@/Components'
import { reworkAndOrderDrugs } from '@/Utils/Drug'

const MedicinesArmControlContainer = () => {
  const diagnoses = useSelector(state => state.medicalCase.item.diagnosis)
  const drugs = useMemo(reworkAndOrderDrugs, [diagnoses])

  return (
    <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={200}>
      <ScrollView>
        <AdditionalDrugs additionalDrugs={drugs.additional} />
        <CustomDrugs customDrugs={drugs.custom} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default MedicinesArmControlContainer
