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

  // 1 PATIENT
  // Rajouter bouton apply filters
  // Rajouter bouton reset filters
  // Récupérer les valeurs dans le parent et activer les filtres

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
