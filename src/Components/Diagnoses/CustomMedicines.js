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
import {navigate} from "@/Navigators/Root";

const CustomDiagnoses = () => {
  // Theme and style elements deconstruction
  const {
    FontSize,
    Gutters,
    Fonts,
    Containers: { medicalCaseDiagnoses },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const custom = useSelector(state => state.medicalCase.item.diagnosis.custom)

  const [value, setValue] = useState('')

  /**
   * Handles whether to add or remove a custom diagnosis from the store
   * @param action
   * @param customDiagnosisId
   */
  const changeCustomDiagnosis = (action = 'add', customDiagnosisId = null) => {
    const tempCustomDiagnoses = [...custom]

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

  return (
    <View>
      {custom.map((customDiagnosis, i) => (
        <View
          key={`custom-${customDiagnosis.id}`}
          style={medicalCaseDiagnoses.newItemWrapper(i === custom.length - 1)}
        >
          <Text style={Fonts.textSmall}>{customDiagnosis.name}</Text>
          <TouchableOpacity
            onPress={() => changeCustomDiagnosis('remove', customDiagnosis.id)}
          >
            <Icon name="delete" size={FontSize.regular} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={medicalCaseDiagnoses.addAdditionalButton}
        onPress={() => navigate('Diagnoses')}
      >
        <Text style={medicalCaseDiagnoses.addAdditionalButtonText}>
          {t('containers.medical_case.diagnoses.additional_placeholder')}
        </Text>
        <View style={medicalCaseDiagnoses.addAdditionalButtonCountWrapper}>
          <Text style={medicalCaseDiagnoses.addAdditionalButtonCountText}>
            2
          </Text>
        </View>
        <Icon
          style={Gutters.regularLMargin}
          name="right-arrow"
          size={FontSize.large}
        />
      </TouchableOpacity>
    </View>
  )
}

export default CustomDiagnoses
