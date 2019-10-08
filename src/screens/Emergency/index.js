import Emergency from './Emergency.screen';
import { withSessions } from '../../engine/contexts/Sessions.context';
import { withApplication } from '../../engine/contexts/Application.context';

export default withSessions(withApplication(Emergency));
