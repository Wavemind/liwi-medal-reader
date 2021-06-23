/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useNavigation } from '@react-navigation/native'
import format from 'date-fns/format'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import { getStages } from '@/Utils/Navigation/GetStages'

const ListItem = ({ item }) => {
  // Theme and style elements deconstruction
  const navigation = useNavigation()
  const {
    Components: { patientListItem },
    Layout,
    Gutters,
    Fonts,
    FontSize,
  } = useTheme()
  const { t } = useTranslation()
  const [activeMedicalCase, setActiveMedicalCase] = useState(null)

  const [stages] = useState(getStages())

  useEffect(() => {
    const medicalCase = item.medicalCases.find(mc => mc.closedAt !== null)
    setActiveMedicalCase(medicalCase)
  }, [])

  return (
    <TouchableOpacity
      style={patientListItem.wrapper}
      onPress={() =>
        navigation.navigate('PatientProfile', {
          id: item.id,
          title: `${item.first_name} ${item.last_name} ${format(
            item.updatedAt,
            'dd.MM.yyyy',
          )}`,
        })
      }
    >
      <View style={patientListItem.container}>
        <View style={patientListItem.titleWrapper}>
          <Text
            style={patientListItem.title}
          >{`${item.first_name} ${item.last_name}`}</Text>
          <Text>{format(item.birth_date, 'dd.MM.yyyy')}</Text>
        </View>
        <View style={patientListItem.dateWrapper}>
          <Text style={Fonts.textSemiBold}>
            {format(item.updatedAt, 'dd.MM.yyyy')}
          </Text>
        </View>
        {activeMedicalCase && (
          <View style={patientListItem.statusWrapper}>
            <Text style={patientListItem.statusTitle}>
              {activeMedicalCase.closedAt > 0
                ? t('containers.medical_case.stages.closed')
                : t(
                    `containers.medical_case.stages.${
                      stages[activeMedicalCase.stage].label
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
                    index === activeMedicalCase.stage,
                  )}
                />
              ))}
            </View>
          </View>
        )}
        <View style={[Gutters.regularLMargin, Layout.column]}>
          <Icon name="right-arrow" size={25} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ListItem
