import TabsNavigation from './ConsultationTabs.navigation';
import { withSessions } from '../../contexts/Sessions.context';
import { withApplication } from '../../contexts/Application.context';

export default withSessions(withApplication(TabsNavigation));
