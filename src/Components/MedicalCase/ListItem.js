/**
 * The external imports
 */
import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const ListItem = props => {
  // Theme and style elements deconstruction
  const {
    Components: { patientListItem },
    Layout,
    Gutters,
    Colors,
    FontSize,
  } = useTheme()

  return (
    <TouchableOpacity
      style={patientListItem.wrapper}
      onPress={() => console.log('TODO')}
    >
      <View style={patientListItem.container}>
        <View style={[Layout.column, Gutters.regularRMargin]}>
          <Icon name="lock" size={FontSize.large} color={Colors.red} />
        </View>
        <View style={patientListItem.titleWrapper}>
          <Text style={patientListItem.title}>Quentin Girard</Text>
          <Text>02.03.1994</Text>
        </View>
        <View style={patientListItem.statusWrapper}>
          <Text style={patientListItem.statusTitle}>1st assessement</Text>
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
