/**
 * The external imports
 */
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, View, Animated, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'
import uuid from 'react-native-uuid'
import { navigateAndSimpleReset } from '@/Navigators/Root'

/**
 * The internal imports
 */
import {
  SearchBar,
  LoaderList,
  SectionHeader,
  SquareButton,
  MedicalCaseListItem,
  EmptyList,
  Error,
} from '@/Components'
import { useTheme } from '@/Theme'
import { fadeIn } from '@/Theme/Animation'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import CreatePatient from '@/Store/Patient/Create'
import GetAllMedicalCaseDB from '@/Store/DatabaseMedicalCase/GetAll'
import ForceCloseMedicalCaseDB from '@/Store/DatabaseMedicalCase/ForceClose'

const IndexHomeContainer = ({ navigation }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isFocused = useIsFocused()

  const {
    Containers: { home, global },
    Layout,
    Gutters,
    Colors,
  } = useTheme()

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Local state definition
  const [page, setPage] = useState(1)
  const [firstLoading, setFirstLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const algorithm = useSelector(state => state.algorithm.item)
  const healthFacility = useSelector(state => state.healthFacility.item)

  const medicalCases = useSelector(
    state => state.databaseMedicalCase.getAll.item.data,
  )
  const isLastBatch = useSelector(
    state => state.databaseMedicalCase.getAll.item.isLastBatch,
  )
  const medicalCasesLoading = useSelector(
    state => state.databaseMedicalCase.getAll.loading,
  )
  const medicalCasesError = useSelector(
    state => state.databaseMedicalCase.getAll.error,
  )

  const isConnected = useSelector(state => state.network.isConnected)

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  // Reload page if network connection change (client-server to fail safe mode)
  useEffect(() => {
    dispatch(GetAllMedicalCaseDB.action({ page: 1, reset: true }))
    if (firstLoading) {
      setFirstLoading(false)
    }
  }, [isConnected])

  useEffect(() => {
    handleRefresh()
    closeMedicalCase()
  }, [isFocused])

  /**
   * Force close medical case after 12 hours
   */
  const closeMedicalCase = () => {
    dispatch(ForceCloseMedicalCaseDB.action())
  }

  /**
   * Fetch 15 latest medical cases
   */
  const handleRefresh = () => {
    dispatch(GetAllMedicalCaseDB.action({ page: 1, reset: true }))
  }

  /**
   * Load more medical case
   */
  const loadMore = () => {
    if (!isLastBatch) {
      dispatch(GetAllMedicalCaseDB.action({ page: page + 1 }))
      setPage(page + 1)
    }
  }

  /**
   * Create patient without scanning QR code
   */
  const newPatient = async () => {
    setIsLoading(true)
    await dispatch(
      CreatePatient.action({
        patientId: null,
        newMedicalCase: true,
        facility: {
          study_id: String(algorithm.study.id),
          group_id: String(healthFacility.id),
          uid: uuid.v4(),
        },
        otherFacility: {},
      }),
    )
    await dispatch(
      CreateMedicalCase.action({ algorithm, patientId: uuid.v4() }),
    )
    navigateAndSimpleReset('StageWrapper')
    setIsLoading(false)
  }

  return (
    <Animated.View style={[Layout.fill, global.animation(fadeAnim)]}>
      <View style={home.buttonsWrapper}>
        <View style={home.buttonListWrapper}>
          <View style={home.patientListButton}>
            <SquareButton
              label={t('navigation.scan_qr_code')}
              icon="qr-scan"
              big
              onPress={() => navigation.navigate('Scan')}
              filled
            />
          </View>
          <View style={home.consultationsButton}>
            <SquareButton
              label={t('actions.new_patient')}
              icon="add"
              big
              onPress={newPatient}
              filled
              disabled={isLoading}
            />
          </View>
        </View>
        <View style={home.buttonListWrapper}>
          <View style={home.patientListButton}>
            <SquareButton
              label={t('navigation.patient_list')}
              icon="patient-list"
              big
              bgColor={Colors.secondary}
              onPress={() => navigation.navigate('PatientList')}
            />
          </View>
          <View style={home.consultationsButton}>
            <SquareButton
              label={t('navigation.consultations')}
              icon="consultation"
              big
              bgColor={Colors.secondary}
              onPress={() => navigation.navigate('Consultations')}
            />
          </View>
        </View>
      </View>

      <View style={Gutters.regularHMargin}>
        <TouchableOpacity onPress={() => navigation.navigate('Consultations')}>
          <SearchBar navigation={navigation} />
        </TouchableOpacity>
      </View>

      <View style={Gutters.regularHMargin}>
        <SectionHeader label={t('containers.home.title')} />
        {medicalCasesError && <Error message={medicalCasesError.message} />}
      </View>

      {firstLoading ? (
        <LoaderList />
      ) : (
        <FlatList
          data={medicalCases}
          renderItem={({ item }) => <MedicalCaseListItem item={item} />}
          keyExtractor={item => item.id}
          ListEmptyComponent={<EmptyList text={t('application.no_results')} />}
          onRefresh={handleRefresh}
          refreshing={medicalCasesLoading}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
        />
      )}
    </Animated.View>
  )
}

export default IndexHomeContainer
