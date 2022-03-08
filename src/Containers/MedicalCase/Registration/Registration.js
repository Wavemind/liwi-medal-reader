/**
 * The external imports
 */
import React, { useMemo, useCallback } from 'react'
import { FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import {
  Question,
  EmptyList,
  RegistrationHeader,
  PatientString,
  PatientBirthDate,
} from '@/Components'
import { RegistrationQuestionsService } from '@/Services/Steps'

const RegistrationMedicalCaseContainer = () => {
  const { t } = useTranslation()

  const mcNodes = useSelector(state => state.medicalCase.item.nodes)
  const questions = useMemo(() => RegistrationQuestionsService(), [mcNodes])

  /**
   * Renders the correct question type
   * @param item
   * @returns {JSX.Element}
   */
  const renderQuestion = useCallback(item => {
    if (typeof item === 'number') {
      return <Question questionId={item} />
    } else {
      switch (item) {
        case 'first_name':
          return <PatientString field="first_name" />
        case 'last_name':
          return <PatientString field="last_name" />
        default:
          return <PatientBirthDate />
      }
    }
  }, [])

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
