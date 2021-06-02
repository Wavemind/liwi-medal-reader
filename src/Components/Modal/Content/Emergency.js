/**
 * The external imports
 */
import React from 'react'
import { View, Text } from 'react-native'

/**
 * The internal imports
 */
import SquareButton from '../../Buttons/SquareButton'
import { useTheme } from '@/Theme'
import { navigate } from '@/Navigators/Root'
import ToggleVisbility from "@/Store/Modal/ToggleVisibility";
import {useDispatch} from "react-redux";

const Emergency = () => {
  // Theme and style elements deconstruction
  const {
    Colors,
    Components: { modal },
  } = useTheme()

  const dispatch = useDispatch()

  const handleOnPress = async () => {
    await dispatch(ToggleVisbility.action({}))
    navigate('Emergency')
  }

  return (
    <View>
      <Text style={modal.header}>Emergency Assistance</Text>
      <Text style={modal.body}>
        The patient is presenting a severe/emergency symptom or sign. Click on the emergency button if the child needs emergency care now.
      </Text>

      <View style={modal.buttonWrapper}>
        <SquareButton
          label="GO TO EMERGENCY"
          filled
          onPress={handleOnPress}
          bgColor={Colors.red}
          fullWidth={false}
        />
      </View>
    </View>
  )
}

export default Emergency
