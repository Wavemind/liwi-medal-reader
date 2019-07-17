import { withSessions } from 'engine/contexts/Sessions.context';
import { withApplication } from 'engine/contexts/Application.context';
import Algorithms from './Algorithms.screen';

export default withSessions(withApplication(Algorithms));
