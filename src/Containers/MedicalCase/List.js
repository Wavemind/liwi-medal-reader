/**
 * The external imports
 */
import React, { useEffect, useRef, useState } from 'react'
import { Animated, View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

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
import GetAllMedicalCasesDB from '@/Store/DatabaseMedicalCase/GetAll'

const ListMedicalCaseContainer = props => {
  // Theme and style elements deconstruction
  const { navigation } = props

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const {
    Layout,
    Fonts,
    Gutters,
    FontSize,
    Colors,
    Components: { searchBar },
    Containers: { medicalCaseList, global },
  } = useTheme()

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Local state definition
  const [page, setPage] = useState(1)
  const [firstLoading, setFirstLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState([
    { filterBy: 'Gender', value: 'Female' },
    { filterBy: 'Age', value: '12' },
  ])

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

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  useEffect(() => {
    dispatch(GetAllMedicalCasesDB.action({ page, reset: true }))
    setFirstLoading(false)
  }, [])

  useEffect(() => {
    if (searchTerm === '') {
      dispatch(
        GetAllMedicalCasesDB.action({
          page,
          reset: true,
        }),
      )
    } else if (searchTerm.length >= 2) {
      dispatch(
        GetAllMedicalCasesDB.action({
          page,
          reset: true,
          params: { terms: searchTerm },
        }),
      )
    }
  }, [searchTerm])

  const resetFilters = () => {
    setSearchTerm('')
    setFilters([])
  }
  /**
   * Reset filters and search terms. Fetch 15 latest patients
   */
  const handleRefresh = () => {
    dispatch(GetAllMedicalCasesDB.action({ page: 1, reset: true }))
    setPage(1)
    resetFilters()
  }

  /**
   * Load more patients
   */
  const loadMore = () => {
    if (!isLastBatch) {
      dispatch(GetAllMedicalCasesDB.action({ page: page + 1 }))
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
      <View style={medicalCaseList.headerTable}>
        <Text style={medicalCaseList.headerText}>
          {t('containers.medicalCase.list.name')}
        </Text>
        <Text style={[medicalCaseList.headerText, Fonts.textCenter]}>
          {t('containers.medicalCase.list.status')}
        </Text>
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

export default ListMedicalCaseContainer
