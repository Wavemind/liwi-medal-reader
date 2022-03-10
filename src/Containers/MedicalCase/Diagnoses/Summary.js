/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { ScrollView, View, Text } from 'react-native'
import orderBy from 'lodash/orderBy'

/**
 * The internal imports
 */
import {
  Diagnosis,
  Custom,
  Comment,
  Drug,
  QuestionInfoButton,
} from '@/Components'
import { useSelector } from 'react-redux'
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'
import { TransformFormulationsService } from '@/Services/MedicalCase'

const SummaryMedicalCaseContainer = () => {
  const {
    Gutters,
    Colors,
    Layout,
    Containers: { formulations, summary },
  } = useTheme()

  const diagnosis = useSelector(state => state.medicalCase.item.diagnosis)
  const nodes = useSelector(state => state.algorithm.item.nodes)

  const drugs = useMemo(TransformFormulationsService)

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

  /**
   * Sorts the drugs by level_of_urgency
   * SINAN WILL DO IN ANOTHER SERVICE CHANGE IT !
   * @returns {*}
   */
  const sortDrugsByUrgency = () =>
    orderBy(Object.values(drugs), drug => nodes[drug.id].level_of_urgency, [
      'desc',
      'asc',
    ])

  return (
    <ScrollView>
      <View style={formulations.wrapper}>
        <View style={formulations.formulationsHeaderWrapper}>
          <Text style={formulations.formulationsHeader}>Final diagnoses</Text>
        </View>
        <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
          {getAgreedFinalDiagnosis.map(finalDiagnose => (
            <View style={summary.drugTitleWrapper}>
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

      <View style={formulations.wrapper}>
        <View style={formulations.formulationsHeaderWrapper}>
          <Text style={formulations.formulationsHeader}>Treatments</Text>
        </View>
        <View style={[Gutters.regularHMargin, Gutters.regularVMargin]}>
          {sortDrugsByUrgency().map((drug, i) => (
            <Drug
              key={`summary_diagnosis_drugs-${drug.id}`}
              drug={drug}
              isLast={i === Object.values(drugs).length - 1}
            />
          ))}
        </View>
      </View>

      <View style={formulations.wrapper}>
        <View style={formulations.formulationsHeaderWrapper}>
          <Text style={formulations.formulationsHeader}>Managements</Text>
        </View>
        <View style={[Gutters.regularHMargin, Gutters.regularVMargin]} />
      </View>
      <Comment />
    </ScrollView>
  )
}

export default SummaryMedicalCaseContainer
