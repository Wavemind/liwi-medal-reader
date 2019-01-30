import Sessions from './Sessions';
import { withSessions } from '../../engine/contexts/Sessions.context';
import { withApplication } from '../../engine/contexts/Application.context';
import { withNamespaces } from 'react-i18next';

export default withApplication(
  withSessions(withNamespaces(['sessions'])(Sessions))
);
