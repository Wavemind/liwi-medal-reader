/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import format from 'date-fns/format'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { isFulfilled } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import LoadMedicalCase from '@/Store/MedicalCase/Load'
import { translate } from '@/Translations/algorithm'

const ConsultationListItem = ({ item }) => {
  // Theme and style elements deconstruction
  const {
    FontSize,
    Layout,
    Gutters,
    Colors,
    Components: { consultationListItem },
  } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const nodes = useSelector(state => state.algorithm.item.nodes)

  const [allDiagnoses] = useState({
    ...item.diagnosis.agreed,
    ...item.diagnosis.additional,
    ...item.diagnosis.custom,
  })

  /**
   * Displays the label for diagnoses in nodes and the name for custom diagnoses
   * @param diagnosis
   * @returns {*}
   */
  const renderLabel = diagnosis => {
    if (nodes[diagnosis.id] !== undefined) {
      return translate(nodes[diagnosis.id].label)
    }
    return diagnosis.name
  }

  /**
   * Will load the Medical case in the store then navigate to the Medical Case
   * @returns {Promise<void>}
   */
  const handlePress = async () => {
    const loadMedicalCase = await dispatch(
      LoadMedicalCase.action({ medicalCaseId: item.id }),
    )
    if (isFulfilled(loadMedicalCase)) {
      navigation.navigate('MedicalCaseSummary')
    }
  }

  return (
    <TouchableOpacity
      style={consultationListItem.wrapper}
      onPress={handlePress}
    >
      <View style={consultationListItem.container}>
        {!item.synchronizedAt && (
          <View style={[Layout.column, Gutters.regularRMargin]}>
            <Icon name="alert" size={FontSize.large} color={Colors.red} />
          </View>
        )}
        <Text style={consultationListItem.title}>
          {t('containers.medical_case.stages.diagnoses')}
        </Text>
        <Text style={consultationListItem.count}>
          {Object.keys(allDiagnoses).length}
        </Text>
        <View style={consultationListItem.diagnosesWrapper}>
          {Object.values(allDiagnoses).map(diagnosis => (
            <Text
              key={`consultation_diagnosis_${diagnosis.id}`}
              style={consultationListItem.diagnosis}
            >
              - {renderLabel(diagnosis)}
            </Text>
          ))}
        </View>
        <Text style={consultationListItem.date}>
          {item.synchronizedAt > 0 && format(item.synchronizedAt, 'dd.MM.yyyy')}
        </Text>
        <Icon name="right-arrow" size={FontSize.large} />
      </View>
    </TouchableOpacity>
  )
}

export default ConsultationListItem
