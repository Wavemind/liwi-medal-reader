/**
 * The external imports
 */
import React from 'react'
import { View, Image } from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { hp, wp } from '@/Theme/Responsive'

const PreviewConsentContainer = ({
  route: {
    params: { consent },
  },
}) => {
  const {
    Containers: { consentPreview },
  } = useTheme()

  return (
    <View style={consentPreview.content}>
      <ImageZoom
        minScale={1}
        cropWidth={wp(100)}
        cropHeight={hp(100)}
        imageWidth={wp(98)}
        imageHeight={hp(100)}
        enableCenterFocus={false}
      >
        <Image
          source={{ uri: `data:image/png;base64,${consent}` }}
          style={consentPreview.documentImage}
        />
      </ImageZoom>
    </View>
  )
}

export default PreviewConsentContainer
