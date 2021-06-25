/**
 * The external imports
 */
import React, { useState } from 'react'
import { View, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import orderBy from 'lodash/orderBy'

/**
 * The internal imports
 */
import {
  SectionHeader,
  SquareButton,
  LoaderList,
  ConsultationListItem,
  CurrentConsultation,
} from '@/Components'
import { useTheme } from '@/Theme'
import { AddPatientValues } from '@/Services/MedicalCase'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import UpdateNodeFields from '@/Store/MedicalCase/UpdateNodeFields'
import LoadPatient from '@/Store/Patient/Load'

const ConsultationPatientContainer = ({ navigation }) => {
  const {
    Gutters,
    Containers: { patientConsultations },
    Components: {},
  } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const algorithm = useSelector(state => state.algorithm.item)
  const patient = useSelector(state => state.patient.item)
  const patientLoading = useSelector(state => state.patient.load.loading)

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
    await dispatch(
      CreateMedicalCase.action({ algorithm, patientId: patient.id }),
    )
    const patientValues = AddPatientValues()
    await dispatch(UpdateNodeFields.action({ toUpdate: patientValues }))

    navigation.navigate('StageWrapper')
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
        <SquareButton
          label={t('actions.new_medical_case')}
          icon="add"
          onPress={handleAddConsultation}
        />
      )}
      <View style={Gutters.largeTMargin}>
        <SectionHeader
          label={t('containers.patient.consultations.last_consultations')}
        />
        <FlatList
          data={closedCases}
          renderItem={({ item }) => <ConsultationListItem item={item} />}
          keyExtractor={item => item.id}
          ListEmptyComponent={<LoaderList />}
          onRefresh={() => handleRefresh()}
          refreshing={patientLoading}
        />
      </View>
    </View>
  )
}

export default ConsultationPatientContainer
