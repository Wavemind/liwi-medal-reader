/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
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
import LockMedicalCase from '@/Store/DatabaseMedicalCase/Lock'
import { getStages } from '@/Utils/Navigation/GetStages'
import { isLocked } from '@/Utils/MedicalCase'
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

  const [stages] = useState(getStages())
  const [locked, setLocked] = useState(isLocked(item))

  useEffect(() => {
    setLocked(isLocked(item))
  }, [item.mac_address])

  /**
   * Will load the Medical case in the store then navigate to the Medical Case
   * @returns {Promise<void>}
   */
  const handlePress = async () => {
    await dispatch(LoadMedicalCase.action({ medicalCaseId: item.id }))
    if (item.closedAt > 0) {
      await dispatch(LoadMedicalCase.action({ medicalCaseId: item.id }))
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

  // // convert to msec
  // // subtract local time zone offset
  // // get UTC time in msec
  // const utc =
  //   new Date(item.patient.birth_date).getTime() +
  //   new Date(item.patient.birth_date).getTimezoneOffset() * 60000

  // // create new Date object for different city
  // // using supplied offset
  // console.log(
  //   'ici',
  //   (new Date(item.patient.birth_date).getTimezoneOffset() / 60) * -1,
  // )
  // const nd = new Date(utc + 3600000 * 2)

  // console.log('tout simple', nd)
  // console.log(new Date(item.patient.birth_date))
  // console.log(format(item.patient.birth_date, 'dd.MM.yyyy'))

  // // return time as a string
  // console.log('The local time for city is ' + nd.toLocaleString())
  // console.log('The local time for city is ' + nd.toUTCString())

  return (
    <TouchableOpacity style={medicalCaseListItem.wrapper} onPress={handlePress}>
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
            {format(item.patient.birth_date, 'dd.MM.yyyy')}
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
