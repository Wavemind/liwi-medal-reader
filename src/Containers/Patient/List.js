/**
 * The external imports
 */
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, FlatList, Animated, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import {
  Autosuggest,
  PatientListItem,
  BadgeBar,
  LoaderList,
  EmptyList,
  Icon,
  Error,
} from '@/Components'
import { useTheme } from '@/Theme'
import { fadeIn } from '@/Theme/Animation'
import GetAllPatientDB from '@/Store/DatabasePatient/GetAll'

const ListPatientContainer = props => {
  // Theme and style elements deconstruction
  const { navigation } = props

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const {
    Layout,
    Gutters,
    FontSize,
    Colors,
    Containers: { patientList, global },
    Components: { searchBar },
  } = useTheme()

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Local state definition
  const [page, setPage] = useState(1)
  const [firstLoading, setFirstLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPatients, setCurrentPatients] = useState([])
  const [filters, setFilters] = useState([
    { filterBy: 'Gender', value: 'Female' },
    { filterBy: 'Age', value: '12' },
  ])

  const patients = useSelector(state => state.databasePatient.getAll.item.data)
  const isLastBatch = useSelector(
    state => state.databasePatient.getAll.item.isLastBatch,
  )
  const patientsLoading = useSelector(
    state => state.databasePatient.getAll.loading,
  )
  const patientsError = useSelector(state => state.databasePatient.getAll.error)

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  useEffect(() => {
    dispatch(GetAllPatientDB.action({ page, reset: true }))
    setFirstLoading(false)
    setCurrentPatients(patients)
  }, [])

  useEffect(() => {
    console.log(searchTerm)
    setCurrentPatients(
      searchTerm === ''
        ? patients
        : currentPatients.filter(
            patient =>
              patient.first_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              patient.last_name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()),
          ),
    )
  }, [searchTerm])

  const resetFilters = () => {
    setSearchTerm('')
    setFilters([])
  }

  /**
   * Reset filters and search terms. Fetch 15 latest patients
   */
  const handleRefresh = () => {
    dispatch(GetAllPatientDB.action({ page: 1, reset: true }))
    setPage(1)
    resetFilters()
  }

  /**
   * Load more patients
   */
  const loadMore = () => {
    if (!isLastBatch) {
      dispatch(GetAllPatientDB.action({ page: page + 1 }))
      setPage(page + 1)
    }
  }

  return (
    <Animated.View style={[Layout.fill, global.animation(fadeAnim)]}>
      <View style={[Gutters.regularHMargin, Gutters.smallVMargin]}>
        {patientsError && <Error message={patientsError.message} />}
      </View>
      <View style={Gutters.regularHMargin}>
        <View style={Layout.row}>
          <View style={[Layout.grow, Gutters.smallRMargin]}>
            <Autosuggest
              searchTerm={searchTerm}
              setSearchTerm={filterString => {
                setSearchTerm(filterString)
              }}
              handleReset={() => setSearchTerm('')}
            />
          </View>
          <TouchableOpacity
            style={searchBar.filterButton}
            onPress={() => navigation.push('Filters')}
          >
            <Icon name="filters" size={FontSize.big} color={Colors.secondary} />
          </TouchableOpacity>
        </View>
        <BadgeBar
          removeBadge={badge => {
            const index = filters.indexOf(badge)
            setFilters(filters.filter((_, i) => i !== index))
            console.log('TODO Remove selected badge', badge)
          }}
          selected={filters}
          badgeComponentLabel={item => `${item.filterBy} : ${item.value}`}
          showClearAll
          onClearAll={() => setFilters([])}
        />
      </View>

      <View style={patientList.headerTable}>
        <Text style={patientList.headerName}>
          {t('containers.patient.list.name')}
        </Text>
        <Text style={patientList.headerLastVisit}>
          {t('containers.patient.list.last_visit')}
        </Text>
        <Text style={patientList.headerStatus}>
          {t('containers.patient.list.status')}
        </Text>
      </View>
      {firstLoading ? (
        <LoaderList />
      ) : (
        <FlatList
          data={patients}
          renderItem={({ item }) => <PatientListItem item={item} />}
          keyExtractor={item => `patient-${item.id}`}
          ListEmptyComponent={<EmptyList text={t('application.no_results')} />}
          onRefresh={handleRefresh}
          refreshing={patientsLoading}
          onEndReached={loadMore}
          onEndReachedThreshold={0.1}
        />
      )}
    </Animated.View>
  )
}

export default ListPatientContainer
