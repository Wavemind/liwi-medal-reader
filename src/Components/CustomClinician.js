/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon, SquareButton, SquareSelect } from '@/Components'
import { hp } from '@/Theme/Responsive'

const CustomClinician = ({ handleClinician }) => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Fonts,
    Colors,
    Gutters,
    Components: { customClinician },
  } = useTheme()

  // Props deconstruction
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)
  const [height, setHeight] = useState(0)
  const [currentClinician, setCurrentClinician] = useState({
    first_name: '',
    last_name: '',
    role: '',
  })

  const roles = useSelector(
    state => state.healthFacility.item.medical_staff_roles,
  )

  /**
   * Open or close accordion
   */
  const toggleAccordion = () => {
    let newHeight = 0

    setOpen(prev => !prev)

    if (!open) {
      newHeight = 2 * hp(12.5)
    }

    setHeight(newHeight)
  }

  const items = roles.map(role => ({
    value: role,
    label: t(`health_facility.roles.${role}`),
  }))

  /**
   * Updates the currentClinician in the local state
   * @param field
   * @param value
   */
  const updateCurrentClinician = (field, value) => {
    setCurrentClinician(prevState => ({
      ...prevState,
      [field]: value,
    }))
  }

  /**
   * Updates the role in the local state
   * @param value
   */
  const updateRole = value => {
    updateCurrentClinician('role', value)
  }

  return (
    <>
      <TouchableOpacity
        style={customClinician.buttonWrapper(open)}
        onPress={toggleAccordion}
      >
        <View style={Layout.row}>
          <View style={[Layout.fill, Layout.alignItemStart]}>
            <Text style={[Fonts.textColorSecondary, Fonts.titleRegular]}>
              {t('health_facility.custom_clinician')}
            </Text>
            <Text style={[Fonts.textColorSecondary, Fonts.textTiny]}>
              {t('health_facility.custom_clinician_subtitle')}
            </Text>
          </View>
          <View style={Layout.selfCenter}>
            <Icon
              name={open ? 'down-arrow' : 'right-arrow'}
              color={Colors.secondary}
            />
          </View>
        </View>
      </TouchableOpacity>
      <View style={customClinician.contentWrapper(open, height)}>
        <View style={[Gutters.regularVPadding, Gutters.smallHPadding]}>
          <View style={customClinician.inputWrapper}>
            <TextInput
              style={customClinician.inputText}
              keyboardType="default"
              onChangeText={value =>
                updateCurrentClinician('first_name', value)
              }
              value={currentClinician.first_name}
              placeholder={t('patient.first_name')}
            />
          </View>
          <View style={customClinician.inputWrapper}>
            <TextInput
              style={customClinician.inputText}
              keyboardType="default"
              onChangeText={value => updateCurrentClinician('last_name', value)}
              value={currentClinician.last_name}
              placeholder={t('patient.last_name')}
            />
          </View>
          <View style={customClinician.selectWrapper}>
            <SquareSelect
              items={items}
              handleOnSelect={updateRole}
              prompt={t('health_facility.roles.title')}
              value={currentClinician.role}
              withBorder={true}
              pickerGrow={true}
              fullWidth={false}
            />
            <View style={Gutters.regularLMargin}>
              <SquareButton
                label={t('actions.save')}
                onPress={() => handleClinician(currentClinician)}
                fullWidth={false}
                filled
              />
            </View>
          </View>
        </View>
      </View>
    </>
  )
}

export default CustomClinician
