/**
 * The external imports
 */
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import {
  SearchBar,
  SelectionBar,
  LoaderList,
  Icon,
  SectionHeader,
} from '@/Components'
import { useTheme } from '@/Theme'
import DiagnosisItem from '@/Containers/Diagnosis/DiagnosisItem'

const ListPatientContainer = props => {
  // Theme and style elements deconstruction
  const { navigation } = props

  const { t } = useTranslation()
  const {
    Layout,
    Fonts,
    Colors,
    FontSize,
    Gutters,
    Containers: { patientList },
  } = useTheme()

  // Local state definition
  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const algorithm = useSelector(state => state.algorithm.item)
  const additionalDiagnosis = useSelector(state => state.medicalCase.item)

  console.log(algorithm)
  console.log(additionalDiagnosis)

  useEffect(() => {
    let timer = setTimeout(
      () => setData(Object.values(algorithm.diagnostics)),
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
   * Load more patients
   */
  const loadMore = () => {
    console.log('TODO: load more')
    setData(data.concat([11, 12, 13, 14, 15]))
  }

  return (
    <View style={Gutters.regularHMargin}>
      <View style={[Layout.row, Layout.center, Gutters.regularTMargin]}>
        <Text
          style={[
            Layout.fill,
            Fonts.textUppercase,
            Fonts.textRegular,
            Fonts.textBold,
            { color: Colors.grey },
          ]}
        >
          {t('containers.filters.title')}
        </Text>
        <TouchableOpacity
          style={[
            {
              backgroundColor: Colors.red,
              borderRadius: 10,
            },
            Gutters.smallVPadding,
            Gutters.regularHPadding,
          ]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" color={Colors.secondary} />
        </TouchableOpacity>
      </View>
      <SearchBar navigation={navigation} />
      <SelectionBar />

      <SectionHeader label="Diagnosis" />

      <FlatList
        data={data}
        renderItem={({ item }) => <DiagnosisItem item={item} />}
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
