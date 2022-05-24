/**
 * The external imports
 */
import React, { useEffect, useState, useMemo } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import { getStages } from '@/Utils/Navigation/GetStages'
import { isLocked } from '@/Utils/MedicalCase'
import { formatDate } from '@/Utils/Date'
import LoadMedicalCase from '@/Store/MedicalCase/Load'
import LoadPatient from '@/Store/Patient/Load'
import LockMedicalCase from '@/Store/DatabaseMedicalCase/Lock'
import ToggleVisibility from '@/Store/Modal/ToggleVisibility'
import SetParams from '@/Store/Modal/SetParams'

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
  const currentVersionId = useSelector(state => state.algorithm.item.version_id)

  const [stages] = useState(getStages())
  const [locked, setLocked] = useState(isLocked(item))
  const disabled = useMemo(() => item.version_id !== currentVersionId, [item])

  useEffect(() => {
    setLocked(isLocked(item))
  }, [item.device_id])

  /**
   * Will load the Medical case in the store then navigate to the Medical Case
   * @returns {Promise<void>}
   */
  const handlePress = async () => {
    await dispatch(LoadMedicalCase.action({ medicalCaseId: item.id }))
    if (item.closedAt > 0) {
      await dispatch(LoadPatient.action({ patientId: item.patient.id }))
      navigation.navigate('MedicalCaseSummary')
    } else if (locked) {
      await dispatch(SetParams.action({ type: 'lock' }))
      await dispatch(ToggleVisibility.action({}))
    } else {
      await dispatch(LockMedicalCase.action({ medicalCaseId: item.id }))
      await dispatch(LoadPatient.action({ patientId: item.patient.id }))
      navigation.navigate('StageWrapper', {
        stageIndex: item.advancement.stage,
        stepIndex: item.advancement.step,
      })
    }
  }

  return (
    <TouchableOpacity
      style={medicalCaseListItem.wrapper(disabled)}
      onPress={handlePress}
      disabled={disabled}
    >
      <View style={medicalCaseListItem.container}>
        {locked && (
          <View style={[Layout.column, Gutters.regularRMargin]}>
            <Icon name="lock" size={FontSize.large} color={Colors.red} />
          </View>
        )}
        <View style={medicalCaseListItem.titleWrapper}>
          <Text style={medicalCaseListItem.title}>
            {`${item.patient.first_name} ${item.patient.last_name}`}
          </Text>
          <Text style={medicalCaseListItem.birthDate}>
            {formatDate(item.patient.birth_date)}
          </Text>
        </View>

        <View style={medicalCaseListItem.dateWrapper}>
          <Text style={medicalCaseListItem.date}>
            {formatDate(item.createdAt)}
          </Text>
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
