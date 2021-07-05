/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'

/**
 * The internal imports
 */
import { System, Comment, Loader } from '@/Components'
import PhysicalExam from '@/Store/QuestionsPerSystem/PhysicalExam'

const PhysicalExamMedicalCaseContainer = () => {
  const isFocused = useIsFocused()
  const dispatch = useDispatch()

  const physicalExamStep = useSelector(
    state => state.algorithm.item.config.full_order.physical_exam_step,
  )

  const [loading, setLoading] = useState(true)

  // Update questions list only if question array change
  useEffect(() => {
    if (isFocused) {
      dispatch(PhysicalExam.action())
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
      {physicalExamStep.map(system => (
        <System
          key={`physical-exam-${system.title}`}
          systemName={system.title}
          step="physicalExam"
        />
      ))}
      <Comment />
    </ScrollView>
  )
}

export default PhysicalExamMedicalCaseContainer
