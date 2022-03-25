/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Text, TouchableOpacity, View } from 'react-native'

/**
 * The internal imports
 */
import RemoveAdditionalDiagnoses from '@/Store/MedicalCase/Diagnoses/RemoveAdditionalDiagnoses'
import { Icon, SelectedItem } from '@/Components'
import { navigate } from '@/Navigators/Root'
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'

const AdditionalDiagnoses = () => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    FontSize,
    Components: { additionalSelect },
    Containers: { finalDiagnoses },
  } = useTheme()

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const nodes = useSelector(state => state.algorithm.item.nodes)

  const additional = useSelector(
    state => state.medicalCase.item.diagnosis.additional,
  )

  const listValues = useMemo(() => Object.values(additional), [additional])

  /**
   * Removes a single element from the additional diagnosis list
   * @param diagnosisId
   */
  const removeAdditionalDiagnosis = diagnosisId => {
    dispatch(
      RemoveAdditionalDiagnoses.action({
        diagnosisId,
      }),
    )
  }

  return (
    <>
      {listValues.length === 0 && (
        <Text style={finalDiagnoses.noItemsText}>
          {t('containers.medical_case.diagnoses.no_additional')}
        </Text>
      )}
      {listValues.map((listItem, i) => (
        <SelectedItem
          key={`additional-${listItem.id}`}
          listItem={listItem}
          isLast={i === listValues.length - 1}
          onRemovePress={removeAdditionalDiagnosis}
          labelMethod={() => translate(nodes[listItem.id].label)}
        />
      ))}
      <TouchableOpacity
        style={additionalSelect.addAdditionalButton}
        onPress={() => navigate('SearchAdditional')}
      >
        <Text style={additionalSelect.addAdditionalButtonText}>
          {t('containers.medical_case.diagnoses.additional_placeholder')}
        </Text>
        <View style={additionalSelect.addAdditionalButtonCountWrapper}>
          <Text style={additionalSelect.addAdditionalButtonCountText}>
            {listValues.length}
          </Text>
        </View>
        <Icon
          style={Gutters.regularLMargin}
          name="right-arrow"
          size={FontSize.large}
        />
      </TouchableOpacity>
    </>
  )
}

export default AdditionalDiagnoses
