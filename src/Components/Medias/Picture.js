/**
 * The external imports
 */
import React, { useState } from 'react'
import { Image, View, TouchableOpacity } from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import Modal from 'react-native-modal'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { hp, wp } from '@/Theme/Responsive'
import { Icon } from '@/Components'

const Picture = ({ url }) => {
  // Theme and style elements deconstruction
  const {
    Components: { picture },
    Gutters,
    Layout,
    FontSize,
    Colors,
  } = useTheme()

  const [modalVisible, setModalVisible] = useState(false)

  return (
    <View style={Gutters.regularTMargin}>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="down"
        style={picture.modal}
      >
        <View style={[Layout.fill]}>
          <TouchableOpacity
            style={[Gutters.regularHPadding, Gutters.regularVPadding]}
            onPress={() => setModalVisible(false)}
          >
            <Icon name="close" size={FontSize.huge} color={Colors.white} />
          </TouchableOpacity>
          <ImageZoom
            cropWidth={wp(100)}
            cropHeight={hp(100)}
            imageWidth={wp(100)}
            imageHeight={hp(100)}
          >
            <Image
              style={picture.image}
              resizeMode="center"
              source={{
                uri: url,
              }}
            />
          </ImageZoom>
        </View>
      </Modal>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          style={picture.wrapper}
          source={{
            uri: url,
          }}
        />
      </TouchableOpacity>
    </View>
  )
}

export default Picture
