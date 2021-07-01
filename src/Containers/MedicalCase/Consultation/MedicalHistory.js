/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { ScrollView, View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { System, Loader } from '@/Components'
import MedicalHistory from '@/Store/QuestionsPerSystem/MedicalHistory'

const MedicalHistoryMedicalCaseContainer = props => {
  const isFocused = useIsFocused()
  const dispatch = useDispatch()
  const {
    Layout,
    Fonts,
    Colors,
    Gutters,
    Components: { customClinician },
  } = useTheme()

  const medicalHistoryStep = useSelector(
    state => state.algorithm.item.config.full_order.medical_history_step,
  )
  const loading = useSelector(
    state => state.questionsPerSystem.medicalHistory.loading,
  )

  // Update questions list only if question array change
  useEffect(() => {
    if (isFocused) {
      dispatch(MedicalHistory.action())
    }
  }, [isFocused])

  if (loading) {
    return <Loader />
  }

  return (
    <ScrollView>
      {medicalHistoryStep.map(system => (
        <System
          key={`medical-history-${system.title}`}
          systemName={system.title}
        />
      ))}
    </ScrollView>
  )
}

export default MedicalHistoryMedicalCaseContainer
