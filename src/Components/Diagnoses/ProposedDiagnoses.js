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
   * @param diagnosisId
   * @param value
   */
  const updateDiagnosis = (diagnosisId, value) => {
    const agreedDiagnoses = { ...agreed }
    const refusedDiagnoses = [...refused]
    const isInAgreed = Object.keys(agreed).includes(diagnosisId.toString())
    const isInRefused = refused.includes(diagnosisId)

    // From null to Agree
    if (value && !isInAgreed) {
      agreedDiagnoses[diagnosisId] = {
        id: diagnosisId,
        drugs: {
          proposed: Object.values(algorithm.nodes[diagnosisId].drugs).map(
            drug => drug.id,
          ),
          agreed: {},
          refused: [],
          additional: {},
        },
      }
      dispatch(
        ChangeAgreedDiagnoses.action({
          newAgreedDiagnoses: agreedDiagnoses,
        }),
      )

      // From Disagree to Agree
      if (isInRefused) {
        refusedDiagnoses.splice(refusedDiagnoses.indexOf(diagnosisId), 1)
        dispatch(
          ChangeRefusedDiagnoses.action({
            newRefusedDiagnoses: refusedDiagnoses,
          }),
        )
      }
    }

    // From null to Disagree
    if (!value && !isInRefused) {
      refusedDiagnoses.push(diagnosisId)
      dispatch(
        ChangeRefusedDiagnoses.action({
          newRefusedDiagnoses: refusedDiagnoses,
        }),
      )

      // From Agree to Disagree
      if (isInAgreed) {
        delete agreedDiagnoses[diagnosisId.toString()]
        dispatch(
          ChangeAgreedDiagnoses.action({
            newAgreedDiagnoses: agreedDiagnoses,
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
