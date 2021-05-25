/**
 * The external imports
 */
import React, { useEffect, useRef, useState } from 'react'
import { FlatList, View, Animated } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import {
  SearchBar,
  LoaderList,
  SectionHeader,
  SquareButton,
  MedicalCaseListItem,
} from '@/Components'
import { useTheme } from '@/Theme'
import { fadeIn } from '@/Theme/Animation'

const IndexHomeContainer = props => {
  // Theme and style elements deconstruction
  const { navigation } = props
  const { t } = useTranslation()
  const {
    Containers: { home, global },
    Layout,
    Gutters,
    Colors,
  } = useTheme()

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Local state definition
  const [data, setData] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

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
    setData(data.concat([11, 12, 13, 14, 15]))
  }

  return (
    <Animated.View style={[Layout.fill, global.animation(fadeAnim)]}>
      <View style={home.buttonsWrapper}>
        <SquareButton
          label={t('navigation.scan_qr_code')}
          icon="qr-scan"
          big
          onPress={() => navigation.navigate('Scan')}
          filled
        />
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

      <View style={[Gutters.regularHMargin]}>
        <SectionHeader label={t('containers.home.title')} />
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
    </Animated.View>
  )
}

export default IndexHomeContainer
