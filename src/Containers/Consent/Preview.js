/**
 * The external imports
 */
import React from 'react'
import { View, Image } from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { hp, wp } from '@/Theme/Responsive'
import { SquareButton } from '@/Components'
import UpdateField from '@/Store/Patient/UpdateField'

const PreviewConsentContainer = ({
  route: {
    params: { consent, retake = false },
  },
}) => {
  const {
    Containers: { consentPreview },
    Layout,
  } = useTheme()

  const navigation = useNavigation()
  const dispatch = useDispatch()

  /**
   * Will store the consent file in the patient store
   */
  const validatePicture = async () => {
    await dispatch(
      UpdateField.action({ field: 'consent_file', consentFile: consent }),
    )
    navigation.navigate('Home')
  }

  return (
    <View style={consentPreview.content}>
      <View style={Layout.fill}>
        <ImageZoom
          minScale={1}
          cropWidth={wp(100)}
          cropHeight={hp(90)}
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
      {retake ? (
        <View style={consentPreview.buttonsWrapper}>
          <View style={consentPreview.button}>
            <SquareButton onPress={() => navigation.goBack()} icon="refresh" />
          </View>
          <View style={consentPreview.button}>
            <SquareButton onPress={validatePicture} icon="validate" filled />
          </View>
        </View>
      ) : (
        <View style={consentPreview.buttonsWrapper}>
          <View style={consentPreview.button}>
            <SquareButton
              onPress={() => navigation.goBack()}
              icon="left-arrow"
              filled
            />
          </View>
        </View>
      )}
    </View>
  )
}

export default PreviewConsentContainer
