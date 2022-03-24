/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { UpdateDrugService } from '@/Services/MedicalCase'
import { drugIsAgreed, drugIsRefused } from '@/Utils/Drug'

const DrugBooleanButton = ({ drug }) => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Components: { booleanButton },
  } = useTheme()

  const { t } = useTranslation()

  const isAgreed = useMemo(() => drugIsAgreed(drug), [drug])
  const isRefused = useMemo(() => drugIsRefused(drug), [drug])

  /**
   * Updates the state for each diagnosis
   * @param {*} value boolean
   */
  const updateState = value => {
    drug.diagnoses.forEach(diagnosis =>
      UpdateDrugService(diagnosis.id, drug.id, value, diagnosis.key),
    )
  }

  return (
    <View style={booleanButton.outerWrapper}>
      <View style={booleanButton.buttonWrapper('left', isAgreed, false)}>
        <TouchableOpacity
          style={Layout.center}
          onPress={() => updateState(true)}
        >
          <Text style={booleanButton.buttonText(isAgreed)}>
            {t('containers.medical_case.common.agree')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={booleanButton.buttonWrapper('right', isRefused, false)}>
        <TouchableOpacity
          style={Layout.center}
          onPress={() => updateState(false)}
        >
          <Text style={booleanButton.buttonText(isRefused)}>
            {t('containers.medical_case.common.disagree')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default DrugBooleanButton
