/**
 * The external imports
 */
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { View, Text, TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import ChangeClinician from '@/Store/HealthFacility/ChangeClinician'
import { navigateAndSimpleReset } from '@/Navigators/Root'

const Clinician = props => {
  // Props deconstruction
  const { currentClinician } = props
  const dispatch = useDispatch()
  const { t } = useTranslation()

  // Theme and style elements deconstruction
  const {
    Layout,
    Fonts,
    Colors,
    Components: { clinician },
  } = useTheme()

  /**
   * Set clinician and redirect user to Pin container
   * @param {hash} newClinician
   */
  const handleClinician = async () => {
    await dispatch(ChangeClinician.action({ clinician: currentClinician }))
    navigateAndSimpleReset('Pin')
  }

  return (
    <TouchableOpacity
      style={clinician.buttonWrapper}
      onPress={() => handleClinician()}
    >
      <View style={[Layout.row]}>
        <View style={[Layout.fill, Layout.alignItemStart]}>
          <Text
            style={[Fonts.textRegular, Fonts.textColorText, Fonts.textBold]}
          >
            {currentClinician.first_name} {currentClinician.last_name}
          </Text>
          <Text style={[Fonts.textColorText]}>
            {t(`health_facility.roles.${currentClinician.role}`)}
          </Text>
        </View>
        <View style={[Layout.selfCenter]}>
          <Icon name="chevron-right" color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default Clinician
