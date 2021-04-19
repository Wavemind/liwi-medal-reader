/**
 * The external imports
 */
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { navigate } from '@/Navigators/Root'

const Info = () => {
  // Theme and style elements deconstruction
  const {
    Components: { info },
  } = useTheme()

  const openInfoModal = () => {
    navigate('InfoModal', {})
  }

  return (
    <TouchableOpacity style={info.outerCircle} onPress={() => openInfoModal()}>
      <Text style={info.innerText}>i</Text>
    </TouchableOpacity>
  )
}

export default Info
