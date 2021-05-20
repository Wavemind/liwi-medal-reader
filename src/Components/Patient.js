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

const Patient = props => {
  // Theme and style elements deconstruction
  const {
    Components: { patient },
    Layout,
    Gutters,
    Fonts,
  } = useTheme()

  return (
    <TouchableOpacity
      style={patient.wrapper}
      onPress={() => console.log('TODO')}
    >
      <View style={patient.container}>
        <View style={patient.titleWrapper}>
          <Text style={patient.title}>Quentin Girard</Text>
          <Text>02.03.1994</Text>
        </View>
        <View style={patient.dateWrapper}>
          <Text style={Fonts.textCenter}>10.02.2021</Text>
        </View>
        <View style={patient.statusWrapper}>
          <Text style={patient.statusTitle}>1st assessement</Text>
          <View style={[Layout.row]}>
            <Icon name="registration" size={30} style={patient.icon(false)} />
            <Icon name="assessment" size={30} style={patient.icon(true)} />
            <Icon name="consult" size={30} style={patient.icon(false)} />
            <Icon name="test" size={30} style={patient.icon(false)} />
            <Icon name="diagnosis" size={30} style={patient.icon(false)} />
          </View>
        </View>
        <View style={[Gutters.regularLMargin, Layout.column]}>
          <Icon name="right-arrow" size={25} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default Patient
