/**
 * The external imports
 */
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, View, Animated } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import uuid from 'react-native-uuid'

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
import { Config } from '@/Config'
import CreateMedicalCase from '@/Store/MedicalCase/Create'
import CreatePatient from '@/Store/Patient/Create'
import GetAllMedicalCaseDB from '@/Store/Database/MedicalCase/GetAll'

const IndexHomeContainer = ({ navigation }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const dispatch = useDispatch()

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

  const algorithm = useSelector(state => state.algorithm.item)
  const data = useSelector(state => state.database.medicalCase.getAll.item.data)
  const isLastBatch = useSelector(
    state => state.database.medicalCase.getAll.item.isLastBatch,
  )
  const dataLoading = useSelector(
    state => state.database.medicalCase.getAll.loading,
  )
  const dataError = useSelector(
    state => state.database.medicalCase.getAll.error,
  )

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  useEffect(() => {
    dispatch(GetAllMedicalCaseDB.action({ page }))
  }, [])

  /**
   * Fetch 15 latest medical cases
   */
  const handleRefresh = () => {
    dispatch(GetAllMedicalCaseDB.action({ page: 1 }))
  }

  /**
   * Load more medical case
   */
  const loadMore = () => {
    // TODO: avoid here on first render
    if (!isLastBatch) {
      console.log('je rentre ?')
      dispatch(GetAllMedicalCaseDB.action({ page: page + 1 }))
      setPage(page + 1)
    }
  }
  console.log('je render')
  return (
    <Animated.View style={[Layout.fill, global.animation(fadeAnim)]}>
      <View style={home.buttonsWrapper}>
        <View style={home.buttonListWrapper}>
          <View style={home.scanButton}>
            <SquareButton
              label={t('navigation.scan_qr_code')}
              icon="qr-scan"
              big
              onPress={() => navigation.navigate('Scan')}
              filled
            />
          </View>
          {__DEV__ && (
            <View style={home.consultationsButton}>
              <SquareButton
                label={t('actions.new_patient')}
                icon="add"
                big
                onPress={async () => {
                  await dispatch(CreateMedicalCase.action({ algorithm }))
                  await dispatch(
                    CreatePatient.action({
                      idPatient: null,
                      newMedicalCase: true,
                      facility: {
                        study_id: 'Dynamic Tanzania',
                        group_id: '7',
                        uid: uuid.v4(),
                      },
                      otherFacility: {},
                    }),
                  )
                  navigation.navigate('StageWrapper')
                }}
                filled
              />
            </View>
          )}
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

      <SearchBar navigation={navigation} />

      <View style={Gutters.regularHMargin}>
        <SectionHeader label={t('containers.home.title')} />
        {dataError && <Error message={dataError.message} />}
      </View>

      {dataLoading ? (
        <LoaderList />
      ) : (
        <FlatList
          data={data}
          renderItem={({ item }) => <MedicalCaseListItem item={item} />}
          keyExtractor={item => item.id}
          ListEmptyComponent={<EmptyList />}
          onRefresh={handleRefresh}
          refreshing={dataLoading}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
        />
      )}
    </Animated.View>
  )
}

export default IndexHomeContainer
