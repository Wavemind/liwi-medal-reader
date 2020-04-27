import { withNavigation } from 'react-navigation';
import Stepper from './Stepper';
import { withApplication } from '../../engine/contexts/Application.context';

export default withNavigation(withApplication(Stepper));
