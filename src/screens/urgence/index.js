import Urgence from './Urgence.screen';
import { withSessions } from '../../engine/contexts/Sessions.context';
import { withApplication } from '../../engine/contexts/Application.context';

export default withSessions(withApplication(Urgence));
