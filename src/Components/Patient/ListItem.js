/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { isFulfilled } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import { getStages } from '@/Utils/Navigation/GetStages'
import LoadPatient from '@/Store/Patient/Load'
import { formatDate } from '@/Utils/Date'

const ListItem = ({ item }) => {
  // Theme and style elements deconstruction
  const navigation = useNavigation()
  const {
    Components: { patientListItem },
    Layout,
    Gutters,
    FontSize,
  } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [activeMedicalCase, setActiveMedicalCase] = useState(null)
  const [stages] = useState(getStages())

  useEffect(() => {
    const medicalCase = item.medicalCases.find(mc => mc.closedAt === 0)
    setActiveMedicalCase(medicalCase)
  }, [])

  /**
   * Loads the patient and medical case before navigating to the patient profile
   * @returns {Promise<void>}
   */
  const handlePress = async () => {
    const loadPatient = await dispatch(
      LoadPatient.action({ patientId: item.id }),
    )
    if (isFulfilled(loadPatient)) {
      navigation.navigate('PatientProfile', {
        title: `${item.first_name} ${item.last_name} - ${formatDate(
          item.birth_date,
        )}`,
      })
    }
  }

  return (
    <TouchableOpacity style={patientListItem.wrapper} onPress={handlePress}>
      <View style={patientListItem.container}>
        <View style={patientListItem.titleWrapper}>
          <Text style={patientListItem.title}>
            {`${item.first_name} ${item.last_name}`}
          </Text>
          <Text style={patientListItem.date}>
            {formatDate(item.birth_date)}
          </Text>
        </View>
        <View style={patientListItem.dateWrapper}>
          <Text style={patientListItem.date}>{formatDate(item.updatedAt)}</Text>
        </View>
        {activeMedicalCase ? (
          <View style={patientListItem.statusWrapper}>
            <Text style={patientListItem.statusTitle}>
              {t(
                `containers.medical_case.stages.${
                  stages[activeMedicalCase.advancement.stage].label
                }`,
              )}
            </Text>
            <View style={Layout.row}>
              {stages.map((stage, index) => (
                <Icon
                  key={`${item.id}-${stage.icon}`}
                  name={stage.icon}
                  size={FontSize.sectionHeader}
                  style={patientListItem.icon(
                    index === activeMedicalCase.advancement.stage,
                  )}
                />
              ))}
            </View>
          </View>
        ) : (
          <Text style={patientListItem.noActiveConsultationsText}>
            {t('containers.patient.list.no_active_consultations')}
          </Text>
        )}
        <View style={[Gutters.regularLMargin, Layout.column]}>
          <Icon name="right-arrow" size={25} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ListItem
