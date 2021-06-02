/**
 * The external imports
 */
import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const IndexQuestionInfoContainer = props => {
  const { navigation, nodeId } = props

  const { t } = useTranslation()

  // Theme and style elements deconstruction
  const {
    Containers: { questionInfo },
  } = useTheme()

  const algorithm = useSelector(state => state.algorithm.item)
  const node = algorithm.nodes[nodeId]

  return (
    <View style={questionInfo.wrapper}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={questionInfo.closeButton}
      >
        <Text style={questionInfo.closeButtonText}>{t('actions.continue')}</Text>
      </TouchableOpacity>
      <View style={questionInfo.contentWrapper}>
        <ScrollView>
          {__DEV__ && (
            <Text style={[Fonts.textRegular, { color: Colors.red }]}>
              Node id: {node.id}
            </Text>
          )}
          <SectionHeader label={translate(node.label)} />
          <Text style={[Fonts.textSmall]}>{translate(node.description)}</Text>

          {node.medias.map(media => {
            return <Media key={media.url} media={media} />
          })}
        </ScrollView>
      </View>
    </View>
  )
}

export default IndexQuestionInfoContainer
