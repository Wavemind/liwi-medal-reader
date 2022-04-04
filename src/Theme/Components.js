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
import toggleSwitchStyles from './components/ToggleSwitch.style'
import sectionHeaderStyles from './components/SectionHeader.style'
import infoStyles from './components/Info.style'
import clinicianStyles from './components/Clinician.style'
import customClinicianStyles from './components/CustomClinician.style'
import headerStyles from './components/Header.style'
import customDrawerContentStyles from './components/CustomDrawerContent.style'
import customDrawerItemStyles from './components/CustomDrawerItem.style'
import searchBarStyles from './components/SearchBar.style'
import tabBarStyles from './components/TabBar.style'
import sideBarStyles from './components/SideBar.style'
import badgeBarStyles from './components/BadgeBar.style'
import patientListItemStyles from './components/PatientListItem.style'
import currentConsultationsStyles from './components/CurrentConsultation.style'
import consultationListItemStyles from './components/ConsultationListItem.style'
import patientTabItemStyles from './components/PatientTabItem.style'
import consentListItemStyles from './components/ConsentListItem.style'
import badgeStyles from './components/Badge.style'
import accordionStyles from './components/Accordion.style'
import accordionItemStyles from './components/AccordionItem.style'
import medicalCaseDrawerStyles from './components/MedicalCaseDrawer.style'
import modalStyles from './components/Modal.style'
import questionStyles from './components/Question.style'
import movieStyles from './components/Movie.style'
import pictureStyles from './components/Picture.style'
import audioStyles from './components/Audio.style'
import numericStyles from './components/Numeric.style'
import stringStyles from './components/String.style'
import toggleStyles from './components/Toggle.style'
import consentStyles from './components/Consent.style'
import diagnosisItemStyles from './components/DiagnosisItem.style'
import autosuggestStyles from './components/Autosuggest.style'
import autocompleteStyles from './components/Autocomplete.style'
import additionalSelectStyles from './components/AdditionalSelect.style'
import errorStyles from './components/Error.style'
import medicalCaseListItemStyles from './components/MedicalCaseListItem.style'
import sectionSubHeaderStyles from './components/SectionSubHeader.style'
import metadataStyles from './components/Metadata.style'

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
    sectionSubHeader: sectionSubHeaderStyles(props),
    info: infoStyles(props),
    squareSelect: squareSelectStyles(props),
    toggleSwitch: toggleSwitchStyles(props),
    bottomNavbar: bottomNavbarStyles(props),
    clinician: clinicianStyles(props),
    customClinician: customClinicianStyles(props),
    header: headerStyles(props),
    customDrawerContent: customDrawerContentStyles(props),
    customDrawerItem: customDrawerItemStyles(props),
    searchBar: searchBarStyles(props),
    tabBar: tabBarStyles(props),
    sideBar: sideBarStyles(props),
    badgeBar: badgeBarStyles(props),
    patientListItem: patientListItemStyles(props),
    currentConsultation: currentConsultationsStyles(props),
    consultationListItem: consultationListItemStyles(props),
    patientTabItem: patientTabItemStyles(props),
    consentListItem: consentListItemStyles(props),
    badge: badgeStyles(props),
    accordion: accordionStyles(props),
    accordionItem: accordionItemStyles(props),
    medicalCaseDrawer: medicalCaseDrawerStyles(props),
    modal: modalStyles(props),
    question: questionStyles(props),
    movieController: movieStyles(props),
    picture: pictureStyles(props),
    audio: audioStyles(props),
    numeric: numericStyles(props),
    string: stringStyles(props),
    toggleComplaintCategory: toggleStyles(props),
    consent: consentStyles(props),
    diagnosisItem: diagnosisItemStyles(props),
    autosuggest: autosuggestStyles(props),
    autocomplete: autocompleteStyles(props),
    additionalSelect: additionalSelectStyles(props),
    error: errorStyles(props),
    medicalCaseListItem: medicalCaseListItemStyles(props),
    metadata: metadataStyles(props),
  }
}
