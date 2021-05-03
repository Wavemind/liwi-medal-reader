/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import squareButtonStyles from './components/SquareButton.style'
import roundedButtonStyles from './components/RoundedButton.style'
import checkboxStyles from './components/Checkbox.style'
import booleanButtonStyles from './components/BooleanButtons.style'
import selectStyles from './components/Select.style'
import squareSelectStyles from './components/SquareSelect.style'
import sectionHeaderStyles from './components/SectionHeader.style'
import infoStyles from './components/Info.style'
/**
 *
 * @props Theme can be spread like {Colors, NavigationColors, Gutters, Layout, Common, ...args}
 * @return {*}
 */
export default function (props) {
  return {
    booleanButton: booleanButtonStyles(props),
    squareButton: squareButtonStyles(props),
    roundedButton: roundedButtonStyles(props),
    checkbox: checkboxStyles(props),
    select: selectStyles(props),
    sectionHeader: sectionHeaderStyles(props),
    info: infoStyles(props),
    squareSelect: squareSelectStyles(props),
  }
}
