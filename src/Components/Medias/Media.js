/**
 * The external imports
 */
import React from 'react'
import { Text } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { Config } from '@/Config'
import { Movie, Audio, Picture } from '@/Components'

const Media = ({ media }) => {
  const { t } = useTranslation()

  const url = media.url.match(/^.*[?]/)[0]

  if (Config.MOVIES_EXTENSION.includes(media.extension)) {
    return <Movie url={url} />
  }
  if (Config.AUDIOS_EXTENSION.includes(media.extension)) {
    return <Audio url={url} />
  }
  if (Config.PICTURES_EXTENSION.includes(media.extension)) {
    return <Picture url={url} />
  }
  return <Text>{t('media:file_not_supported')}</Text>
}

export default Media
