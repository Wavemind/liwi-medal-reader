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
import { SectionHeader, Icon, Accordion } from '@/Components'

const IndexFiltersContainer = ({ navigation }) => {
  // Theme and style elements deconstruction
  const { t } = useTranslation()
  const {
    Colors,
    Gutters,
    Containers: { filters },
  } = useTheme()

  const data = [
    {
      label: 'Gender',
      items: [
        {
          label: 'Female',
          value: 'female',
        },
        {
          label: 'Male',
          value: 'male',
        },
      ],
    },
    {
      label: 'Other',
      items: [
        {
          label: 'One',
          value: 'one',
        },
        {
          label: 'Two',
          value: 'two',
        },
        {
          label: 'Three',
          value: 'three',
        },
        {
          label: 'Four',
          value: 'four',
        },
        {
          label: 'Five',
          value: 'five',
        },
      ],
    },
  ]

  return (
    <View style={Gutters.regularHMargin}>
      <View style={filters.wrapper}>
        <Text style={filters.title}>{t('containers.filters.title')}</Text>
        <TouchableOpacity
          style={filters.button}
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" color={Colors.secondary} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={Gutters.regularHMargin}>
        <SectionHeader label={t('containers.filters.patient_info')} />

        {data.map(item => (
          <Accordion key={item.label} list={item} />
        ))}

        <SectionHeader label={t('containers.filters.others')} />
      </ScrollView>
    </View>
  )
}

export default IndexFiltersContainer
