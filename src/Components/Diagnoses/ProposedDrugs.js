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
import { AdditionalSelect } from '@/Components'
import AddAgreedDrugs from '@/Store/MedicalCase/Drugs/AddAgreedDrugs'
import AddRefusedDrugs from '@/Store/MedicalCase/Drugs/AddRefusedDrugs'
import RemoveAgreedDrugs from '@/Store/MedicalCase/Drugs/RemoveAgreedDrugs'
import RemoveRefusedDrugs from '@/Store/MedicalCase/Drugs/RemoveRefusedDrugs'
import ChangeAdditionalDrugs from '@/Store/MedicalCase/Drugs/ChangeAdditionalDrugs'
import ChangeAdditionalDrugDuration from '@/Store/MedicalCase/Drugs/ChangeAdditionalDrugDuration'

const ProposedDrugs = ({ diagnosisType }) => {
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
  const diagnoses = useSelector(
    state => state.medicalCase.item.diagnosis[diagnosisType],
  )

  /**
   * Updates the proposed diagnoses by sorting them into agreed or refused
   * @param diagnosisId
   * @param drugId
   * @param value
   */
  const updateDrugs = (diagnosisId, drugId, value) => {
    const agreedDrugs = { ...diagnoses[diagnosisId].drugs.agreed }
    const refusedDrugs = [...diagnoses[diagnosisId].drugs.refused]
    const isInAgreed = Object.keys(agreedDrugs).includes(drugId.toString())
    const isInRefused = refusedDrugs.includes(drugId)

    // From null to Agree
    if (value && !isInAgreed) {
      agreedDrugs[diagnosisId] = {
        id: diagnosisId.toString(),
        drugs: {},
      }
      dispatch(
        AddAgreedDrugs.action({
          diagnosisType,
          drugId,
          diagnosisId: diagnosisId,
          drugContent: { id: drugId },
        }),
      )

      // From Disagree to Agree
      if (isInRefused) {
        refusedDrugs.splice(refusedDrugs.indexOf(drugId), 1)
        dispatch(
          RemoveRefusedDrugs.action({
            diagnosisType,
            diagnosisId: diagnosisId,
            newRefusedDrugs: refusedDrugs,
          }),
        )
      }
    }

    // From null to Disagree
    if (!value && !isInRefused) {
      refusedDrugs.push(drugId)
      dispatch(
        AddRefusedDrugs.action({
          diagnosisType,
          diagnosisId: diagnosisId,
          newRefusedDrugs: refusedDrugs,
        }),
      )

      // From Agree to Disagree
      if (isInAgreed) {
        dispatch(
          RemoveAgreedDrugs.action({
            diagnosisType,
            drugId,
            diagnosisId: diagnosisId,
          }),
        )
      }
    }
  }

  /**
   * Removes a single element from the additional diagnosis list
   * @param diagnosisId
   * @param drugId
   */
  const removeAdditionalDrug = (diagnosisId, drugId) => {
    const tempAdditionalDrugs = { ...diagnoses[diagnosisId].drugs.additional }

    const index = Object.keys(tempAdditionalDrugs).indexOf(drugId.toString())
    if (index > -1) {
      delete tempAdditionalDrugs[drugId.toString()]
    }

    dispatch(
      ChangeAdditionalDrugs.action({
        diagnosisType,
        diagnosisId,
        newAdditionalDrugs: tempAdditionalDrugs,
      }),
    )
  }

  /**
   * Updates the selected additional drug duration
   * @param diagnosisId
   * @param drugId
   * @param duration
   */
  const updateAdditionalDrugDuration = (diagnosisId, drugId, duration) => {
    const tempAdditionalDrug = {
      ...diagnoses[diagnosisId].drugs.additional[drugId],
    }
    tempAdditionalDrug.duration = duration

    dispatch(
      ChangeAdditionalDrugDuration.action({
        diagnosisType,
        diagnosisId,
        drugId,
        newAdditionalDrug: tempAdditionalDrug,
      }),
    )
  }

  /**
   * Renders the boolean buttons to agree/disagree with the proposed diagnoses
   * @param diagnosis
   * @param drugId
   * @returns {JSX.Element}
   */
  const renderBooleanButton = (diagnosis, drugId) => {
    const isAgreed = Object.keys(diagnosis.drugs.agreed).includes(
      drugId.toString(),
    )
    const isRefused = diagnosis.drugs.refused.includes(drugId)

    return (
      <View style={medicalCaseDrugs.booleanButtonWrapper}>
        <View
          key="booleanButton-left"
          style={booleanButton.buttonWrapper(
            'left',
            isAgreed,
            false,
            true,
            Colors.lightGrey,
          )}
        >
          <TouchableOpacity
            style={Layout.center}
            onPress={() => updateDrugs(diagnosis.id, drugId, true)}
          >
            <Text style={booleanButton.buttonText(isAgreed)}>
              {t('containers.medical_case.common.agree')}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          key="booleanButton-right"
          style={booleanButton.buttonWrapper(
            'right',
            isRefused,
            false,
            true,
            Colors.lightGrey,
          )}
        >
          <TouchableOpacity
            style={Layout.center}
            onPress={() => updateDrugs(diagnosis.id, drugId, false)}
          >
            <Text style={booleanButton.buttonText(isRefused)}>
              {t('containers.medical_case.common.disagree')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return Object.values(diagnoses).map(diagnosis => (
    <View style={medicalCaseDrugs.wrapper}>
      <View style={medicalCaseDrugs.diagnosisHeaderWrapper}>
        <Text style={medicalCaseDrugs.diagnosisHeader}>
          {translate(algorithm.nodes[diagnosis.id].label)}
        </Text>
        <Text style={medicalCaseDrugs.diagnosisType}>
          {t(
            `containers.medical_case.drugs.${
              diagnosisType === 'agreed' ? 'proposed' : 'additional'
            }`,
          )}
        </Text>
      </View>
      <View style={Gutters.regularHPadding}>
        <Text style={medicalCaseDrugs.drugsHeader}>
          {t('containers.medical_case.drugs.drugs')}
        </Text>
        {diagnosis.drugs.proposed.map((drugId, i) => (
          <View
            style={medicalCaseDrugs.drugWrapper(
              i === diagnosis.drugs.proposed.length - 1,
            )}
          >
            <View style={medicalCaseDrugs.drugTitleWrapper}>
              <Text style={medicalCaseDrugs.drugTitle}>
                {translate(algorithm.nodes[drugId].label)}
              </Text>
              {renderBooleanButton(diagnosis, drugId)}
            </View>
            <Text style={Fonts.textSmall}>
              {translate(algorithm.nodes[drugId].description)}
            </Text>
          </View>
        ))}
      </View>
      <View style={Gutters.regularHPadding}>
        <AdditionalSelect
          listObject={diagnosis.drugs.additional}
          listItemType="drugs"
          handleRemove={removeAdditionalDrug}
          diagnosisId={diagnosis.id}
          diagnosisType={diagnosisType}
          withDuration
          onUpdateDuration={updateAdditionalDrugDuration}
        />
      </View>
    </View>
  ))
}

export default ProposedDrugs
