/**
 * The external imports
 */
import React, { useEffect } from 'react'
import { ScrollView } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'

/**
 * The internal imports
 */
import { System, Comment } from '@/Components'
import PhysicalExam from '@/Store/QuestionsPerSystem/PhysicalExam'

const PhysicalExamMedicalCaseContainer = props => {
  const isFocused = useIsFocused()
  const dispatch = useDispatch()

  const physicalExamStep = useSelector(
    state => state.algorithm.item.config.full_order.physical_exam_step,
  )

  // Update questions list only if question array change
  useEffect(() => {
    if (isFocused) {
      dispatch(PhysicalExam.action())
    }
  }, [isFocused])
  return (
    <ScrollView>
      {physicalExamStep.map(system => (
        <System systemName={system.title} />
      ))}
      <Comment />
    </ScrollView>
  )
}

export default PhysicalExamMedicalCaseContainer
