/**
 * The external imports
 */
import React from 'react'
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
import Navigation from '@/Config/Navigation'

const ListItem = ({ item }) => {
  // Theme and style elements deconstruction
  const {
    Components: { patientListItem },
    Layout,
    Gutters,
    Colors,
    FontSize,
  } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigation = useNavigation()

  /**
   * Toggles the modal and sets the modal type in the store
   * @returns {Promise<void>}
   */
  const toggleModal = async () => {
    await dispatch(LoadMedicalCase.action({ medicalCaseId: item.id }))
    await dispatch(LoadPatient.action({ patientId: item.patient.id }))
    navigation.navigate('StageWrapper')
  }

  return (
    <TouchableOpacity
      style={patientListItem.wrapper}
      onPress={() => toggleModal()}
    >
      <View style={patientListItem.container}>
        <View style={[Layout.column, Gutters.regularRMargin]}>
          <Icon name="lock" size={FontSize.large} color={Colors.red} />
        </View>
        <View style={patientListItem.titleWrapper}>
          <Text
            style={patientListItem.title}
          >{`${item.patient.first_name} ${item.patient.last_name}`}</Text>
          <Text>{format(item.patient.birth_date, 'dd.MM.yyyy')}</Text>
        </View>

        <View style={patientListItem.statusWrapper}>
          <Text style={patientListItem.statusTitle}>
            {t(
              `containers.medical_case.stages.${
                Navigation.INTERVENTION_STAGES[item.advancement.stage].label
              }`,
            )}
          </Text>
          <View style={Layout.row}>
            <Icon
              name="registration"
              size={FontSize.large}
              style={patientListItem.icon(false)}
            />
            <Icon
              name="assessment"
              size={FontSize.large}
              style={patientListItem.icon(true)}
            />
            <Icon
              name="consultation"
              size={FontSize.large}
              style={patientListItem.icon(false)}
            />
            <Icon
              name="tests"
              size={FontSize.large}
              style={patientListItem.icon(false)}
            />
            <Icon
              name="diagnosis"
              size={FontSize.large}
              style={patientListItem.icon(false)}
            />
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
