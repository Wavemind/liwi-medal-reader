/**
 * The external imports
 */
import React, { useState } from 'react'
import { Text, TouchableWithoutFeedback, View } from 'react-native'

/**
 * The internal imports
 */
import { useTheme } from '@/Theme'
import { Icon, AccordionItem } from '@/Components'

const Accordion = ({ list }) => {
  const [open, setOpen] = useState(false)
  const [height, setHeight] = useState(0)

  // Theme and style elements deconstruction
  const {
    Layout,
    Colors,
    Components: { accordion },
  } = useTheme()

  /**
   * Open or close accordion
   */
  const toggleAccordion = () => {
    let newHeight = 0

    setOpen(prev => !prev)

    if (!open) {
      newHeight = list.items.length * 70
    }

    setHeight(newHeight)
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={() => toggleAccordion()}>
        <View style={accordion.buttonWrapper(open)}>
          <Text style={accordion.buttonText(open)}>{list.label}</Text>
          <Icon
            name="right-arrow"
            size={15}
            color={open ? Colors.secondary : Colors.primary}
            style={open && Layout.rotate90}
          />
        </View>
      </TouchableWithoutFeedback>
      <View style={[accordion.contentWrapper, { height }]}>
        {list.items.map((item, key) => (
          <AccordionItem {...{ item, key }} />
        ))}
      </View>
    </>
  )
}

export default Accordion
