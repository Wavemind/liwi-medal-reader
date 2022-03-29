/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { View, Text } from 'react-native'
import orderBy from 'lodash/orderBy'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { QuestionInfoButton } from '@/Components'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'

const FinalDiagnoses = () => {
  const { t } = useTranslation()
  const {
    Gutters,
    Containers: { medicines, summary },
  } = useTheme()

  const diagnosis = useSelector(state => state.medicalCase.item.diagnosis)
  const nodes = useSelector(state => state.algorithm.item.nodes)

  const agreedFinalDiagnoses = useMemo(() => {
    const diagnosisKeys = ['agreed', 'additional']
    let agreedDiagnoses = []

    // Get agreed and additional
    diagnosisKeys.forEach(diagnosisKey =>
      Object.keys(diagnosis[diagnosisKey]).map(diagnosisId =>
        agreedDiagnoses.push(nodes[diagnosisId]),
      ),
    )

    // Sort them by level of urgency
    agreedDiagnoses = orderBy(
      agreedDiagnoses,
      finalDiagnosis => nodes[finalDiagnosis.id]?.level_of_urgency,
      ['desc', 'asc'],
    )

    // Add custom diagnoses
    Object.keys(diagnosis.custom).forEach(diagnosisId =>
      agreedDiagnoses.push(diagnosis.custom[diagnosisId]),
    )

    return agreedDiagnoses
  }, [diagnosis])

  return (
    <View style={medicines.wrapper}>
      <View style={medicines.headerWrapper}>
        <Text style={medicines.header}>
          {t('containers.medical_case.summary.final_diagnoses')}
        </Text>
      </View>
      <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
        {agreedFinalDiagnoses.map(finalDiagnosis => (
          <View style={summary.drugTitleWrapper} key={finalDiagnosis.id}>
            <Text style={summary.drugTitle}>
              {'label' in finalDiagnosis
                ? translate(finalDiagnosis.label)
                : finalDiagnosis.name}
            </Text>
            {'label' in finalDiagnosis &&
              (translate(finalDiagnosis.description) !== '' ||
                finalDiagnosis.medias?.length > 0) && (
                <QuestionInfoButton nodeId={finalDiagnosis.id} />
              )}
          </View>
        ))}
      </View>
    </View>
  )
}

export default FinalDiagnoses
