/**
 * This file defines the base application styles.
 *
 * Use it to define generic component styles (e.g. the default text styles, default button styles...).
 */
import squareButtonStyles from './components/SquareButton.style'
import roundedButtonStyles from './components/RoundedButton.style'
import bottomNavbarStyles from './components/BottomNavbar.style'
import checkboxStyles from './components/Checkbox.style'
import booleanButtonStyles from './components/BooleanButtons.style'
import selectStyles from './components/Select.style'
import squareSelectStyles from './components/SquareSelect.style'
import sectionHeaderStyles from './components/SectionHeader.style'
import infoStyles from './components/Info.style'
import clinicianStyles from './components/Clinician.style'
import headerStyles from './components/Header.style'
import customDrawerContentStyles from './components/CustomDrawerContent.style'
import customDrawerItemStyles from './components/CustomDrawerItem.style'
import searchBarStyles from './components/SearchBar.style'
import tabBarStyles from './components/TabBar.style'
import sideBarStyles from './components/SideBar.style'
import filterBarStyles from './components/FilterBar.style'
import patientListItemStyles from './components/PatientListItem.style'
import consentListItemStyles from './components/ConsentListItem.style'
import badgeStyles from './components/Badge.style'
import accordionStyles from './components/Accordion.style'
import accordionItemStyles from './components/AccordionItem.style'
import medicalCaseDrawerStyles from './components/MedicalCaseDrawer.style'
import questionStyles from './components/Question.style'
import movieStyles from './components/Movie.style'
import pictureStyles from './components/Picture.style'
import audioStyles from './components/Audio.style'

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
    bottomNavbar: bottomNavbarStyles(props),
    clinician: clinicianStyles(props),
    header: headerStyles(props),
    customDrawerContent: customDrawerContentStyles(props),
    customDrawerItem: customDrawerItemStyles(props),
    searchBar: searchBarStyles(props),
    tabBar: tabBarStyles(props),
    sideBar: sideBarStyles(props),
    filterBar: filterBarStyles(props),
    patientListItem: patientListItemStyles(props),
    consentListItem: consentListItemStyles(props),
    badge: badgeStyles(props),
    accordion: accordionStyles(props),
    accordionItem: accordionItemStyles(props),
    medicalCaseDrawer: medicalCaseDrawerStyles(props),
    question: questionStyles(props),
    movieController: movieStyles(props),
    picture: pictureStyles(props),
    audio: audioStyles(props),
  }
}
