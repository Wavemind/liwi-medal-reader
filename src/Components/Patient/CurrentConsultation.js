/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import format from 'date-fns/format'

/**
 * The internal imports
 */
import { Icon } from '@/Components'
import { useTheme } from '@/Theme'
import { getStages } from '@/Utils/Navigation/GetStages'

const CurrentConsultation = ({ navigation, consultation }) => {
  const {
    FontSize,
    Fonts,
    Components: { currentConsultation },
  } = useTheme()

  const { t } = useTranslation()

  // Local state definition
  const [stages] = useState(getStages())
  const [stageIndex] = useState(consultation.advancement.stage)
  const [stepIndex] = useState(consultation.advancement.step)

  return (
    <TouchableOpacity
      style={currentConsultation.wrapper}
      onPress={() => navigation.navigate('StageWrapper', { stageIndex })}
    >
      <View style={currentConsultation.titleWrapper}>
        <Text style={currentConsultation.title}>
          {t(`containers.medical_case.stages.${stages[stageIndex].label}`)}
        </Text>
        <Text style={currentConsultation.subtitle}>
          {t(`containers.medical_case.steps.${stages[stageIndex].steps[stepIndex].label}`)}
        </Text>
      </View>
      <View style={currentConsultation.statusWrapper}>
        {stages.map((stage, index) => {
          const active = index === stageIndex
          return (
            <View style={currentConsultation.iconWrapper(active)}>
              <Icon
                key={`${currentConsultation.id}-icon-${stage.icon}`}
                name={stage.icon}
                size={FontSize.large}
                style={currentConsultation.icon(active)}
              />
            </View>
          )
        })}
      </View>
      <Text style={Fonts.textTiny}>
        {format(consultation.createdAt, 'dd.MM.yyyy')}
      </Text>
      <Icon name="right-arrow" size={FontSize.large} />
    </TouchableOpacity>
  )
}

export default CurrentConsultation
