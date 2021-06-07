/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
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

const ProposedMedicines = () => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Fonts,
    Colors,
    Gutters,
    Containers: { medicalCaseDiagnoses },
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
      <View style={medicalCaseDiagnoses.booleanButtonWrapper}>
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
            <Text style={booleanButton.buttonText(isAgree)}>Agree</Text>
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
            <Text style={booleanButton.buttonText(isDisagree)}>Disagree</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return Object.values(agreedDiagnoses).map(agreedDiagnosis => (
    <View
      style={{
        ...Gutters.regularHMargin,
        backgroundColor: Colors.secondary,
        ...Gutters.regularTMargin,
      }}
    >
      <View
        style={{
          backgroundColor: Colors.primary,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          ...Gutters.regularHPadding,
          ...Gutters.smallVPadding,
        }}
      >
        <Text
          style={{
            ...Fonts.textRegular,
            color: Colors.secondary,
            ...Fonts.textUppercase,
            ...Fonts.textBold,
          }}
        >
          {translate(algorithm.nodes[agreedDiagnosis.id].label)}
        </Text>
        <Text
          style={{
            ...Fonts.textTiny,
            color: Colors.lightGrey,
            ...Fonts.textUppercase,
            ...Gutters.smallRMargin,
          }}
        >
          Proposed
        </Text>
      </View>
      <View style={{ ...Gutters.regularHPadding }}>
        <Text
          style={{
            color: Colors.grey,
            ...Fonts.textUppercase,
            ...Fonts.textSmall,
            ...Fonts.textBold,
            ...Gutters.regularTMargin,
          }}
        >
          Drugs
        </Text>
        {agreedDiagnosis.drugs.proposed.map((proposedDrugId, i) => (
          <View
            style={{
              borderBottomColor: Colors.grey,
              borderBottomWidth:
                i === agreedDiagnosis.drugs.proposed.length - 1 ? 0 : 1,
              ...Gutters.regularVPadding,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                ...Gutters.smallBMargin,
              }}
            >
              <Text style={{ ...Fonts.textSmall, ...Fonts.textBold }}>
                {translate(algorithm.nodes[proposedDrugId].label)}
              </Text>
              {renderBooleanButton(agreedDiagnosis, proposedDrugId)}
            </View>
            <Text style={{ ...Fonts.textSmall }}>
              {translate(algorithm.nodes[proposedDrugId].description)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  ))
}

export default ProposedMedicines
