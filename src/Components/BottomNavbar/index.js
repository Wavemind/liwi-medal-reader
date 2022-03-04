/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { TouchableOpacity, View, Text } from 'react-native'
import {
  useNavigationState,
  useNavigation,
  getFocusedRouteNameFromRoute,
  useRoute,
} from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon, SquareButton, ActionsNavbar } from '@/Components'
import { CheckSynchronizationService } from '@/Services/MedicalCase'

const BottomNavbar = () => {
  // Theme and style elements deconstruction
  const {
    Gutters,
    Colors,
    FontSize,
    Components: { bottomNavbar },
  } = useTheme()

  const { t } = useTranslation()
  const navigation = useNavigation()
  const navigationState = useNavigationState(state => state)
  const route = useRoute()
  const routeName = getFocusedRouteNameFromRoute(route)

  const [syncRequired, setSyncRequired] = useState(false)

  // Checks whether the synchronization required warning is to be shown
  useEffect(() => {
    async function checkSynchronization() {
      const required = await CheckSynchronizationService(routeName)
      if (required !== syncRequired) {
        setSyncRequired(required)
      }
    }
    checkSynchronization()
  }, [route])

  return (
    <View style={bottomNavbar.container}>
      <View style={bottomNavbar.emergencyContainer}>
        <TouchableOpacity
          style={bottomNavbar.emergencyWrapper}
          onPress={() => navigation.navigate('Emergency')}
        >
          <Icon name="emergency" style={bottomNavbar.emergency} />
        </TouchableOpacity>
      </View>
      {syncRequired && (
        <View style={bottomNavbar.warningWrapper}>
          <Icon name="warning" color={Colors.secondary} size={FontSize.big} />
          <Text style={bottomNavbar.warningText}>
            {t('containers.synchronization.warning')}
          </Text>
          <View style={Gutters.regularRMargin}>
            <SquareButton
              filled
              icon="right-arrow"
              iconAfter
              bgColor={Colors.secondary}
              color={Colors.primary}
              iconSize={FontSize.large}
              onPress={() => navigation.navigate('Synchronization')}
              fullWidth={false}
            />
          </View>
        </View>
      )}
      <View style={bottomNavbar.actions}>
        <ActionsNavbar navigationState={navigationState} />
      </View>
    </View>
  )
}

export default BottomNavbar
