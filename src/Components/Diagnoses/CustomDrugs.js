/**
 * The external imports
 */
import React, { useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import uuid from 'react-native-uuid'

/**
 * The internal imports
 */
import { Icon, RoundedButton } from '@/Components'
import { useTheme } from '@/Theme'
import ChangeCustomDiagnoses from '@/Store/MedicalCase/ChangeCustomDiagnoses'
import { navigate } from '@/Navigators/Root'
import { translate } from '@/Translations/algorithm'

const CustomDiagnoses = () => {
  // Theme and style elements deconstruction
  const {
    FontSize,
    Gutters,
    Fonts,
    Containers: { medicalCaseFinalDiagnoses, medicalCaseDrugs },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const algorithm = useSelector(state => state.algorithm.item)
  const customDiagnoses = useSelector(
    state => state.medicalCase.item.diagnosis.custom,
  )

  const [value, setValue] = useState('')

  /**
   * Handles whether to add or remove a custom diagnosis from the store
   * @param action
   * @param customDiagnosisId
   */
  const changeCustomDiagnosis = (action = 'add', customDiagnosisId = null) => {
    const tempCustomDiagnoses = [...customDiagnoses]

    if (action === 'remove') {
      const index = tempCustomDiagnoses
        .map(customDiagnosis => customDiagnosis.id)
        .indexOf(customDiagnosisId)
      if (index > -1) {
        tempCustomDiagnoses.splice(index, 1)
      }
    } else {
      const newCustomDiagnosis = {
        id: uuid.v4(),
        name: value,
        drugs: [],
      }
      tempCustomDiagnoses.push(newCustomDiagnosis)
      setValue('')
    }

    dispatch(
      ChangeCustomDiagnoses.action({
        newCustomDiagnoses: tempCustomDiagnoses,
      }),
    )
  }

  return customDiagnoses.map(customDiagnosis => (
    <View style={medicalCaseDrugs.wrapper}>
      <View style={medicalCaseDrugs.diagnosisHeaderWrapper}>
        <Text style={medicalCaseDrugs.diagnosisHeader}>
          {customDiagnosis.name}
        </Text>
        <Text style={medicalCaseDrugs.diagnosisType}>
          {t('containers.medical_case.drugs.custom')}
        </Text>
      </View>
      <View style={Gutters.regularHPadding}>
        <Text style={medicalCaseDrugs.drugsHeader}>
          {t('containers.medical_case.drugs.drugs')}
        </Text>
        {customDiagnosis.drugs.map(customDrug => (
          <View
            key={`additional-${customDiagnosis.name}`}
            style={medicalCaseFinalDiagnoses.newItemWrapper(
              i === customDiagnosis.drugs.length - 1,
            )}
          >
            <Text style={Fonts.textSmall}>Drug 1</Text>
            <TouchableOpacity onPress={() => console.log('remove drug')}>
              <Icon style={{}} name="delete" size={FontSize.regular} />
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity
          style={[Gutters.regularBMargin, medicalCaseFinalDiagnoses.addAdditionalButton]}
          onPress={() => navigate('Drugs')}
        >
          <Text style={medicalCaseFinalDiagnoses.addAdditionalButtonText}>
            {t('containers.medical_case.diagnoses.additional_placeholder')}
          </Text>
          <View style={medicalCaseFinalDiagnoses.addAdditionalButtonCountWrapper}>
            <Text style={medicalCaseFinalDiagnoses.addAdditionalButtonCountText}>
              {customDiagnosis.drugs.length}
            </Text>
          </View>
          <Icon
            style={Gutters.regularLMargin}
            name="right-arrow"
            size={FontSize.large}
          />
        </TouchableOpacity>
      </View>
    </View>
  ))
}

export default CustomDiagnoses
