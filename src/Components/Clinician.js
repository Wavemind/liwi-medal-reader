/**
 * The external imports
 */
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const Clinician = ({ currentClinician, handleClinician }) => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Fonts,
    Components: { clinician },
  } = useTheme()

  // Props deconstruction
  const { t } = useTranslation()

  return (
    <TouchableOpacity
      style={clinician.buttonWrapper}
      onPress={() => handleClinician(currentClinician)}
    >
      <View style={Layout.row}>
        <View style={[Layout.fill, Layout.alignItemStart]}>
          <Text style={[Fonts.textColorText, Fonts.titleRegular]}>
            {currentClinician.first_name} {currentClinician.last_name}
          </Text>
          <Text style={[Fonts.textColorText, Fonts.textTiny]}>
            {t(`health_facility.roles.${currentClinician.role}`)}
          </Text>
        </View>
        <View style={Layout.selfCenter}>
          <Icon name="right-arrow" />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default Clinician
