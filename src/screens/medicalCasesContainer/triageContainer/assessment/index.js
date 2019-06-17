import assessment from './Assessment.screen';
import { withSessions } from '../../../../engine/contexts/Sessions.context';
import { withApplication } from '../../../../engine/contexts/Application.context';
import { connect } from 'react-redux';

export default connect(
)(withSessions(withApplication(assessment)));
