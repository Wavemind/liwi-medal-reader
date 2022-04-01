/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import orderBy from 'lodash/orderBy'
import { useIsFocused } from '@react-navigation/native'

/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import { useTheme } from '@/Theme'
import { QuestionInfoButton } from '@/Components'
import { UpdateDiagnosisService } from '@/Services/MedicalCase'

const ProposedDiagnoses = () => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Containers: { finalDiagnoses },
    Components: { booleanButton },
  } = useTheme()

  const { t } = useTranslation()
  const isFocused = useIsFocused()

  const nodes = useSelector(state => state.algorithm.item.nodes)
  const proposed = useSelector(
    state => state.medicalCase.item.diagnosis.proposed,
  )
  const agreed = useSelector(state => state.medicalCase.item.diagnosis.agreed)
  const refused = useSelector(state => state.medicalCase.item.diagnosis.refused)

  /**
   * Sorts the diagnoses by level_of_urgency
   * @returns {*}
   */
  const sortDiagnosesByUrgency = () =>
    orderBy(proposed, diagnosisId => nodes[diagnosisId].level_of_urgency, [
      'desc',
      'asc',
    ])

  const sortedDiagnoses = useMemo(
    () => sortDiagnosesByUrgency(),
    [isFocused, proposed],
  )

  return sortedDiagnoses.length === 0 ? (
    <Text style={finalDiagnoses.noItemsText}>
      {t('containers.medical_case.diagnoses.no_proposed')}
    </Text>
  ) : (
    sortedDiagnoses.map((diagnosisId, i) => {
      const isAgreed = Object.keys(agreed).includes(diagnosisId.toString())
      const isRefused = refused.includes(diagnosisId)
      const currentNode = nodes[diagnosisId]

      return (
        <View
          key={`proposed-${diagnosisId}`}
          style={finalDiagnoses.newItemWrapper(i === proposed.length - 1)}
        >
          <Text style={finalDiagnoses.diagnosisLabel}>
            {translate(currentNode.label)}
          </Text>
          {(translate(currentNode.description) !== '' ||
            currentNode.medias?.length > 0) && (
            <QuestionInfoButton nodeId={diagnosisId} />
          )}
          <View style={finalDiagnoses.booleanButtonWrapper}>
            <View style={booleanButton.buttonWrapper('left', isAgreed)}>
              <TouchableOpacity
                style={Layout.center}
                onPress={() => UpdateDiagnosisService(diagnosisId, true)}
              >
                <Text style={booleanButton.buttonText(isAgreed)}>
                  {t('containers.medical_case.common.agree')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={booleanButton.buttonWrapper('right', isRefused)}>
              <TouchableOpacity
                style={Layout.center}
                onPress={() => UpdateDiagnosisService(diagnosisId, false)}
              >
                <Text style={booleanButton.buttonText(isRefused)}>
                  {t('containers.medical_case.common.disagree')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    })
  )
}

export default ProposedDiagnoses
