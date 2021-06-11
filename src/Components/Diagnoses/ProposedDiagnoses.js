/**
 * The external imports
 */
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { translate } from '@/Translations/algorithm'
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import { navigate } from '@/Navigators/Root'
import ChangeRefusedDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveRefusedDiagnoses'
import AddAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddAgreedDiagnoses'
import RemoveAgreedDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveAgreedDiagnoses'
import AddRefusedDiagnoses from '@/Store/MedicalCase/Diagnoses/AddRefusedDiagnoses'
import RemoveRefusedDiagnoses from "@/Store/MedicalCase/Diagnoses/RemoveRefusedDiagnoses";

const ProposedDiagnoses = () => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Containers: { finalDiagnoses },
    Components: { booleanButton },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const algorithm = useSelector(state => state.algorithm.item)
  const proposed = useSelector(
    state => state.medicalCase.item.diagnosis.proposed,
  )
  const agreed = useSelector(state => state.medicalCase.item.diagnosis.agreed)
  const refused = useSelector(state => state.medicalCase.item.diagnosis.refused)

  /**
   * Updates the proposed diagnoses by sorting them into agreed or refused
   * @param diagnosisId
   * @param value
   */
  const updateDiagnosis = (diagnosisId, value) => {
    const refusedDiagnoses = [...refused]
    const isInAgreed = Object.keys(agreed).includes(diagnosisId.toString())
    const isInRefused = refused.includes(diagnosisId)

    // From null to Agree
    if (value && !isInAgreed) {
      const currentNode = algorithm.nodes[diagnosisId]
      dispatch(
        AddAgreedDiagnoses.action({
          diagnosisId,
          diagnosisContent: {
            id: diagnosisId,
            managements: Object.values(currentNode.managements).map(
              management => management.id,
            ),
            drugs: {
              proposed: Object.values(currentNode.drugs).map(drug => drug.id),
              agreed: {},
              refused: [],
              additional: {},
            },
          },
        }),
      )

      // From Disagree to Agree
      if (isInRefused) {
        dispatch(
          RemoveRefusedDiagnoses.action({
            diagnosisId,
          }),
        )
      }
    }

    // From null to Disagree
    if (!value && !isInRefused) {
      dispatch(
        AddRefusedDiagnoses.action({
          diagnosisId,
        }),
      )

      // From Agree to Disagree
      if (isInAgreed) {
        dispatch(
          RemoveAgreedDiagnoses.action({
            diagnosisId,
          }),
        )
      }
    }
  }

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
            <TouchableOpacity
              onPress={() =>
                navigate('QuestionInfo', {
                  nodeId: diagnosisId,
                })
              }
            >
              <Icon name="simple-info" />
            </TouchableOpacity>
          )}
          <View style={finalDiagnoses.booleanButtonWrapper}>
            <View style={booleanButton.buttonWrapper('left', isAgreed)}>
              <TouchableOpacity
                style={Layout.center}
                onPress={() => updateDiagnosis(diagnosisId, true)}
              >
                <Text style={booleanButton.buttonText(isAgreed)}>
                  {t('containers.medical_case.common.agree')}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={booleanButton.buttonWrapper('right', isRefused)}>
              <TouchableOpacity
                style={Layout.center}
                onPress={() => updateDiagnosis(diagnosisId, false)}
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
