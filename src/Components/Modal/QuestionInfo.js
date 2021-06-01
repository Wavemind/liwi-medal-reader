/**
 * The external imports
 */
import React from 'react'
import { ScrollView, Text } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'
import { SectionHeader } from '@/Components'

const QuestionInfo = ({ nodeId }) => {
  const { Fonts, Colors } = useTheme()

  const algorithm = useSelector(state => state.algorithm.item)
  const node = algorithm.nodes[nodeId]

  return (
    <ScrollView>
      <SectionHeader label={translate(node.label)} />
      <Text style={[Fonts.textSmall]}>{translate(node.description)}</Text>
      
      {node.medias.map(media => {
        return <Media key={media.url} media={media} />
      })}

      {__DEV__ && (
        <Text style={[Fonts.textRegular, { color: Colors.red }]}>
          Node id: {node.id}
        </Text>
      )}
    </ScrollView>
  )
}

export default QuestionInfo
