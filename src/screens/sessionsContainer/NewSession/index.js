import NewSession from './NewSession.screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withNamespaces } from 'react-i18next';
import { withApplication } from '../../../engine/contexts/Application.context';

export default withApplication(withSessions(withNamespaces(['login'])(NewSession)));
