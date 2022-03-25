/**
 * The external imports
 */
import React, { useMemo } from 'react'
import { View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Checkbox, QuestionInfoButton } from '@/Components'
import { translate } from '@/Translations/algorithm'

const AdditionalListItem = ({ item, handlePress, selected }) => {
  // Theme and style elements deconstruction
  const {
    Components: { diagnosisItem },
    Layout,
  } = useTheme()

  const descriptionAvailable = useMemo(
    () => translate(item.description) !== '',
    [item],
  )
  const mediaAvailable = useMemo(() => item.medias?.length > 0, [item])

  return (
    <View style={diagnosisItem.wrapper}>
      <View style={Layout.fill}>
        <Checkbox
          nodeId={item.id}
          label={item.key === 'custom' ? item.label : translate(item.label)}
          onPress={() => handlePress(item)}
          defaultValue={Object.keys(selected).includes(item.id.toString())}
        />
      </View>
      <View style={Layout.rowHCenter}>
        {(descriptionAvailable || mediaAvailable || __DEV__) && (
          <QuestionInfoButton nodeId={item.id} />
        )}
      </View>
    </View>
  )
}

export default AdditionalListItem
