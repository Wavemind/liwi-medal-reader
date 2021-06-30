/**
 * The external imports
 */
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, FlatList, Animated, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import debounce from 'lodash/debounce'

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
import { GenerateFiltersBadgeObject } from '@/Utils'
import { translate } from '@/Translations/algorithm'
import GetAllPatientDB from '@/Store/DatabasePatient/GetAll'
import ClearFilters from '@/Store/Filters/ClearFilters'
import ChangeFilters from '@/Store/Filters/ChangeFilters'

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

  const nodes = useSelector(state => state.algorithm.item.nodes)
  const patientsFilters = useSelector(state => state.filters.patients)
  const data = GenerateFiltersBadgeObject(patientsFilters)

  const patients = useSelector(state => state.databasePatient.getAll.item.data)
  const isLastBatch = useSelector(
    state => state.databasePatient.getAll.item.isLastBatch,
  )
  const patientsLoading = useSelector(
    state => state.databasePatient.getAll.loading,
  )
  const patientsError = useSelector(state => state.databasePatient.getAll.error)

  // Callback that debounces the search by 500ms
  const debouncedSearch = useCallback(
    debounce(term => {
      dispatch(
        GetAllPatientDB.action({
          page,
          reset: true,
          params: { terms: term, filters: patientsFilters },
        }),
      )
    }, 500),
    [],
  )

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  useEffect(() => {
    dispatch(GetAllPatientDB.action({ page, reset: true }))
    setFirstLoading(false)
  }, [])

  useEffect(() => {
    if (searchTerm === '') {
      dispatch(
        GetAllPatientDB.action({
          page,
          reset: true,
          params: { filters: patientsFilters },
        }),
      )
    } else if (searchTerm.length >= 2) {
      debouncedSearch(searchTerm)
    }
  }, [searchTerm, patientsFilters])

  /**
   * Reset filters and search terms. Fetch 15 latest patients
   */
  const handleRefresh = () => {
    dispatch(
      GetAllPatientDB.action({
        page: 1,
        reset: true,
        params: { filters: patientsFilters },
      }),
    )
    setPage(1)
    setSearchTerm('')
  }

  /**
   * Load more patients
   */
  const loadMore = () => {
    if (!isLastBatch) {
      dispatch(
        GetAllPatientDB.action({
          page: page + 1,
          params: { filters: patientsFilters },
        }),
      )
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
            onPress={() =>
              navigation.navigate('Filters', { source: 'patients' })
            }
          >
            <Icon name="filters" size={FontSize.big} color={Colors.secondary} />
          </TouchableOpacity>
        </View>
        <BadgeBar
          removeBadge={badge =>
            dispatch(ChangeFilters.action({ source: 'patients', item: badge }))
          }
          selected={data}
          badgeComponentLabel={badge =>
            `${translate(nodes[badge.nodeId].label)} : ${translate(
              nodes[badge.nodeId].answers[badge.answerId].label,
            )}`
          }
          showClearAll
          onClearAll={() =>
            dispatch(ClearFilters.action({ source: 'patients' }))
          }
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
      {firstLoading || patientsLoading ? (
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
