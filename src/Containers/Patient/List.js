/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { SearchBar, PatientListItem, BadgeBar, LoaderList } from '@/Components'
import { useTheme } from '@/Theme'
import useDatabase from '@/Services/Database/useDatabase'

const ListPatientContainer = props => {
  // Theme and style elements deconstruction
  const { navigation } = props

  const { getAll } = useDatabase()
  const { t } = useTranslation()
  const {
    Layout,
    Fonts,
    Containers: { patientList },
  } = useTheme()

  // Local state definition
  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const getPatients = async () => {
    const patients = await getAll('Patient')
    setData(patients)
  }

  useEffect(() => {
    getPatients()
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
    //setData(data.concat([11, 12, 13, 14, 15]))
  }

  return (
    <View style={Layout.fill}>
      <SearchBar navigation={navigation} filters />
      <BadgeBar
        removeBadge={() => console.log('TODO Remove selected badge')}
        selected={[
          { filterBy: 'Gender', value: 'Female' },
          { filterBy: 'Age', value: '12' },
        ]}
        clearBadges={() => console.log('TODO Clear selected badges')}
        badgeComponentLabel={item => `${item.filterBy} : ${item.value}`}
      />

      <View style={patientList.headerTable}>
        <Text style={patientList.headerText}>
          {t('containers.patient.list.name')}
        </Text>
        <Text style={[patientList.headerText, Fonts.textCenter]}>
          {t('containers.patient.list.last_visit')}
        </Text>
        <Text style={[patientList.headerText, Fonts.textCenter]}>
          {t('containers.patient.list.status')}
        </Text>
      </View>

      <FlatList
        data={data}
        renderItem={({ item }) => <PatientListItem item={item} />}
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

export default ListPatientContainer
