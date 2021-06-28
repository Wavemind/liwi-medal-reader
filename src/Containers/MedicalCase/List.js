/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
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
} from '@/Components'
import { useTheme } from '@/Theme'

const ListMedicalCaseContainer = props => {
  // Theme and style elements deconstruction
  const { navigation } = props

  const { t } = useTranslation()
  const {
    Layout,
    Fonts,
    Gutters,
    FontSize,
    Colors,
    Components: { searchBar },
    Containers: { medicalCaseList },
  } = useTheme()

  // Local state definition
  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    let timer = setTimeout(() => setData([]), 2 * 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  /**
   * Reset filters and search terms. Fetch 15 latest patients
   */
  const handleRefresh = () => {
    setRefreshing(true)
    console.log('TODO: handle refresh')
    setTimeout(() => setRefreshing(false), 2 * 1000)
  }

  /**
   * Load more patients
   */
  const loadMore = () => {
    console.log('TODO: load more')
    setData(data.concat([]))
  }

  return (
    <View style={Layout.fill}>
      <View style={Gutters.regularHMargin}>
        <View style={Layout.row}>
          <View style={[Layout.grow, Gutters.smallRMargin]}>
            <Autosuggest
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              handleReset={() => setSearchTerm('')}
              autofocus
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
          removeBadge={() => console.log('TODO Remove selected badge')}
          selected={[
            { filterBy: 'Gender', value: 'Female' },
            { filterBy: 'Age', value: '12' },
          ]}
          clearBadges={() => console.log('TODO Clear selected badges')}
          badgeComponentLabel={item => `${item.filterBy} : ${item.value}`}
          showClearAll
        />
      </View>

      <View style={medicalCaseList.headerTable}>
        <Text style={medicalCaseList.headerText}>
          {t('containers.medical_case.list.name')}
        </Text>
        <Text style={[medicalCaseList.headerText, Fonts.textCenter]}>
          {t('containers.medical_case.list.status')}
        </Text>
      </View>

      <FlatList
        data={data}
        renderItem={({ item }) => <MedicalCaseListItem item={item} />}
        keyExtractor={item => item.id}
        ListEmptyComponent={<LoaderList />}
        onRefresh={() => handleRefresh()}
        refreshing={refreshing}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.1}
      />
    </View>
  )
}

export default ListMedicalCaseContainer
