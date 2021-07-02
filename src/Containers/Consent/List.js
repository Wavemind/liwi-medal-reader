/**
 * The external imports
 */
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { View, Text, FlatList, Animated } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { ConsentListItem, LoaderList, EmptyList, Error } from '@/Components'
import { useTheme } from '@/Theme'
import { fadeIn } from '@/Theme/Animation'
import GetAllPatientWithConsentDB from '@/Store/DatabasePatient/GetAllWithConsent'

const ListConsentContainer = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const {
    Gutters,
    Layout,
    Fonts,
    Containers: { consentList },
  } = useTheme()

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  // Local state definition
  const [page, setPage] = useState(1)
  const [firstLoading, setFirstLoading] = useState(true)

  const patientWithConsent = useSelector(
    state => state.databasePatient.getAllWithConsent.item.data,
  )
  const isLastBatch = useSelector(
    state => state.databasePatient.getAllWithConsent.item.isLastBatch,
  )
  const patientConsentLoading = useSelector(
    state => state.databasePatient.getAllWithConsent.loading,
  )
  const patientConsentError = useSelector(
    state => state.databasePatient.getAllWithConsent.error,
  )

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  useEffect(() => {
    dispatch(GetAllPatientWithConsentDB.action({ page, reset: true }))
    setFirstLoading(false)
  }, [])

  /**
   * Reset filters and search terms. Fetch 15 latest patients
   */
  const handleRefresh = () => {
    dispatch(GetAllPatientWithConsentDB.action({ page: 1, reset: true }))
  }

  /**
   * Load more consents
   */
  const loadMore = () => {
    if (!isLastBatch) {
      dispatch(GetAllPatientWithConsentDB.action({ page: page + 1 }))
      setPage(page + 1)
    }
  }

  return (
    <View style={Layout.fill}>
      <View style={[Gutters.regularHMargin, Gutters.smallVMargin]}>
        {patientConsentError && <Error message={patientConsentError.message} />}
      </View>
      <View style={consentList.headerTable}>
        <Text style={consentList.headerText}>
          {t('containers.patient.list.name')}
        </Text>
        <Text style={[consentList.headerText, Fonts.textCenter]}>
          {t('containers.patient.list.last_visit')}
        </Text>
      </View>

      {firstLoading || patientConsentLoading ? (
        <LoaderList />
      ) : (
        <FlatList
          data={patientWithConsent}
          renderItem={({ item }) => <ConsentListItem item={item} />}
          keyExtractor={item => item.id}
          ListEmptyComponent={<EmptyList text={t('application.no_results')} />}
          onRefresh={handleRefresh}
          refreshing={patientConsentLoading}
          onEndReached={() => loadMore()}
          onEndReachedThreshold={0.1}
        />
      )}
    </View>
  )
}

export default ListConsentContainer
