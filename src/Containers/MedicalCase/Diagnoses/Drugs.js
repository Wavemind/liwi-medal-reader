/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

/**
 * The internal imports
 */
import { DiagnosisDrugs, CustomDrugs } from '@/Components'
import SetDrugs from '@/Store/MedicalCase/Drugs/SetDrugs'
import { useTheme } from '@/Theme'

const DrugsMedicalCaseContainer = () => {
  const { Gutters } = useTheme()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()

  useEffect(() => {
    dispatch(SetDrugs.action())
  }, [isFocused])

  return (
    <KeyboardAwareScrollView enableOnAndroid={true} extraHeight={200}>
      <View style={Gutters.regularBMargin}>
        <DiagnosisDrugs diagnosisKey="agreed" />
        <DiagnosisDrugs diagnosisKey="additional" />
        <CustomDrugs />
      </View>
    </KeyboardAwareScrollView>
  )
}

export default DrugsMedicalCaseContainer
