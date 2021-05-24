/**
 * The external imports
 */
import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

function TabBarItem({ status, route, index, navigation }) {
  const { t } = useTranslation()
  const {
    Components: { tabBar },
    FontSize,
    Layout,
    Fonts,
  } = useTheme()

  return (
    <View style={Layout.fill}>
      <View style={Layout.row}>
        <TouchableOpacity
          onPress={navigation.navigate(route.name)}
          style={[Layout.fill, tabBar.tab]}
        >
          {!(index === 0) && (
            <Icon
              style={Layout.fill}
              size={FontSize.small}
              name="right-arrow"
            />
          )}
          <Text style={[tabBar.text(status), Layout.fill, Fonts.textCenter]}>
            {t(`containers.medical_case.steps.${route.name}`)}
          </Text>
          {status === 'done' && <Icon size={FontSize.small} name="alert" />}
        </TouchableOpacity>
      </View>
    </View>
  )
}
export default TabBarItem
