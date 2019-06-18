import { createMaterialTopTabNavigator } from 'react-navigation';
import Assessment from '../../screens/medicalCasesContainer/triageContainer/assessment';
import ChiefComplaint from '../../screens/medicalCasesContainer/triageContainer/chiefComplaint';
import Comorbidities from '../../screens/medicalCasesContainer/triageContainer/comorbidities';
import Vaccination from '../../screens/medicalCasesContainer/triageContainer/vaccination';
import VitalSigns from '../../screens/medicalCasesContainer/triageContainer/vitalSigns';
import TriageTabs from './TriageTabs';


export const TriageTabNavigator = createMaterialTopTabNavigator(
  {
    Assessment: {
      screen: Assessment,
    },
    VitalSigns: {
      screen: VitalSigns,
    },
    Comorbidities: {
      screen: Comorbidities,
    },
    Vaccination: {
      screen: Vaccination,
    },
    ChiefComplaint: {
      screen: ChiefComplaint,
    },
  },
  {
    tabBarOptions: {
      activeTintColor: '#e91e63',
    },
    tabBarComponent: TriageTabs, // TODO nice Tabs menu
  }
);
