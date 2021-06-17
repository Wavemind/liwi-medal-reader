/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'

/**
 * The internal imports
 */
import { Drugs, Managements, QuestionInfoButton } from '@/Components'
import { translate } from '@/Translations/algorithm'
import { useTheme } from '@/Theme'
import orderBy from 'lodash/orderBy'
import isEqual from 'lodash/isEqual'

const Diagnosis = ({ diagnosisKey }) => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Colors,
    Layout,
    Containers: { summary },
  } = useTheme()

  const { t } = useTranslation()
  const isFocused = useIsFocused()

  const algorithm = useSelector(state => state.algorithm.item)
  const diagnoses = useSelector(
    state => state.medicalCase.item.diagnosis[diagnosisKey],
  )

  /**
   * Sorts the diagnoses by level_of_urgency
   * @returns {*}
   */
  const sortDiagnosesByUrgency = () => {
    return orderBy(
      Object.values(diagnoses),
      finalDiagnosis => algorithm.nodes[finalDiagnosis.id].level_of_urgency,
      ['desc', 'asc'],
    )
  }

  const [sortedDiagnoses, setSortedDiagnoses] = useState(
    sortDiagnosesByUrgency(),
  )

  /**
   * Transforms stored diagnoses/drugs into a usable local format
   */
  useEffect(() => {
    const newDiagnoses = sortDiagnosesByUrgency()
    if (!isEqual(newDiagnoses, sortedDiagnoses)) {
      setSortedDiagnoses(newDiagnoses)
    }
  }, [isFocused])

  return sortedDiagnoses.map(diagnosis => {
    const diagnosisNode = algorithm.nodes[diagnosis.id]

    return (
      <View key={`diagnosis-${diagnosis.id}`} style={summary.wrapper}>
        <View style={summary.diagnosisHeaderWrapper}>
          <View style={Layout.row}>
            <Text style={summary.diagnosisHeader}>
              {translate(diagnosisNode.label)}
            </Text>
            {translate(diagnosisNode.description) !== '' && (
              <QuestionInfoButton
                nodeId={diagnosis.id}
                color={Colors.secondary}
              />
            )}
          </View>
          <Text style={summary.diagnosisKey}>
            {t(`containers.medical_case.drugs.${diagnosisKey === 'agreed' ? 'proposed' : 'additional'}`)}
          </Text>
        </View>
        <View style={[Gutters.regularHPadding, Gutters.regularVMargin]}>
          <Drugs diagnosis={diagnosis} />
          <Managements diagnosis={diagnosis} />
        </View>
      </View>
    )
  })
}

export default Diagnosis
