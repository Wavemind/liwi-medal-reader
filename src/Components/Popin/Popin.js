/**
 * The external imports
 */
import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Modal from 'react-native-modal'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'
import ToggleVisbility from '@/Store/Modal/ToggleVisibility'
import EmergencyPopin from './Content/EmergencyPopin'
import ListItemPopin from './Content/ListItemPopin'

const Popin = () => {
  // Theme and style elements deconstruction
  const {
    Components: { popin },
  } = useTheme()

  const dispatch = useDispatch()
  const { visible, type } = useSelector(state => state.modal)

  /**
   * Closes the modal window
   * @returns {Promise<void>}
   */
  const closeModal = async () => {
    await dispatch(ToggleVisbility.action({}))
  }

  /**
   * Defines the modal body based on the modal type
   * @returns {JSX.Element|null}
   */
  const renderModalBody = () => {
    switch (type) {
      case 'emergency':
        return <EmergencyPopin />
      case 'other':
        return <ListItemPopin />
      default:
        return null
    }
  }

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={closeModal}
      hideModalContentWhileAnimating
    >
      <View style={popin.wrapper}>
        <TouchableOpacity onPress={closeModal} style={popin.closeButton}>
          <Icon name="close" />
        </TouchableOpacity>
        {renderModalBody()}
      </View>
    </Modal>
  )
}

export default Popin
