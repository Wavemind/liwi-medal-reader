/**
 * The external imports
 */
import React from 'react'
import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'
import { SectionHeader, Media } from '@/Components'

const IndexQuestionInfoContainer = ({
  navigation,
  route: {
    params: { nodeId },
  },
}) => {
  const { t } = useTranslation()

  // Theme and style elements deconstruction
  const {
    Fonts,
    Colors,
    Containers: { questionInfo },
  } = useTheme()

  const node = useSelector(state => state.algorithm.item.nodes[nodeId])

  return (
    <View style={questionInfo.wrapper}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={questionInfo.closeButton}
      >
        <Text style={questionInfo.closeButtonText}>
          {t('actions.continue')}
        </Text>
      </TouchableOpacity>
      <View style={questionInfo.contentWrapper}>
        <ScrollView>
          {__DEV__ && (
            <Text style={[Fonts.textRegular, { color: Colors.red }]}>
              Node id: {nodeId}
            </Text>
          )}
          <SectionHeader label={translate(node.label)} />
          <Text style={[Fonts.textSmall]}>{translate(node.description)}</Text>

          {node.medias?.map(media => {
            return <Media key={media.url} media={media} />
          })}
        </ScrollView>
      </View>
    </View>
  )
}

export default IndexQuestionInfoContainer
