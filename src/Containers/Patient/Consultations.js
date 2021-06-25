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
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import UpdateNodeFields from '@/Store/MedicalCase/UpdateNodeFields'
import { AddPatientValues } from '@/Services/MedicalCase'

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
  const [refreshing, setRefreshing] = useState(false)

  /**
   * Fetch 15 latest medical cases
   */
  const handleRefresh = () => {
    setRefreshing(true)
    console.log('TODO: handle refresh')
    setTimeout(() => setRefreshing(false), 2 * 1000)
  }

  /**
   * Load more medical case
   */
  const loadMore = () => {
    console.log('TODO: load more')
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
          // TODO empty list
          ListEmptyComponent={<LoaderList />}
          onRefresh={() => handleRefresh()}
          refreshing={refreshing}
          onEndReached={() => loadMore()}
          onEndReachedThreshold={0.1}
        />
      </View>
    </View>
  )
}

export default ConsultationPatientContainer
