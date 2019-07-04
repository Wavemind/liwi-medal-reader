import NewSession from './NewSession.screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';

export default withApplication(withSessions(NewSession));
