import Comorbidities from './Comorbidities.screen';
import { withSessions } from '../../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../../engine/contexts/Application.context';

export default withSessions(withApplication(Comorbidities));
