/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, Text, VirtualizedList, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import * as _ from 'lodash'

/**
 * The internal imports
 */
import {
  SearchBar,
  LoaderList,
  SectionHeader,
  SquareButton,
  MedicalCaseListItem,
  Boolean,
} from '@/Components'
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'
import { Config } from '@/Config'

const RegistrationMedicalCaseContainer = props => {
  // Theme and style elements deconstruction
  const { navigation } = props
  const { t } = useTranslation()
  const {
    Containers: { home, global },
    Layout,
    Gutters,
    Colors,
  } = useTheme()

  const algorithm = useSelector(state => state.algorithm.item)

  const questions = _.filter(algorithm.nodes, { category: 'physical_exam' })

  return (
    <View style={[Gutters.regularHMargin, Gutters.regularTMargin]}>
      <FlatList
        data={questions}
        renderItem={({ item }) => {
          switch (item.display_format) {
            case Config.DISPLAY_FORMAT.radioButton:
              return <Boolean question={item} />
            // case Config.DISPLAY_FORMAT.input:
            //   return <Numeric question={item} />
            // case Config.DISPLAY_FORMAT.string:
            //   return <String question={item} />
            // case Config.DISPLAY_FORMAT.date:
            //   return <Date question={item} />
            // case Config.DISPLAY_FORMAT.dropDownList:
            //   return <List question={item} />
            // case Config.DISPLAY_FORMAT.reference:
            // case Config.DISPLAY_FORMAT.formula:
            //   return <Formula question={item} />
            default:
              return <Text>{translate(item.label)}</Text>
          }
        }}
        keyExtractor={item => item.id}
      />
    </View>
  )
}

export default RegistrationMedicalCaseContainer
