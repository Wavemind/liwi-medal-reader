/**
 * The external imports
 */
import React from 'react'
import { Text } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal importsN
 */
import { translate } from '@/Translations/algorithm'
import {
  Boolean,
  Select,
  Numeric,
  String,
  Toggle,
  Autocomplete,
  DatePicker,
} from '@/Components'
import { Config } from '@/Config'

const Factory = ({ questionId }) => {
  // Get node from algorithm
  const currentNode = useSelector(
    state => state.algorithm.item.nodes[questionId],
  )

  switch (currentNode.display_format) {
    case Config.DISPLAY_FORMAT.radioButton:
      if (currentNode.category === Config.CATEGORIES.complaintCategory) {
        return <Toggle questionId={questionId} />
      }
      return <Boolean questionId={questionId} />
    case Config.DISPLAY_FORMAT.input:
      return <Numeric questionId={questionId} />
    case Config.DISPLAY_FORMAT.string:
      return <String questionId={questionId} />
    case Config.DISPLAY_FORMAT.autocomplete:
      return <Autocomplete questionId={questionId} />
    case Config.DISPLAY_FORMAT.dropDownList:
      return <Select questionId={questionId} />
    case Config.DISPLAY_FORMAT.reference:
    case Config.DISPLAY_FORMAT.formula:
      return <String questionId={questionId} editable={false} />
    case Config.DISPLAY_FORMAT.date:
      return <DatePicker questionId={questionId} />
    default:
      return <Text>{translate(currentNode.label)}</Text>
  }
}

export default Factory
