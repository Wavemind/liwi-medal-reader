import React from 'react'
import { ScrollView, View } from 'react-native'

import {
  SearchBar,
  LoaderList,
  SectionHeader,
  SquareButton,
  Patient,
} from '@/Components'
import { useTheme } from '@/Theme'
import { useTranslation } from 'react-i18next'

const IndexHomeContainer = props => {
  const { navigation } = props

  const { t } = useTranslation()
  const {
    Containers: { home },
    Layout,
    Gutters,
  } = useTheme()

  return (
    <View style={[Layout.fill]}>
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
              onPress={() => navigation.navigate('TODO')}
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
          <Patient />
          <Patient />
          <Patient />
          <Patient />
          <Patient />
          <Patient />
          <Patient />
          <Patient />
          <LoaderList />
        </ScrollView>
      </View>
    </View>
  )
}

export default IndexHomeContainer
