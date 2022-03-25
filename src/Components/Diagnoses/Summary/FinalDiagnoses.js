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

  const getAgreedFinalDiagnosis = useMemo(() => {
    const diagnoseKeys = ['agreed', 'additional']
    let agreedDiagnosis = []

    // Get agreed and additional
    diagnoseKeys.forEach(diagnoseKey =>
      Object.keys(diagnosis[diagnoseKey]).map(diagnoseId =>
        agreedDiagnosis.push(nodes[diagnoseId]),
      ),
    )

    // Sort them by level of urgency
    agreedDiagnosis = orderBy(
      agreedDiagnosis,
      finalDiagnosis => nodes[finalDiagnosis.id]?.level_of_urgency,
      ['desc', 'asc'],
    )

    // Add custom diagnoses
    Object.keys(diagnosis.custom).map(diagnoseId =>
      agreedDiagnosis.push(diagnosis.custom[diagnoseId]),
    )

    return agreedDiagnosis
  }, [diagnosis])

  return (
    <View style={medicines.wrapper}>
      <View style={medicines.headerWrapper}>
        <Text style={medicines.header}>
          {t('containers.medical_case.summary.final_diagnoses')}
        </Text>
      </View>
      <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
        {getAgreedFinalDiagnosis.map(finalDiagnose => (
          <View style={summary.drugTitleWrapper} key={finalDiagnose.id}>
            <Text style={summary.drugTitle}>
              {'label' in finalDiagnose
                ? translate(finalDiagnose.label)
                : finalDiagnose.name}
            </Text>
            {'label' in finalDiagnose &&
              (translate(finalDiagnose.description) !== '' ||
                finalDiagnose.medias?.length > 0) && (
                <QuestionInfoButton nodeId={finalDiagnose.id} />
              )}
          </View>
        ))}
      </View>
    </View>
  )
}

export default FinalDiagnoses
