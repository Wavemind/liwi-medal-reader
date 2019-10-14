import UnlockSession from './UnlockSession.screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';
import { WrapperNavigation } from '../../../utils/WrapperNavigation';

export default withApplication(withSessions(WrapperNavigation(UnlockSession)));
