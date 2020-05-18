import Filter from './Filter.screen';
import { withApplication } from '../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../utils/WrapperNavigation';

export default withApplication(WrapperNavigation(Filter));
