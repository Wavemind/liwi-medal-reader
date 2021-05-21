/**
 * The external imports
 */
import React from 'react'
import { ScrollView, View, Text, TouchableOpacity } from 'react-native'
import { useTranslation } from 'react-i18next'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SectionHeader, Icon } from '@/Components'

const IndexFiltersContainer = ({ navigation }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const { Colors, Gutters, Layout, Fonts } = useTheme()

  return (
    <ScrollView contentContainerStyle={[Gutters.regularHMargin]}>
      <View style={[Layout.row, Layout.center, Gutters.regularTMargin]}>
        <Text
          style={[
            Layout.fill,
            Fonts.textUppercase,
            Fonts.textRegular,
            Fonts.textBold,
            { color: 'red' },
          ]}
        >
          Filters
        </Text>
        <TouchableOpacity
          style={[
            { backgroundColor: 'red', borderRadius: 10 },
            Gutters.smallVPadding,
            Gutters.regularHPadding,
          ]}
        >
          <Icon name={'close'} color={Colors.secondary} />
        </TouchableOpacity>
      </View>

      <SectionHeader label={t('containers.filters.patient_info')} />
      <View>
        
      </View>
      <SectionHeader label={t('containers.filters.others')} />
    </ScrollView>
  )
}

export default IndexFiltersContainer
