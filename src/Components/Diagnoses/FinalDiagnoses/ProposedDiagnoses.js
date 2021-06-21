/**
 * The external imports
 */
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import { useTheme } from '@/Theme'
import { QuestionInfoButton } from '@/Components'
import { UpdateDiagnosis } from '@/Services/MedicalCase'

const ProposedDiagnoses = () => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Containers: { finalDiagnoses },
    Components: { booleanButton },
  } = useTheme()

  const { t } = useTranslation()

  const algorithm = useSelector(state => state.algorithm.item)
  const proposed = useSelector(
    state => state.medicalCase.item.diagnosis.proposed,
  )
  const agreed = useSelector(state => state.medicalCase.item.diagnosis.agreed)
  const refused = useSelector(state => state.medicalCase.item.diagnosis.refused)

  return Object.keys(proposed).length === 0 ? (
    <View>
      <Text style={finalDiagnoses.noItemsText}>
        {t('containers.medical_case.diagnoses.no_proposed')}
      </Text>
    </View>
  ) : (
    proposed.map((diagnosisId, i) => {
      const isAgreed = Object.keys(agreed).includes(diagnosisId.toString())
      const isRefused = refused.includes(diagnosisId)

      return (
        <View
          key={`proposed-${diagnosisId}`}
          style={finalDiagnoses.newItemWrapper(i === proposed.length - 1)}
        >
          <Text style={finalDiagnoses.diagnosisLabel}>
            {translate(algorithm.nodes[diagnosisId].label)}
          </Text>
          {translate(algorithm.nodes[diagnosisId].description) !== '' && (
            <QuestionInfoButton nodeId={diagnosisId} />
          )}
          <View style={finalDiagnoses.booleanButtonWrapper}>
            <View style={booleanButton.buttonWrapper('left', isAgreed)}>
              <TouchableOpacity
                style={Layout.center}
                onPress={() => UpdateDiagnosis(diagnosisId, true)}
              >
                <Text style={booleanButton.buttonText(isAgreed)}>
                  {t('containers.medical_case.common.agree')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={booleanButton.buttonWrapper('right', isRefused)}>
              <TouchableOpacity
                style={Layout.center}
                onPress={() => UpdateDiagnosis(diagnosisId, false)}
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
