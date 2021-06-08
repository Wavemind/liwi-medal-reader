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
import ChangeAgreedDiagnoses from '@/Store/MedicalCase/ChangeAgreedDiagnoses'
import ChangeRefusedDiagnoses from '@/Store/MedicalCase/ChangeRefusedDiagnoses'

const ProposedDiagnoses = () => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Fonts,
    Containers: { medicalCaseFinalDiagnoses },
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

  // TODO remove this once we have some proposed and changed all tempProposed to proposed
  const tempProposed = [...proposed]
  tempProposed.push(60)
  tempProposed.push(76)

  /**
   * Updates the proposed diagnoses by sorting them into agreed or refused
   * @param proposedDiagnosisId
   * @param value
   */
  const updateDiagnosis = (proposedDiagnosisId, value) => {
    const tempAgreedDiagnoses = { ...agreed }
    const tempRefusedDiagnoses = [...refused]
    const isInAgreed = Object.keys(agreed).includes(
      proposedDiagnosisId.toString(),
    )
    const isInRefused = refused.includes(proposedDiagnosisId)

    // From null to Agree
    if (value && !isInAgreed) {
      tempAgreedDiagnoses[proposedDiagnosisId] = {
        id: proposedDiagnosisId,
        drugs: {
          proposed: Object.values(
            algorithm.nodes[proposedDiagnosisId].drugs,
          ).map(drug => drug.id),
          agreed: {},
          refused: [],
          additional: {},
        },
      }
      dispatch(
        ChangeAgreedDiagnoses.action({
          newAgreedDiagnoses: tempAgreedDiagnoses,
        }),
      )

      // From Disagree to Agree
      if (isInRefused) {
        tempRefusedDiagnoses.splice(
          tempRefusedDiagnoses.indexOf(proposedDiagnosisId),
          1,
        )
        dispatch(
          ChangeRefusedDiagnoses.action({
            newRefusedDiagnoses: tempRefusedDiagnoses,
          }),
        )
      }
    }

    // From null to Disagree
    if (!value && !isInRefused) {
      tempRefusedDiagnoses.push(proposedDiagnosisId)
      dispatch(
        ChangeRefusedDiagnoses.action({
          newRefusedDiagnoses: tempRefusedDiagnoses,
        }),
      )

      // From Agree to Disagree
      if (isInAgreed) {
        delete tempAgreedDiagnoses[proposedDiagnosisId.toString()]
        dispatch(
          ChangeAgreedDiagnoses.action({
            newAgreedDiagnoses: tempAgreedDiagnoses,
          }),
        )
      }
    }
  }

  /**
   * Renders the boolean buttons to agree/disagree with the proposed diagnoses
   * @param diagnosisId
   * @returns {JSX.Element}
   */
  const renderBooleanButton = diagnosisId => {
    const isAgreed = Object.keys(agreed).includes(diagnosisId.toString())
    const isRefused = refused.includes(diagnosisId)

    return (
      <View style={medicalCaseFinalDiagnoses.booleanButtonWrapper}>
        <View
          key="booleanButton-left"
          style={booleanButton.buttonWrapper('left', isAgreed)}
        >
          <TouchableOpacity
            style={Layout.center}
            onPress={() => updateDiagnosis(diagnosisId, true)}
          >
            <Text style={booleanButton.buttonText(isAgreed)}>
              {t('containers.medical_case.common.agree')}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          key="booleanButton-right"
          style={booleanButton.buttonWrapper('right', isRefused)}
        >
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
    )
  }

  return tempProposed.map((proposedDiagnosisId, i) => (
    <View
      key={`proposed-${proposedDiagnosisId}`}
      style={medicalCaseFinalDiagnoses.newItemWrapper(
        i === tempProposed.length - 1,
      )}
    >
      <Text style={Fonts.textSmall}>
        {translate(algorithm.nodes[proposedDiagnosisId].label)}
      </Text>
      {renderBooleanButton(proposedDiagnosisId)}
    </View>
  ))
}

export default ProposedDiagnoses
