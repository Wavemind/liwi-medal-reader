import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ScrollView, Text, View, TouchableOpacity } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import { useTheme } from '@/Theme'
import { BottomNavbar, TabItem } from '@/Components'
import { useTranslation } from 'react-i18next'

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home!</Text>
    </View>
  )
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  )
}
const IndexConsultationContainer = props => {
  const { navigation } = props

  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout, Colors } = useTheme()
  const dispatch = useDispatch()

  const state = useSelector(state => state)
  const Tab = createMaterialTopTabNavigator()

  return (
    <Tab.Navigator tabBar={props => <TabItem {...props} />}>
      <Tab.Screen name="MyHome" component={HomeScreen} />
      <Tab.Screen name="MySettings" component={SettingsScreen} />
    </Tab.Navigator>
  )
}

export default IndexConsultationContainer
