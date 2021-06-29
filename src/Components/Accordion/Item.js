/**
 * The external imports
 */
import React from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Checkbox } from '@/Components'
import ChangeFilters from '@/Store/Filters/ChangeFilters'

const Item = ({ item, list }) => {
  // Theme and style elements deconstruction
  const {
    Components: { accordionItem },
  } = useTheme()

  const dispatch = useDispatch()
  const currentFilter = useSelector(state => state.filters[list][item.nodeId])

  return (
    <View style={accordionItem.wrapper}>
      <Checkbox
        label={item.answerLabel}
        defaultValue={
          currentFilter !== undefined && currentFilter.includes(item.answerId)
        }
        onPress={() => dispatch(ChangeFilters.action({ list, item }))}
      />
    </View>
  )
}

export default Item
