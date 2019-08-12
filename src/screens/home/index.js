import { connect } from 'react-redux';
import Home from './Home.screen';
import { withSessions } from '../../engine/contexts/Sessions.context';
import { withApplication } from '../../engine/contexts/Application.context';

export default connect()(withSessions(withApplication(Home)));
