import SetCodeSession from './SetCodeSession.screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../../utils/WrapperNavigation';

export default withSessions(withApplication(WrapperNavigation(SetCodeSession)));
