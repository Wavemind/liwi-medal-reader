/**
 * The external imports
 */
import React from 'react'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { SearchBar } from '@/Components'

const IndexSearchContainer = () => {
  const { Layout } = useTheme()

  return <SearchBar autoFocus={true} />
}

export default IndexSearchContainer
