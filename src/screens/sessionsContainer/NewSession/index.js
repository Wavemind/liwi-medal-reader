import NewSession from './NewSession.screen';
import { withSessions } from '../../../engine/contexts/Sessions.context';
import { withNamespaces } from 'react-i18next';

export default withSessions(withNamespaces(['login'])(NewSession));
