import { withNavigation } from 'react-navigation';

import ListContent from './ListContent';
import { withApplication } from '../../engine/contexts/Application.context';

export default withApplication(withNavigation(ListContent));
