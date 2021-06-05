/**
 * The external imports
 */
import React from 'react'
import { VirtualizedList } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { Question } from '@/Components'
import { Config } from '@/Config'

const ComplaintCategoryMedicalCaseContainer = props => {
  const patientAgeInDay = useSelector(
    state =>
      (state.medicalCase.item.created_at - state.patient.item.birth_date) /
      Config.MS_IN_DAY,
  )
  const nodes = useSelector(state => state.algorithm.item.nodes)
  const questions = useSelector(state =>
    state.algorithm.item.mobile_config.questions_orders.complaint_categories.filter(
      cc =>
        (nodes[cc].is_neonat && patientAgeInDay < 60) ||
        (!nodes[cc].is_neonat && patientAgeInDay > 60),
    ),
  )

  /**
   * Convert data into readable value
   * @param {list of questions} data
   * @param {*} index
   * @returns
   */
  const getItem = (data, index) => ({
    id: data[index],
  })

  return (
    <VirtualizedList
      data={questions}
      renderItem={({ item }) => <Question questionId={item.id} />}
      keyExtractor={item => item.key}
      getItemCount={() => Object.values(questions).length}
      getItem={getItem}
    />
  )
}

export default ComplaintCategoryMedicalCaseContainer
