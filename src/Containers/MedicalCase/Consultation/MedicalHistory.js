/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'
import * as Sentry from '@sentry/react-native'

/**
 * The internal imports
 */
import { System, Loader } from '@/Components'
import MedicalHistory from '@/Store/QuestionsPerSystem/MedicalHistory'

function MedicalHistoryMedicalCaseContainer() {
  const isFocused = useIsFocused()
  const dispatch = useDispatch()

  const medicalHistoryStep = useSelector(
    state => state.algorithm.item.config.full_order.medical_history_step,
  )

  const [loading, setLoading] = useState(true)

  // Update questions list only if question array change
  useEffect(() => {
    if (isFocused) {
      dispatch(MedicalHistory.action())
      if (loading) {
        setLoading(false)
      }
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
          step="medicalHistory"
        />
      ))}
    </ScrollView>
  )
}

export default Sentry.withProfiler(MedicalHistoryMedicalCaseContainer)
