/**
 * The external imports
 */
import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const ListItem = ({ item }) => {
  // Theme and style elements deconstruction
  const navigation = useNavigation()
  const {
    Components: { patientListItem },
    Layout,
    Gutters,
    Fonts,
  } = useTheme()

  return (
    <TouchableOpacity
      style={patientListItem.wrapper}
      onPress={() =>
        navigation.navigate('PatientProfile', {
          id: item.id,
          title: `${item.first_name} ${item.last_name} ${item.birth_date}`,
        })
      }
    >
      <View style={patientListItem.container}>
        <View style={patientListItem.titleWrapper}>
          <Text style={patientListItem.title}>Quentin Girard</Text>
          <Text>02.03.1994</Text>
        </View>
        <View style={patientListItem.dateWrapper}>
          <Text style={Fonts.textCenter}>10.02.2021</Text>
        </View>
        <View style={patientListItem.statusWrapper}>
          <Text style={patientListItem.statusTitle}>1st assessement</Text>
          <View style={[Layout.row]}>
            <Icon
              name="registration"
              size={30}
              style={patientListItem.icon(false)}
            />
            <Icon
              name="assessment"
              size={30}
              style={patientListItem.icon(true)}
            />
            <Icon
              name="consult"
              size={30}
              style={patientListItem.icon(false)}
            />
            <Icon name="test" size={30} style={patientListItem.icon(false)} />
            <Icon
              name="diagnosis"
              size={30}
              style={patientListItem.icon(false)}
            />
          </View>
        </View>
        <View style={[Gutters.regularLMargin, Layout.column]}>
          <Icon name="right-arrow" size={25} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ListItem
