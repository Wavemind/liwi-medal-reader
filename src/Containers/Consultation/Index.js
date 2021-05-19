import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Text, View } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'

import { useTheme } from '@/Theme'
import { TabItem, SideBar } from '@/Components'
import { useTranslation } from 'react-i18next'
import { FontSize } from '@/Theme/Variables'

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

function SettingsTwoScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  )
}

function SettingsThreeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings!</Text>
    </View>
  )
}

function SettingsFourScreen() {
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
    <View
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
      }}
    >
      <SideBar />
      <View style={{ flex: 1, display: 'flex' }}>
        <View
          style={{
            height: 40,
            backgroundColor: Colors.black,
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 20,
          }}
        >
          <Text
            style={{
              color: '#fff',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              fontSize: FontSize.regular,
            }}
          >
            1ST Assessment
          </Text>
        </View>
        <Tab.Navigator
          tabBarOptions={{ scrollEnabled: true, tabStyle: { width: 340 } }}
          tabBar={props => <TabItem {...props} />}
        >
          <Tab.Screen name="MyHome" component={HomeScreen} />
          <Tab.Screen name="MySettings" component={SettingsThreeScreen} />
          <Tab.Screen name="MySettingsTwo" component={SettingsTwoScreen} />
          <Tab.Screen name="MySettingsThree" component={SettingsTwoScreen} />
          <Tab.Screen name="MySettingsFour" component={SettingsFourScreen} />
        </Tab.Navigator>
      </View>
    </View>
  )
}

export default IndexConsultationContainer
