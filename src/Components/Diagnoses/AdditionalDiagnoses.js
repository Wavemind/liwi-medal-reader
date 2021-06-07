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
import { Icon } from '@/Components'
import { useTheme } from '@/Theme'
import ChangeAdditionalDiagnoses from '@/Store/MedicalCase/ChangeAdditionalDiagnoses'
import { navigate } from '@/Navigators/Root'

const AdditionalDiagnoses = () => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    FontSize,
    Fonts,
    Containers: { medicalCaseFinalDiagnoses },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const algorithm = useSelector(state => state.algorithm.item)
  const additional = useSelector(
    state => state.medicalCase.item.diagnosis.additional,
  )

  /**
   * Removes a single element from the additional diagnosis list
   * @param additionalDiagnosisId
   */
  const removeAdditionalDiagnosis = additionalDiagnosisId => {
    const tempAdditionalDiagnoses = [...additional]

    const index = tempAdditionalDiagnoses.indexOf(additionalDiagnosisId)
    if (index > -1) {
      tempAdditionalDiagnoses.splice(index, 1)
    }

    dispatch(
      ChangeAdditionalDiagnoses.action({
        newAdditionalDiagnoses: tempAdditionalDiagnoses,
      }),
    )
  }

  return (
    <View>
      {additional.map((additionalDiagnosisId, i) => (
        <View
          key={`additional-${additionalDiagnosisId}`}
          style={medicalCaseFinalDiagnoses.newItemWrapper(
            i === additional.length - 1,
          )}
        >
          <Text style={Fonts.textSmall}>{translate(algorithm.nodes[additionalDiagnosisId].label)}</Text>
          <TouchableOpacity
            onPress={() => removeAdditionalDiagnosis(additionalDiagnosisId)}
          >
            <Icon style={{}} name="delete" size={FontSize.regular} />
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        style={medicalCaseFinalDiagnoses.addAdditionalButton}
        onPress={() => navigate('Diagnoses')}
      >
        <Text style={medicalCaseFinalDiagnoses.addAdditionalButtonText}>
          {t('containers.medical_case.diagnoses.additional_placeholder')}
        </Text>
        <View style={medicalCaseFinalDiagnoses.addAdditionalButtonCountWrapper}>
          <Text style={medicalCaseFinalDiagnoses.addAdditionalButtonCountText}>
            {additional.length}
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

export default AdditionalDiagnoses
