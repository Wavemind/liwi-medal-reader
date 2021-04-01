import React, { useState } from 'react'
import { useTheme } from '@/Theme'
import DropDownPicker from 'react-native-dropdown-picker'

const Select = () => {
  const { Layout, Gutters, Common, Fonts } = useTheme()

  const [awesome, setAwesome] = useState('')

  return (
    <DropDownPicker
      items={[
        { label: 'Awesome', value: 'awesome' },
        { label: 'Stupendous', value: 'stupendous' },
        { label: 'Magnificent', value: 'magnificent' },
      ]}
      defaultValue={awesome}
      containerStyle={{ height: 40, width: 200 }}
      style={[Common.backgroundWhite, { borderBottomRightRadius: 20, borderBottomLeftRadius: 20, borderTopRightRadius: 20, borderTopLeftRadius: 20 }]}
      itemStyle={[Layout.justifyContentStart]}
      dropDownStyle={[Common.backgroundWhite]}
      onChangeItem={item => setAwesome(item.value)}
    />
  )
}

export default Select
