/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { ConsentListItem, LoaderList } from '@/Components'
import { useTheme } from '@/Theme'

const ListConsentContainer = props => {
  const { t } = useTranslation()
  const {
    Layout,
    Fonts,
    Containers: { consentList },
  } = useTheme()

  // Local state definition
  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    let timer = setTimeout(
      () => setData([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      2 * 1000,
    )

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
   * Load more consents
   */
  const loadMore = () => {
    console.log('TODO: load more')
    setData(data.concat([11, 12, 13, 14, 15]))
  }

  return (
    <View style={Layout.fill}>
      <View style={consentList.headerTable}>
        <Text style={consentList.headerText}>
          {t('containers.patient.list.name')}
        </Text>
        <Text style={[consentList.headerText, Fonts.textCenter]}>
          {t('containers.patient.list.last_visit')}
        </Text>
      </View>

      <FlatList
        data={data}
        renderItem={({ item }) => <ConsentListItem item={item} />}
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

export default ListConsentContainer
