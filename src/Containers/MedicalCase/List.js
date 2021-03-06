/**
 * The external imports
 */
import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Animated, View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import debounce from 'lodash/debounce'

/**
 * The internal imports
 */
import {
  MedicalCaseListItem,
  LoaderList,
  BadgeBar,
  Autosuggest,
  Icon,
  Error,
  EmptyList,
} from '@/Components'
import { fadeIn } from '@/Theme/Animation'
import { useTheme } from '@/Theme'
import { translate } from '@/Translations/algorithm'
import { GenerateFiltersBadgeObject } from '@/Utils'
import GetAllMedicalCasesDB from '@/Store/DatabaseMedicalCase/GetAll'
import ClearFilters from '@/Store/Filters/ClearFilters'
import ChangeFilters from '@/Store/Filters/ChangeFilters'

const ListMedicalCaseContainer = ({ navigation }) => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Fonts,
    Gutters,
    FontSize,
    Colors,
    Components: { searchBar },
    Containers: { medicalCaseList, global },
  } = useTheme()

  const { t } = useTranslation()
  const dispatch = useDispatch()

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Local state definition
  const [page, setPage] = useState(1)
  const [firstLoading, setFirstLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const nodes = useSelector(state => state.algorithm.item.nodes)
  const medicalCasesFilters = useSelector(state => state.filters.medicalCases)
  const data = GenerateFiltersBadgeObject(medicalCasesFilters)
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

  // Callback that debounces the search by 500ms
  const debouncedSearch = useCallback(
    debounce(term => {
      dispatch(
        GetAllMedicalCasesDB.action({
          page,
          reset: true,
          params: { terms: term, filters: medicalCasesFilters },
        }),
      )
    }, 500),
    [],
  )

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  // Reload page if network connection change (client-server to fail safe mode)
  useEffect(() => {
    dispatch(GetAllMedicalCasesDB.action({ page, reset: true }))
    if (firstLoading) {
      setFirstLoading(false)
    }
  }, [isConnected])

  useEffect(() => {
    if (searchTerm === '') {
      dispatch(
        GetAllMedicalCasesDB.action({
          page,
          reset: true,
          params: { filters: medicalCasesFilters, terms: searchTerm },
        }),
      )
    } else if (searchTerm.length >= 2) {
      debouncedSearch(searchTerm)
    }
  }, [searchTerm, medicalCasesFilters])

  /**
   * Reset filters and search terms. Fetch 15 latest patients
   */
  const handleRefresh = () => {
    dispatch(
      GetAllMedicalCasesDB.action({
        page: 1,
        reset: true,
        params: { filters: medicalCasesFilters, terms: '' },
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
        GetAllMedicalCasesDB.action({
          page: page + 1,
          params: { filters: medicalCasesFilters, terms: searchTerm },
        }),
      )
      setPage(page + 1)
    }
  }

  return (
    <Animated.View style={[Layout.fill, global.animation(fadeAnim)]}>
      <View style={[Gutters.regularHMargin, Gutters.smallVMargin]}>
        {medicalCasesError && <Error message={medicalCasesError.message} />}
      </View>
      <View style={Gutters.regularHMargin}>
        <View style={Layout.row}>
          <View style={[Layout.grow, Gutters.smallRMargin]}>
            <Autosuggest
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleReset={() => setSearchTerm('')}
            />
          </View>
          <TouchableOpacity
            style={searchBar.filterButton}
            onPress={() =>
              navigation.navigate('Filters', { source: 'medicalCases' })
            }
          >
            <Icon name="filters" size={FontSize.big} color={Colors.secondary} />
          </TouchableOpacity>
        </View>
        <BadgeBar
          removeBadge={badge =>
            dispatch(
              ChangeFilters.action({ source: 'medicalCases', item: badge }),
            )
          }
          selected={data}
          badgeComponentLabel={badge =>
            `${translate(nodes[badge.nodeId].label)} : ${translate(
              nodes[badge.nodeId].answers[badge.answerId].label,
            )}`
          }
          showClearAll
          onClearAll={() =>
            dispatch(ClearFilters.action({ source: 'medicalCases' }))
          }
        />
      </View>
      <View style={medicalCaseList.headerTable}>
        <Text style={medicalCaseList.headerText}>
          {t('containers.medical_case.list.name')}
        </Text>
        <Text style={medicalCaseList.headerText}>
          {t('containers.patient.list.last_visit')}
        </Text>
        <Text style={[medicalCaseList.headerText, Fonts.textCenter]}>
          {t('containers.medical_case.list.status')}
        </Text>
      </View>
      {firstLoading || medicalCasesLoading ? (
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

export default ListMedicalCaseContainer
