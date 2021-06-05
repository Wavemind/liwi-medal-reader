/**
 * The external imports
 */
import React from 'react'
import { Image } from 'react-native'
import Lightbox from 'react-native-lightbox-v2'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'

const Picture = ({ url }) => {
  // Theme and style elements deconstruction
  const {
    Components: { picture },
    Gutters,
  } = useTheme()

  return (
    <Lightbox style={Gutters.regularTMargin}>
      <Image
        style={picture.wrapper}
        resizeMode="center"
        source={{
          uri: url,
        }}
      />
    </Lightbox>
  )
}

export default Picture
