/**
 * The external imports
 */
import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  TouchableWithoutFeedback,
  touchableOpacity,
} from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon } from '@/Components'

const SearchBar = props => {
  // Props deconstruction
  const { navigation } = props

  // Theme and style elements deconstruction
  const { Colors, Gutters, Layout } = useTheme()

  // Local state definition

  return (
    <View style={[Layout.fill]}>
      <TouchableWithoutFeedback onPress={() => navigation.push('Search')}>
        <View>
          <View
            style={[
              {
                backgroundColor: Colors.white,
                borderWidth: 1,
                borderColor: 'grey',
                height: 70,
                ...Gutters.smallVMargin,
                ...Gutters.regularVPadding,
                ...Gutters.regularHMargin,
                borderRadius: 10,
              },
              Layout.row,
            ]}
            placeholder={'Search'}
          >
            <View style={[Layout.colCenter]}>
              <Icon name={'search'} />
            </View>
            <View style={[Layout.colCenter, Gutters.regularLMargin]}>
              <Text>Search</Text>
            </View>
          </View>
          {/* <touchableOpacity
            style={[{ backgroundColor: 'red' }]}
            onPress={() => console.log('Boom')}
          >
            <Icon name={'filtre'} />
          </touchableOpacity> */}
        </View>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default SearchBar
