import { Config } from '@/Config'
import { translate } from '@/Translations/algorithm'

export default nodes => {
  const data = []
  Object.values(nodes).forEach(node => {
    if (
      (node.category === Config.CATEGORIES.demographic ||
        node.category === Config.CATEGORIES.basicDemographic) &&
      (node.display_format === Config.DISPLAY_FORMAT.dropDownList ||
        node.display_format === Config.DISPLAY_FORMAT.radioButton)
    ) {
      const items = []

      Object.values(node.answers).map(answer => {
        items.push({
          nodeId: node.id,
          answerLabel: translate(answer.label),
          answerId: answer.id,
        })
      })

      data.push({
        nodeId: node.id,
        label: translate(node.label),
        items,
      })
    }
  })

  return data
}
