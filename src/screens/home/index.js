import Home from './Home.screen';
import { withApplication } from '../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../utils/WrapperNavigation';

export default withApplication(WrapperNavigation(Home));
