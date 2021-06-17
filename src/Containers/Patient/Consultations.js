/**
 * The external imports
 */
import React, { useState, useEffect } from 'react'
import { View, FlatList, Text } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import {
  SectionHeader,
  SquareButton,
  LoaderList,
  MedicalCaseListItem,
} from '@/Components'

// TODO check if this component is used anywhere
const ConsultationPatientContainer = ({ navigation }) => {
  const { t } = useTranslation()

  const {
    Containers: {},
    Gutters,
  } = useTheme()

  // Local state definition
  const [caseInProgress, setCaseInProgress] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    let timer = setTimeout(() => setData([]), 2 * 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  /**
   * Fetch 15 latest medical cases
   */
  const handleRefresh = () => {
    setRefreshing(true)
    console.log('TODO: handle refresh')
    setTimeout(() => setRefreshing(false), 2 * 1000)
  }

  /**
   * Load more medical case
   */
  const loadMore = () => {
    console.log('TODO: load more')
    setData(data.concat([]))
  }

  return (
    <View>
      <View style={[Gutters.regularHMargin, Gutters.regularTMargin]}>
        {caseInProgress ? (
          <>
            <SectionHeader
              label={t('containers.patient.consultations.current_consultation')}
            />
            <Text>Other stuff</Text>
          </>
        ) : (
          <SquareButton
            label={t('actions.new_medical_case')}
            icon="add"
            onPress={() => navigation.navigate('TODO')}
          />
        )}

        <SectionHeader
          label={t('containers.patient.consultations.last_consultations')}
        />
      </View>
      <View>
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
    </View>
  )
}

export default ConsultationPatientContainer
