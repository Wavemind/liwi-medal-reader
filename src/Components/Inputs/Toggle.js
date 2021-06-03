/**
 * The external imports
 */
import React, { useState } from 'react'
import { Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import Toggle from 'react-native-toggle-element'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { wp } from '@/Theme/Responsive'
import { Icon } from '@/Components'

const ToggleComplaintCategory = ({ question, disabled = false }) => {
  // Theme and style elements deconstruction
  const {
    Components: { toggleComplaintCategory },
    Colors,
  } = useTheme()
  const { t } = useTranslation()

  const [toggleValue, setToggleValue] = useState(false)

  return (
    <Toggle
      value={toggleValue}
      onPress={newState => setToggleValue(newState)}
      leftComponent={
        <Text style={toggleComplaintCategory.leftText(toggleValue)}>
          {t('answers.yes')}
        </Text>
      }
      rightComponent={
        toggleValue ? (
          <Icon name="validate" color={Colors.primary} />
        ) : (
          <Text style={toggleComplaintCategory.rightText}>
            {t('answers.no')}
          </Text>
        )
      }
      trackBarStyle={toggleComplaintCategory.trackBarStyle}
      trackBar={{
        activeBackgroundColor: Colors.primary,
        inActiveBackgroundColor: Colors.secondary,
        borderWidth: 1,
        width: wp(19),
      }}
      thumbButton={{
        activeBackgroundColor: Colors.secondary,
        inActiveBackgroundColor: Colors.primary,
      }}
    />
  )
}

export default ToggleComplaintCategory
