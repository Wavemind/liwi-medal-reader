/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { ScrollView, View } from 'react-native'
import { useDispatch } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'

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
    <ScrollView>
      <View style={Gutters.regularBMargin}>
        <DiagnosisDrugs diagnosisKey="agreed" />
        <DiagnosisDrugs diagnosisKey="additional" />
        <CustomDrugs />
      </View>
    </ScrollView>
  )
}

export default DrugsMedicalCaseContainer
