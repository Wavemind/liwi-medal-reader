/**
 * The external imports
 */
import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import format from 'date-fns/format'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const ConsentListItem = ({ item }) => {
  // Theme and style elements deconstruction
  const {
    Components: { consentListItem },
    Layout,
    Gutters,
    Fonts,
  } = useTheme()
  const navigation = useNavigation()

  // medicalCases already sorted by updatedAt (service call)
  let last_visit = item.medicalCases[item.medicalCases.length - 1].updatedAt

  return (
    <TouchableOpacity
      style={consentListItem.wrapper}
      onPress={() =>
        navigation.navigate('Preview', {
          consent: item.consent_file,
        })
      }
    >
      <View style={consentListItem.container}>
        <View style={consentListItem.titleWrapper}>
          <Text style={consentListItem.title}>
            {item.first_name} {item.last_name}
          </Text>
        </View>
        <View style={consentListItem.dateWrapper}>
          <Text style={Fonts.textCenter}>
            {format(last_visit, 'dd.MM.yyyy')}
          </Text>
        </View>
        <View style={[Gutters.regularLMargin, Layout.column]}>
          <Icon name="right-arrow" size={25} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ConsentListItem
