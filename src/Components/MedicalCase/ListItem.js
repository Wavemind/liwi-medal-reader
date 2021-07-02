/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useDispatch } from 'react-redux'
import format from 'date-fns/format'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import LoadMedicalCase from '@/Store/MedicalCase/Load'
import LoadPatient from '@/Store/Patient/Load'
import { getStages } from '@/Utils/Navigation/GetStages'

const ListItem = ({ item }) => {
  // Theme and style elements deconstruction
  const {
    Components: { medicalCaseListItem },
    Layout,
    Gutters,
    Colors,
    FontSize,
  } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const [stages] = useState(getStages())

  /**
   * Will load the Medical case in the store then navigate to the Medical Case
   * @returns {Promise<void>}
   */
  const handlePress = async () => {
    await dispatch(LoadMedicalCase.action({ medicalCaseId: item.id }))
    if (item.closedAt > 0) {
      navigation.navigate('MedicalCaseSummary')
    } else {
      await dispatch(LoadPatient.action({ patientId: item.patient.id }))
      navigation.navigate('StageWrapper', {
        stageIndex: item.advancement.stage,
        stepIndex: item.advancement.step,
      })
    }
  }

  return (
    <TouchableOpacity
      style={medicalCaseListItem.wrapper}
      onPress={() => handlePress()}
    >
      <View style={medicalCaseListItem.container}>
        <View style={[Layout.column, Gutters.regularRMargin]}>
          <Icon name="lock" size={FontSize.large} color={Colors.red} />
        </View>
        <View style={medicalCaseListItem.titleWrapper}>
          <Text style={medicalCaseListItem.title}>
            {`${item.patient.first_name} ${item.patient.last_name}`}
          </Text>
          <Text>{format(item.patient.birth_date, 'dd.MM.yyyy')}</Text>
        </View>

        <View style={medicalCaseListItem.statusWrapper}>
          <Text style={medicalCaseListItem.statusTitle}>
            {item.closedAt > 0
              ? t('containers.medical_case.stages.closed')
              : t(
                  `containers.medical_case.stages.${
                    stages[item.advancement.stage].label
                  }`,
                )}
          </Text>
          <View style={Layout.row}>
            {stages.map((stage, index) => (
              <Icon
                key={`${item.id}-icon-${stage.icon}`}
                name={stage.icon}
                style={medicalCaseListItem.icon(
                  item.closedAt > 0 ? true : index === item.advancement.stage,
                )}
              />
            ))}
          </View>
        </View>
        <View style={[Gutters.regularLMargin, Layout.column]}>
          <Icon name="right-arrow" size={FontSize.large} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ListItem
