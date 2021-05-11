import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Switch, ScrollView, Text } from 'react-native'
import {
  BooleanButtons,
  SectionHeader,
  Select,
  SquareButton,
  RoundedButton,
  Checkbox,
  Info,
} from '@/Components'
import { useTheme } from '@/Theme'
import { useTranslation } from 'react-i18next'
import ChangeTheme from '@/Store/Theme/ChangeTheme'

const IndexExampleContainer = props => {
  const { navigation } = props

  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout, Colors } = useTheme()
  const dispatch = useDispatch()

  const state = useSelector(state => state)

  const [isEnabled, setIsEnabled] = useState(false)

  const changeTheme = ({ theme, darkMode }) => {
    dispatch(ChangeTheme.action({ theme, darkMode }))
    setIsEnabled(!isEnabled)
  }

  const items = [
    { label: 'Awesome', value: 'awesome' },
    { label: 'Stupendous', value: 'stupendous' },
    { label: 'Magnificent', value: 'magnificent' },
  ]

  const answers = ['Yes', 'No']

  const navigateToSettings = () => {
    navigation.navigate('Settings')
  }

  return (
    <ScrollView
      style={[
        Layout.fill,
        Layout.column,
        Gutters.largeHPadding,
        Gutters.largeVPadding,
      ]}
    >
      {/* SectionHeader */}
      {/*<SectionHeader label="Questions" />*/}

      {/*/!* BooleanButtons *!/*/}
      {/*<BooleanButtons answers={answers} label="Am I the man ?" />*/}
      {/*<BooleanButtons*/}
      {/*  answers={answers}*/}
      {/*  label="Am I the warning man ?"*/}
      {/*  warning*/}
      {/*/>*/}
      {/*<BooleanButtons*/}
      {/*  answers={answers}*/}
      {/*  label="Am I the disabled man ?"*/}
      {/*  disabled*/}
      {/*/>*/}

      {/*/!* Select *!/*/}
      {/*<Select items={items} />*/}
      {/*<Select items={items} warning />*/}
      {/*<Select items={items} disabled />*/}

      {/*/!* Square buttons *!/*/}
      <SquareButton
        content="Settings"
        handlePress={navigateToSettings}
        filled
      />
      {/*<View style={{ paddingTop: 10 }}>*/}
      {/*  <SquareButton content="Hello there" filled disabled />*/}
      {/*</View>*/}
      {/*<View style={{ paddingTop: 10 }}>*/}
      {/*  <SquareButton content="General Kenobi" />*/}
      {/*</View>*/}
      {/*<View style={{ paddingTop: 10 }}>*/}
      {/*  <SquareButton content="General Kenobi" disabled />*/}
      {/*</View>*/}

      {/*/!* Rounded buttons *!/*/}
      {/*<View style={{ flexDirection: 'row' }}>*/}
      {/*  <View style={{ paddingTop: 20 }}>*/}
      {/*    <RoundedButton content="Add" icon="add" />*/}
      {/*  </View>*/}
      {/*  <View style={{ paddingTop: 10 }}>*/}
      {/*    <RoundedButton content="Add" icon="add" disabled />*/}
      {/*  </View>*/}
      {/*</View>*/}

      {/*/!* Checkboxes *!/*/}
      {/*<View style={{ paddingTop: 20 }}>*/}
      {/*  <Checkbox content="Unavailable" />*/}
      {/*</View>*/}
      {/*<View style={{ paddingTop: 10 }}>*/}
      {/*  <Checkbox content="Unavailable" disabled />*/}
      {/*</View>*/}

      {/*/!* Dark mode switch *!/*/}
      {/*<View*/}
      {/*  style={{*/}
      {/*    flex: 1,*/}
      {/*    alignItems: 'center',*/}
      {/*    justifyContent: 'center',*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <Text style={{ color: Colors.text }}>Dark mode</Text>*/}
      {/*  <Switch*/}
      {/*    trackColor={{ false: '#767577', true: '#81b0ff' }}*/}
      {/*    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}*/}
      {/*    onValueChange={() =>*/}
      {/*      changeTheme({ theme: 'default', darkMode: !state.theme.darkMode })*/}
      {/*    }*/}
      {/*    value={isEnabled}*/}
      {/*  />*/}
      {/*</View>*/}

      {/*/!*Info button and modal*!/*/}
      {/*<View style={{ paddingTop: 20, paddingBottom: 40 }}>*/}
      {/*  <Info />*/}
      {/*</View>*/}
    </ScrollView>
  )
}

export default IndexExampleContainer
