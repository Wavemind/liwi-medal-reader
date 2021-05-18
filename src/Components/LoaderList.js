import React from 'react'
import { View } from 'react-native'

import { useTheme } from '@/Theme'
import ContentLoader, { Rect } from 'react-content-loader/native'

const LoaderList = props => {
  const { Layout } = useTheme()

  return (
    <View style={[Layout.fill]}>
      <ContentLoader
        speed={2}
        width={600}
        height={300}
        viewBox="0 0 600 300"
        backgroundColor={'#CBCDD1'}
        foregroundColor={'#BFC1C4'}
        {...props}
      >
        <Rect x="3" y="16" rx="0" ry="0" width="286" height="16" />
        <Rect x="4" y="42" rx="0" ry="0" width="121" height="10" />
        <Rect x="457" y="21" rx="0" ry="0" width="77" height="11" />
        <Rect x="4" y="76" rx="0" ry="0" width="286" height="16" />
        <Rect x="5" y="102" rx="0" ry="0" width="121" height="10" />
        <Rect x="459" y="81" rx="0" ry="0" width="77" height="11" />
        <Rect x="6" y="137" rx="0" ry="0" width="286" height="16" />
        <Rect x="7" y="163" rx="0" ry="0" width="121" height="10" />
        <Rect x="461" y="142" rx="0" ry="0" width="77" height="11" />
        <Rect x="5" y="197" rx="0" ry="0" width="286" height="16" />
        <Rect x="6" y="223" rx="0" ry="0" width="121" height="10" />
        <Rect x="460" y="202" rx="0" ry="0" width="77" height="11" />
        <Rect x="5" y="260" rx="0" ry="0" width="286" height="16" />
        <Rect x="6" y="286" rx="0" ry="0" width="121" height="10" />
        <Rect x="460" y="265" rx="0" ry="0" width="77" height="11" />
        <Rect x="446" y="280" rx="0" ry="0" width="104" height="21" />
        <Rect x="446" y="217" rx="0" ry="0" width="104" height="21" />
        <Rect x="447" y="157" rx="0" ry="0" width="104" height="21" />
        <Rect x="447" y="97" rx="0" ry="0" width="104" height="21" />
        <Rect x="447" y="36" rx="0" ry="0" width="104" height="21" />
      </ContentLoader>
    </View>
  )
}

export default LoaderList
