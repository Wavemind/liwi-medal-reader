/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { Icon } from '@/Components'
import Dot from '../Dot'
import { useTheme } from '@/Theme'

const Item = ({ stage, index, status }) => {
  const { t } = useTranslation()

  const {
    Components: { medicalCaseDrawer },
    Layout,
    FontSize,
    Gutters,
  } = useTheme()

  const [open, setOpen] = useState(status === 'current')

  return (
    <View style={medicalCaseDrawer.itemWrapper(open, status)}>
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={medicalCaseDrawer.stage(open, status)}
      >
        <Icon
          style={medicalCaseDrawer.mainIcon(status)}
          name={stage.icon}
          size={FontSize.drawerIcon}
        />
        <Text style={medicalCaseDrawer.stageText(status)}>
          {t(`containers.medical_case.stages.${stage.label}`)}
        </Text>
        <Icon
          size={FontSize.regular}
          style={medicalCaseDrawer.checkedIcon(status)}
          name="checked"
        />
      </TouchableOpacity>
      {open && (
        <View style={[medicalCaseDrawer.stepsWrapper]}>
          {stage.steps.map((step, stepIndex) => (
            <View style={Layout.rowCenter}>
              <View style={medicalCaseDrawer.dotWrapper}>
                <Dot thinLines status={status} stepIndex={stepIndex} />
              </View>
              <View style={[Layout.fill, Gutters.regularTPadding]}>
                <Text style={medicalCaseDrawer.stepText(status)}>
                  {t(`containers.medical_case.steps.${step.label}`)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  )
}

export default Item
