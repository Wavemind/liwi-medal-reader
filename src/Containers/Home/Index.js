/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import { ScrollView, View, Animated } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import {
  SearchBar,
  LoaderList,
  SectionHeader,
  SquareButton,
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
  } = useTheme()

  // Define references
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    fadeIn(fadeAnim)
  }, [fadeAnim])

  return (
    <Animated.View style={[Layout.fill, global.animation(fadeAnim)]}>
      <View style={home.buttonsWrapper}>
        <SquareButton
          label={t('navigation.scan_qr_code')}
          icon="qr-scan"
          onPress={() => navigation.navigate('TODO')}
          filled
        />
        <View style={home.buttonListWrapper}>
          <View style={home.patientListButton}>
            <SquareButton
              label={t('navigation.patient_list')}
              icon="patient-list"
              onPress={() => navigation.navigate('PatientList')}
            />
          </View>
          <View style={home.consultationsButton}>
            <SquareButton
              label={t('navigation.consultations')}
              icon="consult"
              onPress={() => navigation.navigate('TODO')}
            />
          </View>
        </View>
      </View>
      <SearchBar navigation={navigation} />

      <View style={[Gutters.regularHMargin]}>
        <SectionHeader label={t('containers.home.title')} />
        <ScrollView>
          <LoaderList />
        </ScrollView>
      </View>
    </Animated.View>
  )
}

export default IndexHomeContainer
