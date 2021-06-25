/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, FlatList, Text } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import orderBy from 'lodash/orderBy'
import { isFulfilled } from '@reduxjs/toolkit'

/**
 * The internal imports
 */
import {
  SectionHeader,
  SquareButton,
  ConsultationListItem,
  CurrentConsultation,
  Icon,
  EmptyList,
} from '@/Components'
import { useTheme } from '@/Theme'
import { transformPatientValues } from '@/Utils/MedicalCase'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import UpdateNodeFields from '@/Store/MedicalCase/UpdateNodeFields'
import LoadPatient from '@/Store/Patient/Load'

const ConsultationPatientContainer = ({ navigation }) => {
  const {
    Gutters,
    FontSize,
    Colors,
    Containers: { patientConsultations },
    Components: { question },
  } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const algorithm = useSelector(state => state.algorithm.item)
  const patient = useSelector(state => state.patient.item)
  const patientLoading = useSelector(state => state.patient.load.loading)
  const patientLoadError = useSelector(state => state.patient.load.error)
  const mcCreateError = useSelector(state => state.medicalCase.create.error)

  // Local state definition
  const [currentConsultation] = useState(
    patient.medicalCases.find(medicalCase => medicalCase.closedAt === 0),
  )
  const [closedCases] = useState(
    orderBy(
      patient.medicalCases.filter(medicalCase => medicalCase.closedAt > 0),
      medicalCase => medicalCase.createdAt,
      ['desc'],
    ),
  )

  /**
   * Fetch 15 latest medical cases
   */
  const handleRefresh = async () => {
    await dispatch(LoadPatient.action({ patientId: patient.id }))
  }

  /**
   * Creates a new medical case for this patient and navigates to the stageWrapper
   * @returns {Promise<void>}
   */
  const handleAddConsultation = async () => {
    const createMedicalCase = await dispatch(
      CreateMedicalCase.action({ algorithm, patientId: patient.id }),
    )
    if (isFulfilled(createMedicalCase)) {
      const patientValueNodes = transformPatientValues()
      await dispatch(UpdateNodeFields.action({ toUpdate: patientValueNodes }))
      navigation.navigate('StageWrapper')
    }
  }

  return (
    <View style={patientConsultations.sectionWrapper}>
      {currentConsultation ? (
        <View>
          <SectionHeader
            label={t('containers.patient.consultations.current_consultation')}
          />
          <CurrentConsultation
            navigation={navigation}
            consultation={currentConsultation}
          />
        </View>
      ) : (
        <>
          <SquareButton
            label={t('actions.new_medical_case')}
            icon="add"
            onPress={handleAddConsultation}
          />
          {mcCreateError && (
            <View style={[question.messageWrapper('error')]}>
              <Icon
                size={FontSize.regular}
                color={Colors.secondary}
                name="warning"
              />
              <Text style={question.message}>{mcCreateError}</Text>
            </View>
          )}
        </>
      )}
      <View style={Gutters.largeTMargin}>
        <SectionHeader
          label={t('containers.patient.consultations.last_consultations')}
        />
        {patientLoadError ? (
          <View style={[question.messageWrapper('error')]}>
            <Icon
              size={FontSize.regular}
              color={Colors.secondary}
              name="warning"
            />
            <Text style={question.message}>{patientLoadError}</Text>
          </View>
        ) : (
          <FlatList
            data={closedCases}
            renderItem={({ item }) => <ConsultationListItem item={item} />}
            keyExtractor={item => `consultation-${item.id}`}
            ListEmptyComponent={
              <EmptyList text={t('application.no_results')} />
            }
            onRefresh={() => handleRefresh()}
            refreshing={patientLoading}
          />
        )}
      </View>
    </View>
  )
}

export default ConsultationPatientContainer
