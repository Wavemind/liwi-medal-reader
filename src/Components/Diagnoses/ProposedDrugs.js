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
import AddAgreedDrugs from '@/Store/MedicalCase/Drugs/AddAgreedDrugs'
import AddRefusedDrugs from '@/Store/MedicalCase/Drugs/AddRefusedDrugs'
import RemoveAgreedDrugs from '@/Store/MedicalCase/Drugs/RemoveAgreedDrugs'
import RemoveRefusedDrugs from '@/Store/MedicalCase/Drugs/RemoveRefusedDrugs'

const ProposedDrugs = () => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Fonts,
    Colors,
    Gutters,
    Containers: { medicalCaseDrugs },
    Components: { booleanButton },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const algorithm = useSelector(state => state.algorithm.item)
  const agreedDiagnoses = useSelector(
    state => state.medicalCase.item.diagnosis.agreed,
  )

  /**
   * Updates the proposed diagnoses by sorting them into agreed or refused
   * @param proposedDiagnosisId
   * @param drugId
   * @param value
   */
  const updateProposedDrugs = (proposedDiagnosisId, drugId, value) => {
    const tempAgreedDrugs = {
      ...agreedDiagnoses[proposedDiagnosisId].drugs.agreed,
    }
    const tempRefusedDrugs = [
      ...agreedDiagnoses[proposedDiagnosisId].drugs.refused,
    ]
    const isInAgreed = Object.keys(tempAgreedDrugs).includes(drugId.toString())
    const isInRefused = tempRefusedDrugs.includes(drugId)

    // From null to Agree
    if (value && !isInAgreed) {
      tempAgreedDrugs[proposedDiagnosisId] = {
        id: proposedDiagnosisId.toString(),
        drugs: {},
      }
      dispatch(
        AddAgreedDrugs.action({
          diagnosisId: proposedDiagnosisId,
          drugId: drugId,
          drugContent: { id: drugId },
        }),
      )

      // From Disagree to Agree
      if (isInRefused) {
        tempRefusedDrugs.splice(tempRefusedDrugs.indexOf(drugId), 1)
        dispatch(
          RemoveRefusedDrugs.action({
            diagnosisId: proposedDiagnosisId,
            newRefusedDrugs: tempRefusedDrugs,
          }),
        )
      }
    }

    // From null to Disagree
    if (!value && !isInRefused) {
      tempRefusedDrugs.push(drugId)
      dispatch(
        AddRefusedDrugs.action({
          diagnosisId: proposedDiagnosisId,
          newRefusedDrugs: tempRefusedDrugs,
        }),
      )

      // From Agree to Disagree
      if (isInAgreed) {
        dispatch(
          RemoveAgreedDrugs.action({
            diagnosisId: proposedDiagnosisId,
            drugId,
          }),
        )
      }
    }
  }

  /**
   * Renders the boolean buttons to agree/disagree with the proposed diagnoses
   * @param diagnosis
   * @param drugId
   * @returns {JSX.Element}
   */
  const renderBooleanButton = (diagnosis, drugId) => {
    const isAgree = Object.keys(diagnosis.drugs.agreed).includes(
      drugId.toString(),
    )
    const isDisagree = diagnosis.drugs.refused.includes(drugId)

    return (
      <View style={medicalCaseDrugs.booleanButtonWrapper}>
        <View
          key="booleanButton-left"
          style={booleanButton.buttonWrapper(
            'left',
            isAgree,
            false,
            true,
            Colors.lightGrey,
          )}
        >
          <TouchableOpacity
            style={Layout.center}
            onPress={() => updateProposedDrugs(diagnosis.id, drugId, true)}
          >
            <Text style={booleanButton.buttonText(isAgree)}>
              {t('containers.medical_case.common.agree')}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          key="booleanButton-right"
          style={booleanButton.buttonWrapper(
            'right',
            isDisagree,
            false,
            true,
            Colors.lightGrey,
          )}
        >
          <TouchableOpacity
            style={Layout.center}
            onPress={() => updateProposedDrugs(diagnosis.id, drugId, false)}
          >
            <Text style={booleanButton.buttonText(isDisagree)}>
              {t('containers.medical_case.common.disagree')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return Object.values(agreedDiagnoses).map(agreedDiagnosis => (
    <View style={medicalCaseDrugs.wrapper}>
      <View style={medicalCaseDrugs.diagnosisHeaderWrapper}>
        <Text style={medicalCaseDrugs.diagnosisHeader}>
          {translate(algorithm.nodes[agreedDiagnosis.id].label)}
        </Text>
        <Text style={medicalCaseDrugs.diagnosisType}>{t('containers.medical_case.drugs.proposed')}</Text>
      </View>
      <View style={Gutters.regularHPadding}>
        <Text style={medicalCaseDrugs.drugsHeader}>
          {t('containers.medical_case.drugs.drugs')}
        </Text>
        {agreedDiagnosis.drugs.proposed.map((proposedDrugId, i) => (
          <View
            style={medicalCaseDrugs.drugWrapper(
              i === agreedDiagnosis.drugs.proposed.length - 1,
            )}
          >
            <View style={medicalCaseDrugs.drugTitleWrapper}>
              <Text style={medicalCaseDrugs.drugTitle}>
                {translate(algorithm.nodes[proposedDrugId].label)}
              </Text>
              {renderBooleanButton(agreedDiagnosis, proposedDrugId)}
            </View>
            <Text style={Fonts.textSmall}>
              {translate(algorithm.nodes[proposedDrugId].description)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  ))
}

export default ProposedDrugs
