/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import isEqual from 'lodash/isEqual'
import { useIsFocused } from '@react-navigation/native'

/**
 * The internal imports
 */
import {
  Question,
  EmptyList,
  RegistrationHeader,
  PatientString,
  BirthDate,
} from '@/Components'
import { RegistrationQuestionsService } from '@/Services/Steps'

const RegistrationMedicalCaseContainer = () => {
  const { t } = useTranslation()
  const isFocused = useIsFocused()

  const [questions, setQuestions] = useState(RegistrationQuestionsService())
  const mcNodes = useSelector(state => state.medicalCase.item.nodes)

  // Update questions list only if question array change
  useEffect(() => {
    const assessmentQuestions = RegistrationQuestionsService()
    if (!isEqual(assessmentQuestions, questions)) {
      setQuestions(assessmentQuestions)
    }
  }, [isFocused, mcNodes])

  /**
   * Renders the correct question type
   * @param item
   * @returns {JSX.Element}
   */
  const renderQuestion = item => {
    if (typeof item === 'number') {
      return <Question questionId={item} />
    } else {
      switch (item) {
        case 'first_name':
          return <PatientString field="first_name" />
        case 'last_name':
          return <PatientString field="last_name" />
        default:
          return <BirthDate />
      }
    }
  }

  return (
    <FlatList
      data={questions}
      ListHeaderComponent={<RegistrationHeader />}
      renderItem={({ item }) => renderQuestion(item)}
      ListEmptyComponent={
        <EmptyList text={t('containers.medical_case.no_questions')} />
      }
      removeClippedSubviews={false}
      keyExtractor={item => item}
    />
  )
}

export default RegistrationMedicalCaseContainer
