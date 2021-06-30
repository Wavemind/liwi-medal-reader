/**
 * The external imports
 */
import React, { useState } from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native'
import { useSelector } from 'react-redux'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon, AccordionItem } from '@/Components'
import { hp } from '@/Theme/Responsive'

const Accordion = ({ data, source }) => {
  // Theme and style elements deconstruction
  const {
    Layout,
    Colors,
    Components: { accordion },
  } = useTheme()

  const currentFilter = useSelector(state => state.filters[source][data.nodeId])

  const [open, setOpen] = useState(false)
  const [height, setHeight] = useState(0)

  /**
   * Open or close accordion
   */
  const toggleAccordion = () => {
    let newHeight = 0

    setOpen(prev => !prev)

    if (!open) {
      newHeight = data.items.length * hp(6.1)
    }

    setHeight(newHeight)
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={() => toggleAccordion()}>
        <View style={accordion.buttonWrapper(open)}>
          <View style={accordion.buttonTextWrapper}>
            <Text style={accordion.buttonText(open)}>{data.label}</Text>
          </View>
          <View style={accordion.badgeWrapper}>
            {currentFilter !== undefined && (
              <View style={accordion.badge(open)}>
                <Text style={accordion.badgeText(open)}>
                  {currentFilter.length}
                </Text>
              </View>
            )}
          </View>
          <View style={accordion.iconWrapper}>
            <Icon
              name="right-arrow"
              size={15}
              color={open ? Colors.secondary : Colors.primary}
              style={open && Layout.rotate90}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
      <View style={[accordion.contentWrapper(open), { height }]}>
        {data.items.map((item, key) => (
          <AccordionItem {...{ item, key, source }} />
        ))}
      </View>
    </>
  )
}

export default Accordion
