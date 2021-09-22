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
import { formatDate } from '@/Utils/Date'

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
  const lastVisit =
    item.medical_cases[item.medical_cases.length - 1]?.updated_at

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
          <Text style={[Fonts.textCenter, Fonts.textSmall]}>
            {lastVisit && formatDate(lastVisit)}
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
