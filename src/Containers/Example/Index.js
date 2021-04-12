import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  View,
  Switch,
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import {
  BooleanButtons,
  SectionHeader,
  Select,
  SquareButton,
  RoundedButton,
  Checkbox,
} from '@/Components'
import { useTheme } from '@/Theme'
import FetchOne from '@/Store/User/FetchOne'
import { useTranslation } from 'react-i18next'
import ChangeTheme from '@/Store/Theme/ChangeTheme'

const IndexExampleContainer = () => {
  const { t } = useTranslation()
  const { Common, Fonts, Gutters, Layout, Colors } = useTheme()
  const dispatch = useDispatch()

  const state = useSelector(state => state)
  console.log(state)
  const fetchOneUserLoading = useSelector(state => state.user.fetchOne.loading)
  const fetchOneUserError = useSelector(state => state.user.fetchOne.error)

  const [userId, setUserId] = useState('1')
  const [isEnabled, setIsEnabled] = useState(false)

  const fetch = id => {
    setUserId(id)
    dispatch(FetchOne.action(id))
  }

  const changeTheme = ({ theme, darkMode }) => {
    console.log(theme)
    console.log(darkMode)
    dispatch(ChangeTheme.action({ theme, darkMode }))
    setIsEnabled(!isEnabled)
  }

  const items = [
    { label: 'Awesome', value: 'awesome' },
    { label: 'Stupendous', value: 'stupendous' },
    { label: 'Magnificent', value: 'magnificent' },
  ]

  const answers = ['Yes', 'No']

  return (
    <View style={[Layout.fill, Layout.colCenter, Gutters.largeHPadding]}>
      {/* SectionHeader */}
      <SectionHeader label="Questions" />

      {/* BooleanButtons */}
      <BooleanButtons answers={answers} label="Am I the man ?" />

      {/* Select */}
      <Select items={items} />

      {/* Square buttons */}
      <SquareButton content="Hello there" filled />
      <View style={{ paddingTop: 10 }}>
        <SquareButton content="Hello there" filled disabled />
      </View>
      <View style={{ paddingTop: 10 }}>
        <SquareButton content="General Kenobi" />
      </View>
      <View style={{ paddingTop: 10 }}>
        <SquareButton content="General Kenobi" disabled />
      </View>

      {/* Rounded buttons */}
      <View style={{ paddingTop: 20 }}>
        <RoundedButton content="Add" icon="add" />
      </View>
      <View style={{ paddingTop: 10 }}>
        <RoundedButton content="Add" icon="add" disabled />
      </View>

      {/* Checkboxes */}
      <View style={{ paddingTop: 20 }}>
        <Checkbox content="Unavailable" />
      </View>
      <View style={{ paddingTop: 10 }}>
        <Checkbox content="Unavailable" disabled />
      </View>

      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: Colors.text }}>Dark mode</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          onValueChange={() => changeTheme({ theme: 'default', darkMode: !state.theme.darkMode })}
          value={isEnabled}
        />
      </View>
    </View>
  )
}

export default IndexExampleContainer
