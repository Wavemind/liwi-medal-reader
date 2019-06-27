import SetCodeSession from './SetCodeSession.screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../engine/contexts/Application.context';
import { withNamespaces } from 'react-i18next';

export default withSessions(withApplication(withNamespaces(['login'])(SetCodeSession)));
