/**
 * The external imports
 */
import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Checkbox, Icon } from '@/Components'
import { translate } from '@/Translations/algorithm'

const DiagnosisItem = ({ item, handlePress }) => {
  // Theme and style elements deconstruction
  const {
    Components: { diagnosisItem },
    Layout,
    Gutters,
    Colors,
    FontSize,
  } = useTheme()
  const dispatch = useDispatch()

  const additionalDiagnosis = useSelector(
    state => state.medicalCase.item.diagnosis.additional,
  )

  return (
    <View style={diagnosisItem.wrapper}>
      <Checkbox
        nodeId={item.id}
        label={translate(item.label)}
        onPress={handlePress}
        defaultValue={additionalDiagnosis.includes(item.id)}
      />
    </View>
  )
}

export default DiagnosisItem
