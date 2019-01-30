import RootSessions from './RootSessions.screen';
import { withNamespaces } from 'react-i18next';
import { withApplication } from '../../../engine/contexts/Application.context';
import { withSessions } from 'engine/contexts/Sessions.context';

export default withApplication(
  withSessions(withNamespaces(['login'])(RootSessions))
);
