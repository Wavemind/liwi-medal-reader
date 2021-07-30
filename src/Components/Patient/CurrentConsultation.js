/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import format from 'date-fns/format'
import { useDispatch } from 'react-redux'
import { isFulfilled } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import { Icon } from '@/Components'
import { useTheme } from '@/Theme'
import { getStages } from '@/Utils/Navigation/GetStages'
import LoadMedicalCase from '@/Store/MedicalCase/Load'

const CurrentConsultation = ({ navigation, consultation }) => {
  const {
    FontSize,
    Layout,
    Gutters,
    Colors,
    Components: { currentConsultation },
  } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()

  // Local state definition
  const [stages] = useState(getStages())
  const [stageIndex] = useState(consultation.advancement.stage)
  const [stepIndex] = useState(consultation.advancement.step)
  // TODO get locked info from client-server
  const [locked, setLocked] = useState(false)

  /**
   * Loads the current medical case in store and navigates to the stage wrapper
   * @returns {Promise<void>}
   */
  const handlePress = async () => {
    const loadMedicalCase = await dispatch(
      LoadMedicalCase.action({ medicalCaseId: consultation.id }),
    )
    if (isFulfilled(loadMedicalCase)) {
      navigation.navigate('StageWrapper', { stageIndex })
    }
  }

  console.log(stages, consultation)
  return (
    <TouchableOpacity style={currentConsultation.wrapper} onPress={handlePress}>
      {locked && (
        <View style={[Layout.column, Gutters.regularRMargin]}>
          <Icon name="lock" size={FontSize.large} color={Colors.red} />
        </View>
      )}
      <View style={currentConsultation.titleWrapper}>
        <Text style={currentConsultation.title}>
          {t(`containers.medical_case.stages.${stages[stageIndex].label}`)}
        </Text>
        <Text style={currentConsultation.subtitle}>
          {t(
            `containers.medical_case.steps.${stages[stageIndex].steps[stepIndex].label}`,
          )}
        </Text>
      </View>
      <View style={currentConsultation.statusWrapper}>
        {stages.map((stage, index) => (
          <View
            key={`consultation-stage-${index}`}
            style={currentConsultation.iconWrapper(index === stageIndex)}
          >
            <Icon
              key={`${currentConsultation.id}-icon-${stage.icon}`}
              name={stage.icon}
              size={FontSize.large}
              style={currentConsultation.icon(index === stageIndex)}
            />
          </View>
        ))}
      </View>
      <Text style={currentConsultation.date}>
        {/* TODO THIS SHIT */}
        {/* {format(consultation.createdAt, 'dd.MM.yyyy')} */}
      </Text>
      <Icon name="right-arrow" size={FontSize.large} />
    </TouchableOpacity>
  )
}

export default CurrentConsultation
