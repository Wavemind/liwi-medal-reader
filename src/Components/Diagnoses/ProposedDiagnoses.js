/**
 * The external imports
 */
import React, { useState } from 'react'
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
    Containers: { medicalCaseDiagnoses },
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

  const [formattedProposed, setFormattedProposed] = useState(
    tempProposed.map(item => {
      let value = null
      if (Object.keys(agreed).includes(item.toString())) {
        value = true
      } else if (refused.includes(item)) {
        value = false
      }
      return { id: item, value }
    }),
  )

  console.log(formattedProposed)

  /**
   * Updates the proposed diagnoses by sorting them into agreed or refused
   * @param proposedDiagnosisId
   * @param value
   */
  const updateProposedDiagnosis = (proposedDiagnosisId, value) => {
    setFormattedProposed(
      formattedProposed.map(diagnosis =>
        diagnosis.id === proposedDiagnosisId
          ? { ...diagnosis, value: value }
          : diagnosis,
      ),
    )
    const tempAgreedDiagnoses = { ...agreed }
    const tempRefusedDiagnoses = [...refused]
    const isInAgreed = Object.keys(tempAgreedDiagnoses).includes(
      proposedDiagnosisId.toString(),
    )
    const isInRefused = tempRefusedDiagnoses.includes(proposedDiagnosisId)

    // From null to Agree
    if (val && !isInAgreed) {
      tempAgreedDiagnoses[proposedDiagnosisId] = {
        id: proposedDiagnosisId.toString(),
        drugs: {},
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
    if (!val && !isInRefused) {
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
   * @param diagnosis
   * @returns {JSX.Element}
   */
  const renderBooleanButton = diagnosis => {
    const buttons = [
      {
        side: 'left',
        value: true,
        text: t('containers.medical_case.diagnoses.agree'),
      },
      {
        side: 'right',
        value: false,
        text: t('containers.medical_case.diagnoses.disagree'),
      },
    ]

    return (
      <View style={medicalCaseDiagnoses.booleanButtonWrapper}>
        {buttons.map(button => {
          const selected = diagnosis.value === button.value
          return (
            <View
              key={`booleanButton-${button.side}`}
              style={booleanButton.buttonWrapper(button.side, selected)}
            >
              <TouchableOpacity
                style={Layout.center}
                onPress={() =>
                  updateProposedDiagnosis(diagnosis.id, button.value)
                }
              >
                <Text style={booleanButton.buttonText(selected)}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            </View>
          )
        })}
      </View>
    )
  }

  return formattedProposed.map((proposedDiagnosis, i) => (
    <View
      key={`proposed-${proposedDiagnosis.id}`}
      style={medicalCaseDiagnoses.newItemWrapper(i === tempProposed.length - 1)}
    >
      <Text style={Fonts.textSmall}>{translate(algorithm.nodes[proposedDiagnosis.id].label)}</Text>
      {renderBooleanButton(proposedDiagnosis)}
    </View>
  ))
}

export default ProposedDiagnoses
